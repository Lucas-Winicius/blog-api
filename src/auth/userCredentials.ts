import { FastifyReply, FastifyRequest } from 'fastify'

type DecodedToken = { id: number; iat: number; exp: number }

export default async function (request: FastifyRequest, reply: FastifyReply) {
  try {
    const decodedToken: DecodedToken = await request.jwtDecode()
    request.user = String(decodedToken.id)
  } catch (err) {
    return reply.status(401).send({
      status: 401,
      message: err.message,
    })
  }
}
