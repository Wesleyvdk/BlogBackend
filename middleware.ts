import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const allowedOrigins = ["https://wesleyvanderkraan.vercel.app"];

    const origin = req.headers.get("origin");
    if (origin && allowedOrigins.includes(origin)) {
        res.headers.set("Access-Control-Allow-Origin", origin);
    }

    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // Handle preflight requests (OPTIONS method)
    if (req.method === "OPTIONS") {
        return new NextResponse(null, { status: 204 });
    }

    return res;
}

// Apply middleware only to API routes
export const config = {
    matcher: "/api/:path*",
};
