import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { post } from '../../db/schema/posts'
import redis from '../../db/redis'
import { user } from '../../db/schema/users'
import { eq, or } from 'drizzle-orm'

export default async function (app: FastifyInstance) {
  app.get('/', async function (request: FastifyRequest, reply: FastifyReply) {
    const cache = await redis.get(`post:system:home`)

    if (cache) return reply.status(200).send(JSON.parse(cache))

    const postData = await db.select().from(post)
    const contributorsData = await db
      .select()
      .from(user)
      .where(or(eq(user.role, 'contributor'), eq(user.role, 'admin')))

    let recomended = new Array(5)
    let contributors = new Array(10)

    if (postData.length < 5) {
      recomended = [...postData]
    } else {
      for (let i = 0; i < 5; i++) {
        const random = Math.floor(Math.random() * postData.length - 1)
        recomended[i] = postData[random]
      }
    }

    if (contributorsData.length < 10) {
      contributors = [...contributorsData]
    } else {
      for (let i = 0; i < 10; i++) {
        const random = Math.floor(Math.random() * contributorsData.length - 1)
        contributors[i] = contributorsData[random]
      }
    }


    const homePage = { recomended, contributors, posts: postData }

    redis.set(`post:system:home`, JSON.stringify(homePage))
    return reply.status(200).send(homePage)
  })
}
