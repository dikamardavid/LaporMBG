import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyOtp } from '@/lib/otp'
import { createSession, setSessionCookie } from '@/lib/session'

export async function POST(req: NextRequest) {
  let body: { identifier?: string; code?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 })
  }

  const identifier = body.identifier?.trim()
  const code = body.code?.trim()

  if (!identifier || !code || code.length !== 6) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  try {
    const valid = await verifyOtp(identifier, code)
    if (!valid) {
      return NextResponse.json({ error: 'INVALID_OTP' }, { status: 401 })
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'TOO_MANY_ATTEMPTS') return NextResponse.json({ error: 'TOO_MANY_ATTEMPTS' }, { status: 429 })
    if (msg === 'OTP_EXPIRED') return NextResponse.json({ error: 'OTP_EXPIRED' }, { status: 401 })
    throw err
  }

  const isEmail = identifier.includes('@')
  const user = await prisma.user.findFirst({
    where: {
      ...(isEmail ? { email: identifier } : { phone: identifier }),
      isActive: true,
    },
    select: { id: true, name: true, role: true, sppgId: true, schoolId: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 })
  }

  const token = await createSession({
    userId: user.id,
    role: user.role,
    sppgId: user.sppgId ?? undefined,
    schoolId: user.schoolId ?? undefined,
  })

  await setSessionCookie(token)

  return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } })
}
