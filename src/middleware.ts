import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-User-Email, X-User-ID');
    if (request.method === 'OPTIONS') {
        return response;
    }
    if (request.nextUrl.pathname.startsWith('/dashboard') || 
        request.nextUrl.pathname.startsWith('/admin')) {
        const userEmail = request.headers.get('x-user-email');
        const userId = request.headers.get('x-user-id');
        if (!userEmail && !userId) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
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
