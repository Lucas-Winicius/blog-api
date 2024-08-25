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

      let recomended = []

      if (postData.length < 5) {
        recomended = [...postData]
      } else {
        while (recomended.length < 5) {
          const random = Math.floor(Math.random() * --postData.length)
          if (postData[random] !== null) recomended.push(postData[random])
        }
      }

      redis.set(`post:system:recommendations`, JSON.stringify(recomended))
      return reply.status(200).send(recomended)
    }
  )
}
