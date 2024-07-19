import { FastifyReply, FastifyRequest } from 'fastify'
import { db } from '../db/db'
import { user } from '../db/schema/users'
import { eq } from 'drizzle-orm'

export default async function (request: FastifyRequest, reply: FastifyReply) {
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.id, parseInt(request.user.toString())))

  if (userData[0].role === 'user') {
    return reply.status(401).send({
      status: 401,
      message: 'You do not have permission to create posts',
    })
  }
}
