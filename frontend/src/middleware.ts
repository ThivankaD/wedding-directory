import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to extract the cookie value from request
function getCookie(name: string, request: NextRequest) {
  const cookie = request.cookies.get(name);
  return cookie ? cookie.value : null;
}

// Helper function to check if a JWT token is expired in Edge runtime
function isTokenExpired(rawToken: string | null): boolean {
  if (!rawToken) return true;
  try {
    const token = rawToken.replace(/^["']|["']$/g, "").trim();
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const payload = JSON.parse(atob(base64));
    if (payload.exp && typeof payload.exp === "number") {
      // Allow 30 seconds clock skew tolerance
      return payload.exp * 1000 <= Date.now() - 30000;
    }
    return false;
  } catch {
    return true;
  }
}

// Route definitions
const publicRoutes = ["/about", "/contact"];
const visitorRoutes = ["/visitor-profile", "/visitor-dashboard"];
const vendorRoutes = ["/vendor-dashboard", "/services/edit"];
const visitorAuthRoutes = ["/visitor-login", "/visitor-signup"];
const vendorAuthRoutes = ["/login", "/sign-up"];

// Middleware to handle role-based authentication redirection
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return NextResponse.next();
  }

  // Get auth tokens
  const rawVendorToken = getCookie("access_tokenVendor", request);
  const rawVisitorToken = getCookie("access_token", request);

  const vendorTokenExpired = rawVendorToken
    ? isTokenExpired(rawVendorToken)
    : false;
  const visitorTokenExpired = rawVisitorToken
    ? isTokenExpired(rawVisitorToken)
    : false;

  const vendorToken = vendorTokenExpired ? null : rawVendorToken;
  const visitorToken = visitorTokenExpired ? null : rawVisitorToken;

  const isVendorRoute = vendorRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isVisitorRoute = visitorRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isVisitorAuth = visitorAuthRoutes.some((route) => pathname === route);
  const isVendorAuth = vendorAuthRoutes.some((route) => pathname === route);

  // Helper to attach cookie cleanup to responses
  const cleanResponse = <T extends NextResponse>(res: T): T => {
    if (vendorTokenExpired && rawVendorToken) {
      res.cookies.delete("access_tokenVendor");
    }
    if (visitorTokenExpired && rawVisitorToken) {
      res.cookies.delete("access_token");
    }
    return res;
  };

  // Do not show the public landing page to an authenticated user returning to the site.
  if (pathname === "/") {
    if (vendorToken) {
      return cleanResponse(
        NextResponse.redirect(new URL("/vendor-dashboard", request.url)),
      );
    }
    if (visitorToken) {
      return cleanResponse(
        NextResponse.redirect(new URL("/visitor-dashboard", request.url)),
      );
    }
    return cleanResponse(NextResponse.next());
  }

  // If already authenticated and visiting auth pages, forward directly to respective dashboard
  if (isVisitorAuth) {
    if (visitorToken) {
      return cleanResponse(
        NextResponse.redirect(new URL("/visitor-dashboard", request.url)),
      );
    }
    return NextResponse.next();
  }

  if (isVendorAuth) {
    if (vendorToken) {
      return cleanResponse(
        NextResponse.redirect(new URL("/vendor-dashboard", request.url)),
      );
    }
    return NextResponse.next();
  }

  // 1. Handle vendor routes (/vendor-dashboard, /services/edit, etc.)
  if (isVendorRoute) {
    if (vendorToken) {
      const response = cleanResponse(NextResponse.next());
      // Clean up lingering visitor token to avoid auth conflict
      if (rawVisitorToken) {
        response.cookies.delete("access_token");
      }
      return response;
    }

    // If not authenticated as vendor, but has valid visitor token, redirect to visitor dashboard
    if (visitorToken) {
      return cleanResponse(
        NextResponse.redirect(new URL("/visitor-dashboard", request.url)),
      );
    }

    // Not authenticated at all, redirect to vendor login
    return cleanResponse(NextResponse.redirect(new URL("/login", request.url)));
  }

  // 2. Handle visitor routes (/visitor-dashboard, /visitor-profile, etc.)
  if (isVisitorRoute) {
    if (visitorToken) {
      const response = cleanResponse(NextResponse.next());
      // Clean up lingering vendor token to avoid auth conflict
      if (rawVendorToken) {
        response.cookies.delete("access_tokenVendor");
      }
      return response;
    }

    // If not authenticated as visitor, but has valid vendor token, redirect to vendor dashboard
    if (vendorToken) {
      return cleanResponse(
        NextResponse.redirect(new URL("/vendor-dashboard", request.url)),
      );
    }

    // Not authenticated at all, redirect to visitor login
    return cleanResponse(
      NextResponse.redirect(new URL("/visitor-login", request.url)),
    );
  }

  // Fallback for any other protected routes matched by config
  if (!vendorToken && !visitorToken) {
    return cleanResponse(
      NextResponse.redirect(new URL("/visitor-login", request.url)),
    );
  }

  return cleanResponse(NextResponse.next());
}

// Configure the matcher for middleware to apply to relevant routes
export const config = {
  matcher: [
    "/", // Redirect authenticated users from the landing page
    "/vendor-dashboard/:path*", // Apply middleware to all vendor routes
    "/visitor-profile", // Apply middleware to visitor profile
    "/visitor-dashboard/:path*", // Apply middleware to visitor dashboard and nested pages
    "/visitor-login", // Redirect if already authenticated
    "/visitor-signup", // Redirect if already authenticated
    "/login", // Redirect if already authenticated
    "/sign-up", // Redirect if already authenticated
    "/about", // Public pages can still have middleware (for logging or tracking)
    "/contact", // Add other public routes here
    "/services/edit/:id*", // Add this pattern
  ],
};
