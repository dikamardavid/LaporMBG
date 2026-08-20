# 0006-otp-magiclink-school-auth

## Status
accepted

## Context & Decision
Pengelolaan kredensial akun guru/PIC sekolah rawan masalah lupa password dan perputaran tugas piket di sekolah.

Kami memutuskan:
- PIC Sekolah didaftarkan oleh SPPG pengampu atau Administrator BGN.
- Autentikasi PIC Sekolah menggunakan Passwordless OTP / Magic Link via WhatsApp/Email resmi untuk login cepat dan aman.

## Consequences
- Mencegah akun siluman/tidak terverifikasi yang mengklaim mewakili sekolah.
- Menghilangkan *support friction* akibat reset password.
