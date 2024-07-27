import { app } from '../../server'
import patch from './patch'
import post from './post'

export default async function UserRoutes() {
  app.register(post)
  app.register(patch)
}
