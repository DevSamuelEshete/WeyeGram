import { pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: varchar().primaryKey().notNull(),
  email: varchar().notNull().unique(),
  username: varchar().notNull().unique(),

  phone: varchar(),

  global_name: varchar().notNull(),
  profile_url: varchar(),

  status: varchar(),
  status_expires_in: timestamp(),

  account_type: varchar().notNull(),
  password: varchar(),

  email_verified: boolean().default(false).notNull(),
  phone_verified: boolean().default(false).notNull(),

  created_at: timestamp().notNull(),
  updated_at: timestamp().notNull(),
});

export default usersTable;
