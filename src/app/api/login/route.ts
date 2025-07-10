import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                password: true,
            },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Password is invalid" }, { status: 401 });
        }
        const { password: _, ...userResponse } = user;
        return NextResponse.json({
            token: "j29pX3fAfqmFMwpAVtk7HiElAliqXVLRt0g25oVifVPQSHLiqTXaAVQ6E04CUZqJ",
            user: userResponse,
        });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
