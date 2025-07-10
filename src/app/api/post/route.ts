import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    // Check if user is admin
    const adminCheck = await requireAdmin(req);
    if (adminCheck instanceof Response) {
        return adminCheck; // Return the error response
    }

    try {
        const { title, content, tags } = await req.json();
        const result = await prisma.post.create({
            data: {
                title,
                content,
                tags,
                author: { connect: { id: adminCheck.id } }, // Use the authenticated admin's ID
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
