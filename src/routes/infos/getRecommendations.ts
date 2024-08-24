import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import redis from '../../db/redis'
import { post } from '../../db/schema/posts'

export default async function (app: FastifyInstance) {
  app.get(
    '/info/recommendations',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const cache = await redis.get(`post:system:recommendations`)

      if (cache) return reply.status(200).send(JSON.parse(cache))

      const postData = await db
        .select({
          slug: post.slug,
          title: post.title,
        })
        .from(post)

      let recomended = new Array(5)

      if (postData.length < 5) {
        recomended = [...postData]
      } else {
        for (let i = 0; i < 5; i++) {
          const random = Math.floor(Math.random() * postData.length - 1)
          recomended[i] = postData[random]
        }
      }

      const homePage = { recomended }

      redis.set(`post:system:recommendations`, JSON.stringify(homePage))
      return reply.status(200).send(homePage)
    }
  )
}
