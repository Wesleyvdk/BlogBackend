const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setUserAsAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });
    
    console.log('User updated successfully:', user);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('User not found with email:', email);
    } else {
      console.error('Error updating user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node set-admin.js <email>');
  process.exit(1);
}

setUserAsAdmin(email); 