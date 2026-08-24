import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendMail(to: string, subject: string, html: string): Promise<void> {
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? 'noreply@lapor-mbg.id',
    to,
    subject,
    html,
  })
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  await sendMail(
    email,
    'Kode OTP LaporMBG',
    `<div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Kode OTP Anda</h2>
      <p>Gunakan kode berikut untuk masuk ke LaporMBG:</p>
      <p style="font-size:40px;font-weight:bold;letter-spacing:10px;color:#059669">${code}</p>
      <p>Kode berlaku selama <strong>5 menit</strong>. Jangan bagikan kode ini kepada siapapun.</p>
    </div>`
  )
}

export async function sendMagicLinkEmail(email: string, link: string): Promise<void> {
  await sendMail(
    email,
    'Tautan Masuk LaporMBG',
    `<div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Tautan Masuk LaporMBG</h2>
      <p>Klik tombol berikut untuk masuk ke LaporMBG:</p>
      <a href="${link}" style="display:inline-block;padding:12px 28px;background:#059669;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">
        Masuk ke LaporMBG
      </a>
      <p style="margin-top:16px;color:#6b7280">Tautan berlaku <strong>15 menit</strong> dan hanya dapat digunakan sekali.<br>
      Jika Anda tidak meminta ini, abaikan email ini.</p>
    </div>`
  )
}
