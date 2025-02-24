import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;

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
