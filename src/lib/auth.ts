import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  isAdmin: boolean;
}
export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const userEmail = request.headers.get("x-user-email");
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      });
      if (user) {
        return user;
      }
    }
    const userId = request.headers.get("x-user-id");
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      });
      if (user) {
        return user;
      }
    }
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const decoded = verifyJWT(token);
      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      });
      if (user) {
        return user;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
export async function requireAdmin(request: NextRequest): Promise<AuthUser | Response> {
  const user = await getCurrentUser(request);
  if (!user) {
    return Response.json(
      { error: "Authentication required. Please log in." }, 
      { status: 401 }
    );
  }
  if (!user.isAdmin) {
    return Response.json(
      { error: "Admin access required. You don't have permission to perform this action." }, 
      { status: 403 }
    );
  }
  return user;
}
export async function requireAuth(request: NextRequest): Promise<AuthUser | Response> {
  const user = await getCurrentUser(request);
  if (!user) {
    return Response.json(
      { error: "Authentication required. Please log in." }, 
      { status: 401 }
    );
  }
  return user;
}
export async function getUserWithAdminStatus(email: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });
    if (!user) return null;
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
