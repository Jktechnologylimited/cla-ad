import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter } as any);
}

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma: PrismaClient = g.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
