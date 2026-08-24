import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis }

export function getRedis(): Redis {
  if (!globalForRedis.redis) {
    const url = process.env.REDIS_URL
    if (!url) throw new Error('REDIS_URL env var is not set')
    globalForRedis.redis = new Redis(url)
  }
  return globalForRedis.redis
}
