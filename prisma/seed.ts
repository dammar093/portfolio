import bcryptjs from "bcryptjs";
import { prisma } from "./config";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // User
    console.log("👥 Creating user...");
    await prisma.user.create({
      data: {
        email: "dammarrana093@gmail.com",
        password: await bcryptjs.hash("@Dammar093", 10),
      },
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
