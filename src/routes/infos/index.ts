import { app } from '../../server'
import getContributors from './getContributors'
import getRecommendations from './getRecommendations'

export default async function InfoRoutes() {
  app.register(getRecommendations)
  app.register(getContributors)
}
