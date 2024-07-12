import { app } from '../server'
import HomeRoutes from './home'
import PostRoutes from './posts'
import UserRoutes from './users'

export default async function routes() {
  app.register(HomeRoutes)
  app.register(PostRoutes)
  app.register(UserRoutes)
}
