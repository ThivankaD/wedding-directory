import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to extract the cookie value from request
function getCookie(name: string, request: NextRequest) {
  const cookie = request.cookies.get(name);
  return cookie ? cookie.value : null;
}

// Helper function to check if a JWT token is expired in Edge runtime
function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && typeof payload.exp === 'number') {
      return payload.exp * 1000 <= Date.now();
    }
    return false;
  } catch {
    return true;
  }
}

// Route definitions
const publicRoutes = ['/about', '/contact'];
const visitorRoutes = ['/visitor-profile', '/visitor-dashboard'];
const vendorRoutes = ['/vendor-dashboard', '/services/edit'];

// Middleware to handle role-based authentication redirection
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // Get auth tokens
  const rawVendorToken = getCookie('access_tokenVendor', request);
  const rawVisitorToken = getCookie('access_token', request);

  const vendorTokenExpired = rawVendorToken ? isTokenExpired(rawVendorToken) : false;
  const visitorTokenExpired = rawVisitorToken ? isTokenExpired(rawVisitorToken) : false;

  const vendorToken = vendorTokenExpired ? null : rawVendorToken;
  const visitorToken = visitorTokenExpired ? null : rawVisitorToken;

  const isVendorRoute = vendorRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  const isVisitorRoute = visitorRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // Helper to attach cookie cleanup to responses
  const cleanResponse = <T extends NextResponse>(res: T): T => {
    if (vendorTokenExpired && rawVendorToken) {
      res.cookies.delete('access_tokenVendor');
    }
    if (visitorTokenExpired && rawVisitorToken) {
      res.cookies.delete('access_token');
    }
    return res;
  };

  // 1. Handle vendor routes (/vendor-dashboard, /services/edit, etc.)
  if (isVendorRoute) {
    if (vendorToken) {
      const response = cleanResponse(NextResponse.next());
      // Clean up lingering visitor token to avoid auth conflict
      if (rawVisitorToken) {
        response.cookies.delete('access_token');
      }
      return response;
    }

    // If not authenticated as vendor, but has valid visitor token, redirect to visitor dashboard
    if (visitorToken) {
      return cleanResponse(NextResponse.redirect(new URL('/visitor-dashboard', request.url)));
    }

    // Not authenticated at all, redirect to vendor login
    return cleanResponse(NextResponse.redirect(new URL('/login', request.url)));
  }

  // 2. Handle visitor routes (/visitor-dashboard, /visitor-profile, etc.)
  if (isVisitorRoute) {
    if (visitorToken) {
      const response = cleanResponse(NextResponse.next());
      // Clean up lingering vendor token to avoid auth conflict
      if (rawVendorToken) {
        response.cookies.delete('access_tokenVendor');
      }
      return response;
    }

    // If not authenticated as visitor, but has valid vendor token, redirect to vendor dashboard
    if (vendorToken) {
      return cleanResponse(NextResponse.redirect(new URL('/vendor-dashboard', request.url)));
    }

    // Not authenticated at all, redirect to visitor login
    return cleanResponse(NextResponse.redirect(new URL('/visitor-login', request.url)));
  }

  // Fallback for any other protected routes matched by config
  if (!vendorToken && !visitorToken) {
    return cleanResponse(NextResponse.redirect(new URL('/visitor-login', request.url)));
  }

  return cleanResponse(NextResponse.next());
}

// Configure the matcher for middleware to apply to relevant routes
export const config = {
  matcher: [
    '/vendor-dashboard/:path*',   // Apply middleware to all vendor routes
    '/visitor-profile',           // Apply middleware to visitor profile
    '/visitor-dashboard/:path*',  // Apply middleware to visitor dashboard and nested pages
    '/about',                     // Public pages can still have middleware (for logging or tracking)
    '/contact',                   // Add other public routes here
    '/services/edit/:id*',        // Add this pattern
  ],
};