import { defineConfig } from "drizzle-kit";

import { NEON_URI } from "./src/config/env.config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: NEON_URI!,
  },
  verbose: true,
  strict: true,
});
