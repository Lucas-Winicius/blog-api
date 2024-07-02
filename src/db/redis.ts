import { createClient } from 'redis';

export default (async () => {
  const client = await createClient()
    .on('error', (err) => console.error('Redis Client Error:', err))
    .on('connect', () => console.log('Connected to Redis'))
    .connect()

    async function get(key: string) {
      try {
        const result = await client.get(key)
        return result ? result.toString() : null
      } catch (err) {
        console.error('Error getting Redis key:', err)
        return null
      }
    }

    async function set(key: string, value: string | number) {
      try {
        await client.set(key, value)
      } catch (err) {
        console.error('Error setting Redis key:', err)
      }
    }

    return { get, set }
})()
