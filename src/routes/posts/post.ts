import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { insertPostSchema, post } from '../../db/schema/posts'
import userCredentials from '../../auth/userCredentials'

type PostBody = {
  title: string
  subtitle: string
  image: string
  slug: string
  content: string
}

type ParsedBody = {
  authorId: number
} & PostBody

export default async function postRoute(app: FastifyInstance) {
  app.route({
    method: 'POST',
    url: '/posts',
    preHandler: app.auth([userCredentials]),
    handler: async function (
      request: FastifyRequest<{ Body: PostBody }>,
      reply: FastifyReply
    ) {
      const postData = insertPostSchema.safeParse({
        ...request.body,
        authorId: request.user,
      })

      if (postData.success) {
        const response = await db
          .insert(post)
          .values(postData.data as ParsedBody)
          .onConflictDoNothing()
          .returning()

        return reply.status(201).send(response)
      }

      return reply.status(400).send(postData.error)
    },
  })
}
