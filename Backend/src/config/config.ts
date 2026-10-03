import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

type CONFIG = {
  readonly MONGO_URI: string;
  readonly PORT: number;
  readonly JWT_SECRET: string;
  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly FRONTEND_URL: string;
  readonly BACKEND_URL: string;
  readonly IMAGEKIT_PRIVATE_KEY: string;
};

const config: CONFIG = {
  MONGO_URI: requiredEnv("MONGO_URI"),
  PORT: Number(requiredEnv("PORT")),
  JWT_SECRET: requiredEnv("JWT_SECRET"),
  GOOGLE_CLIENT_ID: requiredEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: requiredEnv("GOOGLE_CLIENT_SECRET"),
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  BACKEND_URL:
    process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`,
  IMAGEKIT_PRIVATE_KEY: requiredEnv("IMAGEKIT_PRIVATE_KEY"),
};

export default config;
