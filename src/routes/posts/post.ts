import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { post } from '../../db/schema/posts'

type PostBody = {
  title: string
  slug: string
  content: string
}

export default async function postRoute(app: FastifyInstance) {
  app.post(
    '/posts',
    async (
      request: FastifyRequest<{ Body: PostBody }>,
      reply: FastifyReply
    ) => {
      const { title, slug, content } = request.body
      const response = await db.insert(post).values({
        title: title,
        slug: slug,
        content: content,
      })
      return reply.status(201).send(response)
    }
  )
}
