import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL,
})

redis.on('error', () => console.log('Redis Client Error'))
redis.on('connect', () => console.log('Redis connected'))

async function isHealthy() {
  try {
    const pingResponse = await redis.ping()
    return pingResponse === 'PONG'
  } catch (err) {
    return false
  }
}

export async function get(key: string) {
  try {
    const result = await redis.get(key)
    return result ? result.toString() : null
  } catch (err) {
    console.error('Error getting Redis key:', err)
    return null
  }
}

export async function set(key: string, value: string | number) {
  try {
    await redis.set(key, value, { EX: 7200, NX: true })
  } catch (err) {
    console.error('Error setting Redis key:', err)
  }
}

export default { get, set, isHealthy, client: redis }
