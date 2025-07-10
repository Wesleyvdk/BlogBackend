import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(id) },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch comments for post ${id}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { author, email, content } = await req.json();

  try {
    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Check if user is authenticated
    const currentUser = await getCurrentUser(req);

    // For authenticated users, use their data from the database
    let finalAuthor = author;
    let finalEmail = email;
    let userId = null;

    if (currentUser) {
      finalAuthor = currentUser.name || currentUser.email; // Use name or email as fallback
      finalEmail = currentUser.email;
      userId = currentUser.id;
    } else {
      // For anonymous comments, require author and email
      if (!author || !email) {
        return NextResponse.json(
          { error: "Name and email are required for anonymous comments" },
          { status: 400 }
        );
      }
    }

    // Validate that the post exists
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json(
        { error: `Post with ID ${id} not found` },
        { status: 404 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        author: finalAuthor,
        email: finalEmail,
        content,
        postId: Number(id),
        userId: userId,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
} 