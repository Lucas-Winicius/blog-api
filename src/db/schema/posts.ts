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

  image: varchar('image'),

  title: varchar('title').notNull(),

  subtitle: varchar('subtitle').notNull(),

  slug: varchar('slug').unique().notNull(),

  content: text('content').notNull(),

  createdAt: timestamp('created_at').defaultNow(),

  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow(),
})

export const insertPostSchema = createInsertSchema(post, {
  image: z.string().url().optional(),
  title: z.string().min(5).max(200),
  subtitle: z.string().min(10).max(600),
  slug: z.string().min(5).max(220).regex(/^[a-zA-Z0-9-]{1,}$/),
  content: z.string().min(3)
})
