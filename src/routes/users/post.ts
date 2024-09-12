import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { insertUserSchema, user } from '../../db/schema/users'
import { db } from '../../db/db'
import { eq } from 'drizzle-orm'

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

      const userOnDb = await db.query.user.findFirst({
        where: eq(user.username, userData.data?.username),
      })

      if (userOnDb)
        return reply
          .status(400)
          .send({ status: 400, message: 'This user already exists' })

      if (userData.success) {
        await db
          .insert(user)
          .values(userData.data as unknown as UserBody)
          .returning()

        return reply.status(201).send({
          status: 201,
          message: 'User created successfully',
        })
      }

      return reply.status(400).send(userData.error)
    }
  )
}
