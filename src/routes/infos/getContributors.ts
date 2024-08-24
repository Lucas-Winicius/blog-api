import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import redis from '../../db/redis'
import { user } from '../../db/schema/users'
import { eq, or } from 'drizzle-orm'

export default async function (app: FastifyInstance) {
  app.get('/info/contributors', async function (request: FastifyRequest, reply: FastifyReply) {
    const cache = await redis.get(`post:system:contributors`)

    if (cache) return reply.status(200).send(JSON.parse(cache))

    const contributorsData = await db
      .select()
      .from(user)
      .where(or(eq(user.role, 'contributor'), eq(user.role, 'admin')))

    let contributors = new Array(10)

    if (contributorsData.length < 10) {
      contributors = [...contributorsData]
    } else {
      for (let i = 0; i < 10; i++) {
        const random = Math.floor(Math.random() * contributorsData.length - 1)
        contributors[i] = contributorsData[random]
      }
    }


    const homePage = { contributors }

    redis.set(`post:system:contributors`, JSON.stringify(homePage))
    return reply.status(200).send(homePage)
  })
}
