import {
  pgTable,
  varchar,
  timestamp,
  primaryKey,
  check,
} from "drizzle-orm/pg-core";
import usersTable from "./users";
import { sql } from "drizzle-orm";

export const contactsTable = pgTable(
  "contacts",
  {
    id: varchar("id").notNull().unique(),

    user1_id: varchar("user1_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    user2_id: varchar("user2_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    no_self_contact: check(
      "no_self_contact",
      sql`${table.user1_id} <> ${table.user2_id}`
    ),
  })
);

export default contactsTable;
