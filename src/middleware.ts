import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import type { SessionPayload, UserRole } from '@/types/auth'

const SESSION_COOKIE = 'mbg_session'

// Routes accessible without a session
const PUBLIC_PREFIXES = [
  '/',
  '/auth',
  '/feedback',           // student QR feedback (unauthenticated)
  '/api/auth',
  '/api/feedback',
  '/api/healthz',
  '/_next',
  '/favicon.ico',
]

// Protected route prefixes → allowed roles
const ROUTE_ROLES: [string, UserRole[]][] = [
  ['/bgn', ['BGN_ADMIN', 'BGN_AUDITOR']],
  ['/admin', ['BGN_ADMIN']],
  ['/sppg', ['SPPG_ADMIN', 'SPPG_CHEF']],
  ['/school', ['SCHOOL_PIC']],
  ['/api/bgn', ['BGN_ADMIN', 'BGN_AUDITOR']],
  ['/api/admin', ['BGN_ADMIN']],
  ['/api/sppg', ['SPPG_ADMIN', 'SPPG_CHEF']],
  ['/api/school', ['SCHOOL_PIC']],
]

function isPublic(pathname: string): boolean {
  if (pathname === '/') return true
  return PUBLIC_PREFIXES.some(
    (p) => p !== '/' && (pathname === p || pathname.startsWith(p + '/'))
  )
}

function getAllowedRoles(pathname: string): UserRole[] | null {
  for (const [prefix, roles] of ROUTE_ROLES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return roles
  }
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error('JWT_SECRET is not configured')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) {
    return NextResponse.redirect(new URL(`/auth/login?from=${encodeURIComponent(pathname)}`, request.url))
  }

  let session: SessionPayload
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    session = payload as unknown as SessionPayload
  } catch {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete(SESSION_COOKIE)
    return response
  }

  const allowedRoles = getAllowedRoles(pathname)
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
  }

  // Forward verified identity to API route handlers via request headers
  const headers = new Headers(request.headers)
  headers.set('x-user-id', session.userId)
  headers.set('x-user-role', session.role)
  if (session.sppgId) headers.set('x-sppg-id', session.sppgId)
  if (session.schoolId) headers.set('x-school-id', session.schoolId)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
