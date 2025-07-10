import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Add CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-User-Email, X-User-ID');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return response;
    }

    // Check for admin routes protection (if you have dashboard/admin pages in this backend)
    if (request.nextUrl.pathname.startsWith('/dashboard') || 
        request.nextUrl.pathname.startsWith('/admin')) {
        
        // Check if user info is provided by frontend (after NextAuth verification)
        const userEmail = request.headers.get('x-user-email');
        const userId = request.headers.get('x-user-id');
        
        if (!userEmail && !userId) {
            // Redirect to your frontend login page
            return NextResponse.redirect(new URL('/login', request.url));
        }
        
        // Additional admin check would happen in the actual route handlers
        // using the requireAdmin() function
    }

    return response;
}

export const config = {
    matcher: [
        '/api/:path*', 
        '/dashboard/:path*', 
        '/admin/:path*'
    ],
};