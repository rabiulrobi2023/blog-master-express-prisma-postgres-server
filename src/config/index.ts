import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join((process.cwd(),".env"))});

const requiredEnvVars = ["PORT", "DATABASE_URL", "FRONTEND_URL"] as const;

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

const env = loadEnvConfig();
export default env;
