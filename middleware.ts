import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Handle preflight requests (OPTIONS method)
    if (req.method === "OPTIONS") {
        res.headers.set("Access-Control-Allow-Origin", "https://wesleyvanderkraan.vercel.app"); // Allow specific domain
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.headers.set(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        return new NextResponse(null, { status: 204 });
    }

    // Set CORS headers for actual requests
    res.headers.set("Access-Control-Allow-Origin", "https://wesleyvanderkraan.vercel.app"); // Allow specific domain
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    return res;
}

// Apply middleware only to API routes
export const config = {
    matcher: "/api/:path*",
};