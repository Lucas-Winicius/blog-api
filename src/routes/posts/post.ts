import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { insertPostSchema, post } from '../../db/schema/posts'

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
      const postData = insertPostSchema.safeParse(request.body)

      if (postData.success) {
        const response = await db
          .insert(post)
          .values(postData.data as PostBody)
          .onConflictDoNothing()
          .returning()

        return reply.status(201).send(response)
      }

      return reply.status(400).send(postData.error)
    }
  )
}
