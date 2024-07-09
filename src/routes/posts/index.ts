import { app } from '../../server'
import get from './get'
import post from './post'

export default async function PostRoutes() {
  app.register(post)
  app.register(get)
}
