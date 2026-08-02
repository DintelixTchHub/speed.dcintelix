import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!process.env.DATABASE_URL && connectionString) {
  process.env.DATABASE_URL = connectionString;
}

if (!process.env.DIRECT_URL && connectionString) {
  process.env.DIRECT_URL = connectionString;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: connectionString ? new PrismaPg({ connectionString }) : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
