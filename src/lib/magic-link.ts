import { randomBytes } from 'crypto'
import { getRedis } from './redis'

const MAGIC_LINK_TTL = 15 * 60 // 15 minutes

const k = (token: string) => `magic:${token}`

export function generateMagicToken(): string {
  return randomBytes(32).toString('hex')
}

export async function storeMagicToken(token: string, identifier: string): Promise<void> {
  await getRedis().setex(k(token), MAGIC_LINK_TTL, identifier)
}

// Returns the identifier (email) the token was issued to, or null if expired/invalid.
// Deletes the token on success (single-use).
export async function consumeMagicToken(token: string): Promise<string | null> {
  const redis = getRedis()
  const identifier = await redis.get(k(token))
  if (!identifier) return null
  await redis.del(k(token))
  return identifier
}

export function buildMagicLinkUrl(token: string, baseUrl: string): string {
  return `${baseUrl}/api/auth/magic-link/verify?token=${token}`
}
