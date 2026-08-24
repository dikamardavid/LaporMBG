import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { consumeMagicToken } from '@/lib/magic-link'
import { createSession, setSessionCookie } from '@/lib/session'
import type { UserRole } from '@/types/auth'

const DASHBOARD: Record<UserRole, string> = {
  BGN_ADMIN: '/bgn',
  BGN_AUDITOR: '/bgn',
  SPPG_ADMIN: '/sppg',
  SPPG_CHEF: '/sppg',
  SCHOOL_PIC: '/school',
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login?error=MISSING_TOKEN', req.url))
  }

  const identifier = await consumeMagicToken(token)
  if (!identifier) {
    return NextResponse.redirect(new URL('/auth/login?error=EXPIRED_TOKEN', req.url))
  }

  const user = await prisma.user.findFirst({
    where: { email: identifier, isActive: true },
    select: { id: true, name: true, role: true, sppgId: true, schoolId: true },
  })

  if (!user) {
    return NextResponse.redirect(new URL('/auth/login?error=USER_NOT_FOUND', req.url))
  }

  const sessionToken = await createSession({
    userId: user.id,
    role: user.role,
    sppgId: user.sppgId ?? undefined,
    schoolId: user.schoolId ?? undefined,
  })

  await setSessionCookie(sessionToken)

  return NextResponse.redirect(new URL(DASHBOARD[user.role] ?? '/', req.url))
}
