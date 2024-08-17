import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { post } from '../../db/schema/posts'
import { asc, desc, eq, gt, lt, or } from 'drizzle-orm'
import redis from '../../db/redis'
import { user } from '../../db/schema/users'

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

      if (cacheBySlug) return reply.status(200).send(JSON.parse(cacheBySlug))
      if (cacheById) return reply.status(200).send(JSON.parse(cacheById))

      const [postData] = await db
        .select()
        .from(post)
        .where(or(eq(post.slug, slug), eq(post.id, id)))
        .execute()

      if (postData) {
        const [userData] = await db
          .select({
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })
          .from(user)
          .where(eq(user.id, postData.authorId))
          .execute()

        const [previousSlug] = await db
          .select({ slug: post.slug })
          .from(post)
          .where(lt(post.id, postData.id))
          .orderBy(desc(post.id))
          .limit(1)

        const [nextSlug] = await db
          .select({ slug: post.slug })
          .from(post)
          .where(gt(post.id, postData.id))
          .orderBy(asc(post.id))
          .limit(1)

        const response = {
          post: postData,
          author: userData,
          previousSlug: previousSlug?.slug ?? null,
          nextSlug: nextSlug?.slug ?? null,
        }

        redis.set(`post:id:${post.id}`, JSON.stringify(response))
        redis.set(`post:slug:${post.slug}`, JSON.stringify(response))

        return reply.status(200).send(response)
      }

      reply.status(404).send({
        status: 404,
        message: 'Post not found',
      })
    }
  )
}
