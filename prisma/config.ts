import path from "path";
import dotenv from "dotenv";

// Explicitly load the .env file from your project root folder
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// Fail early with a clear warning if the variable didn't load
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing from environment variables!");
}

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
});
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
