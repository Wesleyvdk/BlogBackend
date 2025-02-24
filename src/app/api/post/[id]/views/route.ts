import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, res: NextResponse, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    try {
        const post = await prisma.post.update({
            where: { id: Number(id) },
            data: { viewCount: { increment: 1 } },
        });

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: `Post with ID ${id} does not exist` }, { status: 404 });
    }
}
