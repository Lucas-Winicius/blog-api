import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { insertPostSchema, post } from '../../db/schema/posts'

type PostBody = {
  title: string
  slug: string
  content: string
}

export default async function postRoute(app: FastifyInstance) {
  app.post(
    '/posts',
    async function (
      request: FastifyRequest<{ Body: PostBody }>,
      reply: FastifyReply
    ) {
      const postData = insertPostSchema.parse(request.body)

      const response = await db
        .insert(post)
        .values(postData)
        .onConflictDoNothing()
        .returning()

      return reply.status(201).send(response)
    }
  )
}
