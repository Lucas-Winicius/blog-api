import fastify from 'fastify';
import 'dotenv/config';
import routes from './routes';
import cors from '@fastify/cors';

const port = parseInt(process.env.PORT || '3000');

export const app = fastify();

app.register(routes);
app.register(cors, {});

app.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server listening on`, address);
});
