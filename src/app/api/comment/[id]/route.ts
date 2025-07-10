import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required to delete comments" },
        { status: 401 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });

    if (!comment) {
      return NextResponse.json(
        { error: `Comment with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Check if user owns the comment or is an admin
    if (comment.userId !== currentUser.id && !currentUser.isAdmin) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
} 