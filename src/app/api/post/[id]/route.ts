import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

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
    console.log("GET /api/post/[id] route invoked (production debug)");
    const { id } = await context.params;
    console.log(`Attempting to fetch post with id: ${id} (production debug)`);

    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
        });
        console.log(`Prisma findUnique result for id ${id}:`, post ? JSON.stringify(post) : 'null', "(production debug)");

        if (!post) {
            console.log(`Post with ID ${id} not found in database. Returning 404. (production debug)`);
            return NextResponse.json({ error: `Post with ID ${id} not found` }, { status: 404 });
        }

        console.log(`Post with ID ${id} found. Returning post data. (production debug)`);
        return NextResponse.json(post);
    } catch (error: any) {
        console.error(`Error in GET /api/post/[id] for id ${id} (production debug):`, error.message, error.stack);
        return NextResponse.json({ error: "Internal server error while fetching post.", details: error.message }, { status: 500 });
    }
}
 export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const { title, content, tags, category } = await req.json();

    const post = await prisma.post.update({
        where: { id: Number(id) },
        data: { title, content, tags, category },
    });

    return NextResponse.json(post);
 }