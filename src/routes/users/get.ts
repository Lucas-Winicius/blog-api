import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { user } from '../../db/schema/users'
import { db } from '../../db/db'
import { eq } from 'drizzle-orm'
import redis from '../../db/redis'

export default async function (app: FastifyInstance) {
  app.get(
    '/users/:username',
    async (
      request: FastifyRequest<{ Params: { username: string } }>,
      reply: FastifyReply
    ) => {
      const username = request.params.username || ''

      const userCached = await redis.get(`user:${username}`)

      if (userCached) return reply.status(200).send(JSON.parse(userCached))

      const userData = await db.query.user.findMany({
        columns: {
          id: true,
          name: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        where: eq(user.username, username),
        with: {
          posts: true,
        },
      })

      await redis.set(`user:${username}`, JSON.stringify(userData[0]))

      if (!userData.length)
        return reply.status(404).send({ error: 'User not found' })

      return reply.send(userData[0])
    }
  )
}
