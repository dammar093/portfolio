import path from "path";
import dotenv from "dotenv";

// Explicitly load the .env file from your project root folder
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from environment variables.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
