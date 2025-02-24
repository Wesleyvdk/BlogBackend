import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    try {
        const { title, content, tags } = await req.json();
        const result = await prisma.post.create({
            data: {
                title,
                content,
                tags,
                author: { connect: { email: "wesleyvanderkraan0@gmail.com" } },
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
