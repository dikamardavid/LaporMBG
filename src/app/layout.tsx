import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LaporMBG',
  description: 'Platform Pelaporan & Pemantauan Makan Bergizi Gratis',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
