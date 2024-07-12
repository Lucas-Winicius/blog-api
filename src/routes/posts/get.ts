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
      const id = request.query.id || ''
      const slug = request.query.slug || ''
      const cacheById = await redis.get(`post:${id}`)
      const cacheBySlug = await redis.get(`post:${slug}`)

      if (cacheById) {
        return reply.status(200).send(JSON.parse(cacheById))
      }

      if (cacheBySlug) {
        return reply.status(200).send(JSON.parse(cacheBySlug))
      }

      const postData = await db
        .select()
        .from(post)
        .where(or(eq(post.id, id), eq(post.slug, slug)))

      if(postData.length) {
         postData.forEach(post => {
           redis.set(`post:${post.id}`, JSON.stringify(post))
           redis.set(`post:${post.slug}`, JSON.stringify(post))
         })

         return reply.status(200).send(postData)
      }

      reply.status(404).send({
        status: 404,
        message: 'Post not found',
      })
    }
  )
}
