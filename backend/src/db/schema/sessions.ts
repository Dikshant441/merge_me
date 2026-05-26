import { pgTable, uuid } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
});
