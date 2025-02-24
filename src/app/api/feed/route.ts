import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const searchString = searchParams.get("searchString");
    const skip = Number(searchParams.get("skip")) || undefined;
    const take = Number(searchParams.get("take")) || undefined;
    const orderBy = searchParams.get("orderBy") as "asc" | "desc";

    const or = searchString
        ? {
            OR: [
                { title: { contains: searchString } },
                { content: { contains: searchString } },
            ],
        }
        : {};

    const posts = await prisma.post.findMany({
        where: { published: true, ...or },
        include: { author: true },
        take,
        skip,
        orderBy: { updatedAt: orderBy },
    });

    return NextResponse.json(posts);
}
