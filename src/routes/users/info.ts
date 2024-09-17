import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { user } from '../../db/schema/users'
import { db } from '../../db/db'
import userCredentials from '../../auth/userCredentials'
import { eq } from 'drizzle-orm'
import redis from '../../db/redis'

export default async function (app: FastifyInstance) {
  app.route({
    method: 'GET',
    url: '/users/info',
    preHandler: app.auth([userCredentials]),
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const cachedUserInfo = await redis.get(`userinfo:${request.user}`)

      if (cachedUserInfo)
        return reply.status(200).send(JSON.parse(cachedUserInfo))

      const userData = await db.query.user.findMany({
        columns: {
          name: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        where: eq(user.id, parseInt(request.user.toString())),
        with: {
          posts: {
            columns: {
              image: true,
              id: true,
              title: true,
              subtitle: true,
              slug: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      })

      await redis.set(`userinfo:${request.user}`, JSON.stringify(userData[0]))

      return reply.status(200).send(userData[0])
    },
  })
}
