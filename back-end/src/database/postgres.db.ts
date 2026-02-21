import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { NEON_URI } from "../config/env.config";

const client = neon(NEON_URI || "");

const DB = drizzle({ client });

export default DB;
