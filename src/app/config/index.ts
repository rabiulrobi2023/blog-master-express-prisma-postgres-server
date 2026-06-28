import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

const requiredEnvVars = [
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "FRONTEND_URL",
  "BCRYPT_SALT_ROUND",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRE_IN",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_EXPIRE_IN",
] as const;

const loadEnvConfig = () => {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
  return Object.fromEntries(
    requiredEnvVars.map((envVar) => [envVar, process.env[envVar]]),
  ) as Record<(typeof requiredEnvVars)[number], string>;
};

const config = loadEnvConfig();
export default config;
