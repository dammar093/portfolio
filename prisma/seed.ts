import bcryptjs from "bcryptjs";
import { prisma } from "./config";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // User
    console.log("👥 Creating user...");
    const password = await bcryptjs.hash("@Dyams093", 10);
    await prisma.user.upsert({
      where: { email: "dammarrana093@gmail.com" },
      update: { password },
      create: {
        email: "dammarrana093@gmail.com",
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
