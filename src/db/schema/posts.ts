import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { relations } from 'drizzle-orm'
import { user } from './users'
import { micromark } from 'micromark'
import createId from '../../shared/createId'

export const post = pgTable('posts', {
  id: varchar('id', { length: 10 })
    .$defaultFn(() => createId())
    .primaryKey(),

  image: varchar('image'),

  title: varchar('title').notNull(),

  subtitle: varchar('subtitle').notNull(),

  slug: varchar('slug').unique().notNull(),

  content: text('content').notNull(),

  authorId: integer('author_id').notNull(),

  createdAt: timestamp('created_at').defaultNow(),

  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow(),
})

export const postsRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id]
  })
}))

export const insertPostSchema = createInsertSchema(post, {
  image: z.string().url().optional(),
  title: z.string().min(5).max(200),
  subtitle: z.string().min(10).max(600),

  slug: z
    .string()
    .min(5)
    .max(220)
    .regex(/^[a-zA-Z0-9-]{1,}$/),

    content: z
    .string()
    .min(3)
    .transform((val) => micromark(val)),
})
