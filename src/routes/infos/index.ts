import { app } from '../../server'
import get from './get'

export default async function InfoRoutes() {
  app.register(get)
}
