import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const post = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title'),
  slug: varchar('slug'),
  content: text('content'),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})
