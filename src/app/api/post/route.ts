import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    const adminCheck = await requireAdmin(req);
    if (adminCheck instanceof Response) {
        return adminCheck; 
    }
    try {
        const { title, content, tags } = await req.json();
        const result = await prisma.post.create({
            data: {
                title,
                content,
                tags,
                author: { connect: { id: adminCheck.id } }, 
            },
        });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
