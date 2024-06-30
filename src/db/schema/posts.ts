import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { init } from '@paralleldrive/cuid2'

const createId = init({
  length: 10,
})

export const post = pgTable('posts', {
  id: varchar('id', { length: 10 })
    .$defaultFn(() => createId())
    .primaryKey(),
  title: varchar('title'),
  slug: varchar('slug').unique(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})
