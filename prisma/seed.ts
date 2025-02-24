import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);
    const name = "Wesley van der Kraan";
    const email = "wesleyvanderkraan0@gmail.com";
    const password = "Maga2012"; // Generate a random 32-character password
    console.log("Creating admin user... with password:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const u = {
        email: email,
        password: hashedPassword,
        name: name,
    };

    const user = await prisma.user.create({
        data: u,
    });
    console.log(`Created user with id: ${user.id}`);
    console.log("User:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log(
        "Please store this password securely and change it after first login"
    );

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });