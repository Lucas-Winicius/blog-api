import { app } from '../server'
import HomeRoutes from './home'
import PostRoutes from './posts'

export default async function routes() {
  app.register(HomeRoutes)
  app.register(PostRoutes)
}
