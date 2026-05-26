import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Neon pooled connection: their pooler multiplexes for us, so one TCP socket
// per Node process is all we need (max: 1).
const client = postgres(process.env.DATABASE_URL as string, { max: 1 });

const db = drizzle(client, { schema });

export { db };
