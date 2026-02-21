import { or, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  primaryKey,
  check,
} from "drizzle-orm/pg-core";
import contactsTable from "./contacts";
import usersTable from "./users";

const messageTable = pgTable(
  "messages",
  {
    id: varchar("id").notNull().unique(),

    sender_id: varchar("sender_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    receiver_id: varchar("receiver_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    contacts_id: varchar("contacts_id")
      .notNull()
      .references(() => contactsTable.id, { onDelete: "cascade" }),

    images_url: text("images_url").array(),
    content: text("content"),

    created_at: timestamp("created_at").notNull(),
    updated_at: timestamp("updated_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    image_or_content_requried: check(
      "image_or_content_requried",
      sql`${table.images_url} IS NOT NULL OR ${table.content} IS NOT NULL`
    ),
  })
);

export default messageTable;
