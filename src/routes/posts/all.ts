import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { post } from '../../db/schema/posts'
import redis from '../../db/redis'

export default async function (app: FastifyInstance) {
  app.get(
    '/posts/all',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const cache = await redis.get(`post:system:all`)

      if (cache) return reply.status(200).send(JSON.parse(cache))

      const postData = await db.select().from(post)

      if (postData.length) {
        postData.forEach((post, id) => {
          redis.set(`post:id:${post.id}`, JSON.stringify(postData[id]))
          redis.set(`post:slug:${post.slug}`, JSON.stringify(postData[id]))
        })
      }

      redis.set(`post:system:all`, JSON.stringify(postData))
      return reply.status(200).send(postData)
    }
  )
}
