import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function PUT(req: NextRequest, res: NextResponse, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    try {
        const postData = await prisma.post.findUnique({
            where: { id: Number(id) },
            select: { published: true },
        });

        if (!postData) {
            return NextResponse.json({ error: `Post with ID ${id} not found` }, { status: 404 });
        }

        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: { published: !postData.published },
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}
