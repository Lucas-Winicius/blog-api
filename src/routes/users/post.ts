import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { insertUserSchema, user } from '../../db/schema/users'
import { db } from '../../db/db'

type UserBody = {
  name: string
  username: string
  password: string
  role: 'admin' | 'contributor' | 'user'
}

export default async function (app: FastifyInstance) {
  app.post(
    '/users',
    async (
      request: FastifyRequest<{ Body: UserBody }>,
      reply: FastifyReply
    ) => {
      const userData = await insertUserSchema.safeParseAsync(request.body)

      if (userData.success) {
        const response = await db
          .insert(user)
          .values(userData.data as unknown as UserBody)
          .returning()
          .onConflictDoNothing()

        return reply.status(201).send(response)
      }

      return reply.status(400).send(userData.error)
    }
  )
}
