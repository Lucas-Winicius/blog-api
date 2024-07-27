import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { updateUserSchema, user } from '../../db/schema/users'
import { db } from '../../db/db'
import userCredentials from '../../auth/userCredentials'
import { eq } from 'drizzle-orm'
import canEditUser from '../../auth/canEditUser'

type UserBody = {
  name: string
  username: string
  password: string
  role: 'admin' | 'contributor' | 'user'
}

export default async function (app: FastifyInstance) {
  app.route({
    method: 'PATCH',
    url: '/users/:id',
    preHandler: app.auth([userCredentials, canEditUser], { relation: 'and' }),
    handler: async (
      request: FastifyRequest<{ Body: UserBody; Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const userData = await updateUserSchema.safeParseAsync(request.body)

      const userOnDatabase = await db
        .select()
        .from(user)
        .where(eq(user.id, parseInt(request.params.id, 0)))

      const userEditor = await db
        .select()
        .from(user)
        .where(eq(user.id, parseInt(request.user as string, 0)))

      if (userData.data.role === 'admin' && userEditor[0].role !== 'admin') {
        return reply.status(403).send({
          status: 403,
          message: 'You do not have permission to update admin users',
        })
      }

      const finalUserData = {
        ...userOnDatabase[0],
        ...(userData.data as UserBody),
      }

      const updatedUser = await db
        .update(user)
        .set(finalUserData)
        .where(eq(user.id, parseInt(request.params.id)))
        .returning()

      return reply.send(updatedUser)
    },
  })
}
