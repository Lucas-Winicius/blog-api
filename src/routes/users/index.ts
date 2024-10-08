import { app } from '../../server'
import get from './get'
import info from './info'
import patch from './patch'
import post from './post'

export default async function UserRoutes() {
  app.register(post)
  app.register(patch)
  app.register(info)
  app.register(get)
}
