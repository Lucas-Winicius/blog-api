import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { insertPostSchema, post } from '../../db/schema/posts'
import { micromark } from 'micromark'

type PostBody = {
  title: string
  subtitle: string
  image: string
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

      const contentHtml = micromark(postData.content)

      const response = await db
        .insert(post)
        .values({...postData, content: contentHtml})
        .onConflictDoNothing()
        .returning()

      return reply.status(201).send(response)
    }
  )
}
