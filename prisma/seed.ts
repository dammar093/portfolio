import bcryptjs from "bcryptjs";
import { prisma } from "./config";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // User
    console.log("👥 Creating user...");
    const password = await bcryptjs.hash("process.env.ADMIN_PASSWORD", 10);
    await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL! },
      update: { password },
      create: {
        email: process.env.ADMIN_EMAIL!,
        password,
      },
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
