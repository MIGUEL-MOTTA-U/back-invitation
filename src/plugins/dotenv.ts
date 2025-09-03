import { config } from "dotenv";
config();

export type EnvConfig = {
  PORT: string;
  HOST: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: string;
  RATE_LIMIT_REQUESTS_PER_MINUTE: string;
};

const env: EnvConfig = {
  PORT: process.env.PORT ?? "3000",
  HOST: process.env.HOST ?? "0.0.0.0",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  JWT_SECRET: process.env.JWT_SECRET ?? "supersecretkey",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*",
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
  RATE_LIMIT_REQUESTS_PER_MINUTE: process.env.RATE_LIMIT_REQUESTS_PER_MINUTE ?? "60",
};

export default env;
