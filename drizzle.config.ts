import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema*',
  out: './src/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
  }
});
