import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOtp, storeOtp, checkRateLimit } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/mailer'

// Prevents enumeration: always returns the same message regardless of whether the user exists
const OK = { message: 'Jika akun terdaftar, kode OTP akan dikirim.' }

export async function POST(req: NextRequest) {
  let body: { identifier?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 })
  }

  const identifier = body.identifier?.trim()
  if (!identifier) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  try {
    await checkRateLimit(identifier)
  } catch {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 })
  }

  const isEmail = identifier.includes('@')
  const user = await prisma.user.findFirst({
    where: {
      ...(isEmail ? { email: identifier } : { phone: identifier }),
      role: 'SCHOOL_PIC',
      isActive: true,
    },
  })

  if (user) {
    const code = generateOtp()
    await storeOtp(identifier, code)

    if (isEmail) {
      await sendOtpEmail(identifier, code)
    }
    // TODO: WhatsApp delivery for phone via Twilio / WhatsApp Business API
  }

  return NextResponse.json(OK)
}
