import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  NODE_ENV,
  PORT,

  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_HOST,
  DB_PORT,

  NEON_URI,

  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,

  SESSION_SECRET,
  SESSION_AGE,

  MAIL_HOST,
  MAIL_PORT,
  MAIL_APP_NAME,
  MAIL_USER,
  MAIL_APP_PASS,

  MAX_CODE_AGE,

  REDIS_URL,
  REDIS_TOKEN,
  REDIS_PORT,
} = process.env;
