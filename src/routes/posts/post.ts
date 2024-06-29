import { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify';
import { db } from '../../db/db';
import { post } from '../../db/schema/posts';

export default async function postRoute(app: FastifyInstance) {
  app.post('/posts', async (request: FastifyRequest, reply: FastifyReply) => {

    const response =  db.insert(post).values({
      id: post.id.default,
      title: "teste",
      slug: "teste-slug",
      content: "conteudo do post",
    })

    return reply.status(200).send(response);
  });
}

