import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as postSchema from "./schema/posts"


const client = postgres(process.env.DB_URL!);

export const db = drizzle(client, { schema: {...postSchema} });
