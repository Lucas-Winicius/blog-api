import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as postSchema from "./schema/posts"

const client = new Client({
  connectionString: process.env.DB_URL,
});

export const db = drizzle(client, { schema: {...postSchema} });
