import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function DELETE(req: NextRequest, res: NextResponse, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    try {
        const post = await prisma.post.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: `Post with ID ${id} does not exist` }, { status: 404 });
    }
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    const post = await prisma.post.findUnique({
        where: { id: Number(id) },
    });

    if (!post) {
        return NextResponse.json({ error: `Post with ID ${id} not found` }, { status: 404 });
    }

    return NextResponse.json(post);
}
