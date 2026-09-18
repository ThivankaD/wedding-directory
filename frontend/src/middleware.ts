import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to extract the cookie value from request
function getCookie(name: string, request: NextRequest) {
  const cookie = request.cookies.get(name);
  return cookie ? cookie.value : null;
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
  const vendorToken = getCookie('access_tokenVendor', request);
  const visitorToken = getCookie('access_token', request);

  const isVendorRoute = vendorRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  const isVisitorRoute = visitorRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // 1. Handle vendor routes (/vendor-dashboard, /services/edit, etc.)
  if (isVendorRoute) {
    if (vendorToken) {
      const response = NextResponse.next();
      // Clean up lingering visitor token to avoid auth conflict
      if (visitorToken) {
        response.cookies.delete('access_token');
      }
      return response;
    }

    // If not authenticated as vendor, but has visitor token, redirect to visitor dashboard
    if (visitorToken) {
      return NextResponse.redirect(new URL('/visitor-dashboard', request.url));
    }

    // Not authenticated at all, redirect to vendor login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Handle visitor routes (/visitor-dashboard, /visitor-profile, etc.)
  if (isVisitorRoute) {
    if (visitorToken) {
      const response = NextResponse.next();
      // Clean up lingering vendor token to avoid auth conflict
      if (vendorToken) {
        response.cookies.delete('access_tokenVendor');
      }
      return response;
    }

    // If not authenticated as visitor, but has vendor token, redirect to vendor dashboard
    if (vendorToken) {
      return NextResponse.redirect(new URL('/vendor-dashboard', request.url));
    }

    // Not authenticated at all, redirect to visitor login
    return NextResponse.redirect(new URL('/visitor-login', request.url));
  }

  // Fallback for any other protected routes matched by config
  if (!vendorToken && !visitorToken) {
    return NextResponse.redirect(new URL('/visitor-login', request.url));
  }

  return NextResponse.next();
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