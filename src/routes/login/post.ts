import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { loginSchema, user } from '../../db/schema/users'
import { db } from '../../db/db'
import { eq } from 'drizzle-orm'
import hash from '../../shared/hash'

type Credentials = {
  username: string
  password: string
}

export default async function Login(app: FastifyInstance) {
  app.post(
    '/signin',
    async (
      request: FastifyRequest<{ Body: Credentials }>,
      reply: FastifyReply
    ) => {
      const userCredentials = loginSchema.safeParse(request.body)

      if (!userCredentials.success) {
        return reply.status(400).send(userCredentials.error)
      }

      const userData = await db
        .select()
        .from(user)
        .where(eq(user.username, userCredentials.data.username))

      if (!userData.length) {
        return reply
          .status(401)
          .send({ status: 401, message: 'Invalid credentials' })
      }

      const passwordMatch = await hash.compare(
        userData[0].password,
        userCredentials.data.password
      )

      if (!passwordMatch.match) {
        return reply
          .status(401)
          .send({ status: 401, message: 'Invalid credentials' })
      }

      const jwtToken = app.jwt.sign(
        { id: userData[0].id },
        { expiresIn: '15d' }
      )

      return reply.status(200).send({ status: 200, token: jwtToken })
    }
  )
}
