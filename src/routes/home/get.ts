import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { db } from '../../db/db'
import { post } from '../../db/schema/posts'
import redis from '../../db/redis'

export default async function (app: FastifyInstance) {
  app.get('/', async function (request: FastifyRequest, reply: FastifyReply) {
    const cache = await redis.get(`post:system:home`)

    if (cache) return reply.status(200).send(JSON.parse(cache))

    const postData = await db.select().from(post)

    if (postData.length) {
      postData.forEach((post, id) => {
        redis.set(`post:id:${post.id}`, JSON.stringify(postData[id]))
        redis.set(`post:slug:${post.slug}`, JSON.stringify(postData[id]))
      })
    }

    const recomended = new Array(10)

    for (let i = 0; i < 10; i++) {
      const random = Math.floor(Math.random() * postData.length - 1)
      recomended[i] = postData[random]
    }

    const homePage = { recomended, posts: postData }

    redis.set(`post:system:home`, JSON.stringify(homePage))
    return reply.status(200).send(homePage)
  })
}
