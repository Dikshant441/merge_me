import { pgTable, uuid } from "drizzle-orm/pg-core";

export const passwordResets = pgTable("password_resets", {
  id: uuid("id").primaryKey().defaultRandom(),
});
