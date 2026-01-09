import type { PrismaClient } from "@prisma/client";
import type { EnvConfig } from "../config/env";

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      env: EnvConfig;
      user?: {
        id: string;
        role: "SUPER_ADMIN" | "OWNER" | "MANAGER" | "STAFF";
        businessId?: string | null;
      };
      businessId?: string;
    }
  }
}

export {};
