import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMagicToken, storeMagicToken, buildMagicLinkUrl } from '@/lib/magic-link'
import { sendMagicLinkEmail } from '@/lib/mailer'

const OK = { message: 'Jika akun terdaftar, tautan masuk akan dikirim ke email Anda.' }

export async function POST(req: NextRequest) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'INVALID_EMAIL' }, { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: { email, role: 'SCHOOL_PIC', isActive: true },
  })

  if (user) {
    const token = generateMagicToken()
    await storeMagicToken(token, email)

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      `${req.headers.get('x-forwarded-proto') ?? 'https'}://${req.headers.get('host')}`

    await sendMagicLinkEmail(email, buildMagicLinkUrl(token, baseUrl))
  }

  return NextResponse.json(OK)
}
