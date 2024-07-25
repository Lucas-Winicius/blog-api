import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { post } from '../../db/schema/posts'
import { eq, or } from 'drizzle-orm'
import redis from '../../db/redis'

type UrlQuery = {
  id: string
  slug: string
}

export default async function getRoute(app: FastifyInstance) {
  app.get(
    '/posts',
    async function (
      request: FastifyRequest<{ Querystring: UrlQuery }>,
      reply: FastifyReply
    ) {
      const { id = '', slug = '' } = request.query
      const cacheById = await redis.get(`post:id:${id}`)
      const cacheBySlug = await redis.get(`post:slug:${slug}`)

      if (cacheById) return reply.status(200).send(JSON.parse(cacheById))

      if (cacheBySlug) return reply.status(200).send(JSON.parse(cacheBySlug))

      const postData = await db
        .select()
        .from(post)
        .where(or(eq(post.id, id), eq(post.slug, slug)))

      if (postData.length) {
        postData.forEach((post) => {
          redis.set(`post:id:${post.id}`, JSON.stringify(post[0]))
          redis.set(`post:slug:${post.slug}`, JSON.stringify(post[0]))
        })

        return reply.status(200).send(postData[0])
      }

      reply.status(404).send({
        status: 404,
        message: 'Post not found',
      })
    }
  )
}
