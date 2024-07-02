import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { init } from '@paralleldrive/cuid2'
import { z } from 'zod';

const createId = init({
  length: 10,
})

export const post = pgTable('posts', {
  id: varchar('id', { length: 10 })
    .$defaultFn(() => createId())
    .primaryKey(),

  title: varchar('title').notNull(),

  slug: varchar('slug').unique().notNull(),

  content: text('content').array().notNull(),

  createdAt: timestamp('created_at').defaultNow(),

  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow(),
})

export const insertPostSchema = createInsertSchema(post, {
  title: z.string().min(5).max(200),
  slug: z.string().min(5).max(220).regex(/^[a-zA-Z0-9-]{1,}$/),
  content: z.array(z.string()).min(3).max(5000),
})
