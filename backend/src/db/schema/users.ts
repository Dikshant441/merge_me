import { customType, pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";

// Postgres CITEXT is case-insensitive text. Requires the citext extension:
//   CREATE EXTENSION IF NOT EXISTS citext;
// Neon supports it out of the box (run once via SQL editor or psql).
const citext = customType<{ data: string }>({
  dataType() {
    return "citext";
  },
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: citext("email").notNull().unique(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  avatarUrl: text("avatar_url"),
  about: text("about").default(""),
  skills: text("skills").array().default([]),
  age: integer("age"),
  gender: text("gender"),
  membership: text("membership").default("Free"),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
