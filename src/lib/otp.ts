import { randomInt } from 'crypto'
import { getRedis } from './redis'

const OTP_TTL = 5 * 60       // 5 minutes
const ATTEMPTS_MAX = 3
const LOCKOUT_TTL = 15 * 60  // 15 minutes
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_TTL = 60 * 60 // 1 hour per identifier

const k = {
  otp: (id: string) => `otp:code:${id}`,
  attempts: (id: string) => `otp:attempts:${id}`,
  lockout: (id: string) => `otp:lockout:${id}`,
  rate: (id: string) => `otp:rate:${id}`,
}

export function generateOtp(): string {
  return randomInt(100000, 999999).toString()
}

export async function checkRateLimit(identifier: string): Promise<void> {
  const redis = getRedis()
  const count = await redis.incr(k.rate(identifier))
  if (count === 1) await redis.expire(k.rate(identifier), RATE_LIMIT_TTL)
  if (count > RATE_LIMIT_MAX) throw new Error('RATE_LIMITED')
}

export async function storeOtp(identifier: string, code: string): Promise<void> {
  const redis = getRedis()
  await redis.setex(k.otp(identifier), OTP_TTL, code)
  await redis.del(k.attempts(identifier))
}

export async function verifyOtp(identifier: string, code: string): Promise<boolean> {
  const redis = getRedis()

  if (await redis.exists(k.lockout(identifier))) throw new Error('TOO_MANY_ATTEMPTS')

  const stored = await redis.get(k.otp(identifier))
  if (!stored) throw new Error('OTP_EXPIRED')

  if (stored !== code) {
    const attempts = await redis.incr(k.attempts(identifier))
    if (attempts >= ATTEMPTS_MAX) {
      await Promise.all([
        redis.setex(k.lockout(identifier), LOCKOUT_TTL, '1'),
        redis.del(k.otp(identifier)),
        redis.del(k.attempts(identifier)),
      ])
    }
    return false
  }

  await Promise.all([
    redis.del(k.otp(identifier)),
    redis.del(k.attempts(identifier)),
  ])
  return true
}
