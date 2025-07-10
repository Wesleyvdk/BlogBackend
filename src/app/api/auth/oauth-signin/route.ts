import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const { email, name, provider } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || null,
          password: "", 
          isAdmin: false, 
        },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      });
    } else if (name && !user.name) {
      user = await prisma.user.update({
        where: { email },
        data: { name },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      });
    }
    return NextResponse.json({ 
      success: true, 
      user,
      message: `User ${user.id ? 'updated' : 'created'} successfully` 
    });
  } catch (error) {
    console.error("OAuth signin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
