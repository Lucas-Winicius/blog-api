import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { post } from '../../db/schema/posts'
import { eq } from 'drizzle-orm'
import redis from '../../db/redis'

type UrlQuery = {
  id: string
}

export default async function getRoute(app: FastifyInstance) {
  app.get(
    '/posts',
    async function (
      request: FastifyRequest<{ Querystring: UrlQuery }>,
      reply: FastifyReply
    ) {
      const id = request.query.id
      const cache = await redis.get(`post:${id}`)


      if (cache) {
        return reply.status(200).send(JSON.parse(cache))
      }

      const postData = await db.select().from(post).where(eq(post.id, id))

      if (postData) {
        redis.set(`post:${id}`, JSON.stringify(postData[0]))
        return reply.status(200).send(postData[0])
      }

      reply.status(404).send({
        status: 404,
        message: 'Post not found',
      })
    }
  )
}
