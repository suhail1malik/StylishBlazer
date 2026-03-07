// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prismaReset: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prismaReset ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaReset = prisma;

export default prisma;
