import dotenv from "dotenv";
import path from "path";

const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envPath) });


const APP_PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined in environment variables");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: APP_PORT,
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: JWT_EXPIRES_IN,
  webhookSecret: WEBHOOK_SECRET,
} as const;

export type EnvConfig = typeof env;
