import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import { createServerlessHandler } from "vercel-express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.post(`/api/login`, async (req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): any; new(): any; }; }; json: (arg0: { message: string; userId: number; }) => void; }) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

    res.json({ message: "Login successful", userId: user.id });
});

app.post(`/api/post`, async (req: any, res: any) => {
    const { title, content, tags } = req.body;
    const post = await prisma.post.create({
        data: {
            title,
            content,
            tags,
            author: { connect: { email: "wesleyvanderkraan0@gmail.com" } },
        },
    });
    res.json(post);
});

// Convert Express to a Serverless Function
export default createServerlessHandler(app);
