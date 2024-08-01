import { app } from '../../server'
import all from './all'
import get from './get'
import post from './post'

export default async function PostRoutes() {
  app.register(post)
  app.register(all)
  app.register(get)
}
