import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { post } from '../../db/schema/posts'
import redis from '../../db/redis'
import { desc } from 'drizzle-orm'

export default async function (app: FastifyInstance) {
  app.get('/', async function (request: FastifyRequest, reply: FastifyReply) {
    const cache = await redis.get(`post:system:posts`)

    if (cache) return reply.status(200).send(JSON.parse(cache))

    const postData = await db
      .select({
        image: post.image,
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        createdAt: post.createdAt,
      })
      .from(post)
      .orderBy(desc(post.createdAt));

    redis.set(`post:system:posts`, JSON.stringify(postData))
    return reply.status(200).send(postData)
  })
}
