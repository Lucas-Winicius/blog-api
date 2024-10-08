import { relations } from 'drizzle-orm'
import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { post } from './posts'
import hash from '../../shared/hash'

export const roleEnum = pgEnum('role', ['admin', 'contributor', 'user'])

export const user = pgTable('users', {
  id: serial('id').primaryKey().notNull(),

  name: varchar('name').notNull(),

  username: varchar('username').unique().notNull(),

  password: varchar('password').notNull(),

  role: roleEnum('role').default('user').notNull(),

  createdAt: timestamp('created_at').defaultNow(),

  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow(),
})

export const userRelactions = relations(user, ({ many }) => ({
  posts: many(post),
}))

export const insertUserSchema = createInsertSchema(user, {
  name: z.string().min(2).max(255),
  username: z
    .string()
    .min(5)
    .max(255)
    .regex(/^[a-zA-Z0-9._-]{1,}$/)
    .transform((password) => password.toLowerCase()),

  password: z
    .string()
    .min(8)
    .max(255)
    .transform(async (password) => (await hash.create(password)).hash),
  role: z.enum(roleEnum.enumValues).default('user'),
})

export const updateUserSchema = createInsertSchema(user, {
  name: z.string().min(2).max(255).optional(),
  username: z
    .string()
    .min(5)
    .max(255)
    .regex(/^[a-zA-Z0-9._-]{1,}$/)
    .optional(),

  password: z
    .string()
    .min(8)
    .max(255)
    .transform(async (password) => (await hash.create(password)).hash)
    .optional(),
  role: z.enum(roleEnum.enumValues).default('user').optional(),
})

export const loginSchema = z.object({
  username: z
    .string()
    .min(5)
    .max(255)
    .regex(/^[a-zA-Z0-9._-]{1,}$/),
  password: z.string().min(8).max(255),
})
