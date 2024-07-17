import fastify from 'fastify'
import 'dotenv/config'
import routes from './routes'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyAuth from '@fastify/auth'

const port = parseInt(process.env.PORT || '3000')

export const app = fastify()

app.register(cors, {})
app.register(fastifyAuth)
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  formatUser: function (user: { id: string }) {
    return {
      id: user.id,
    }
  },
})
app.register(routes)

app.listen({ port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`server listening on`, address)
})
