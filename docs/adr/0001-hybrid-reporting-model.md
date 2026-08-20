# 0001-hybrid-reporting-model

## Status
accepted

## Context & Decision
Program MBG menjangkau jutaan siswa dari jenjang PAUD hingga SMA di berbagai daerah di mana sebagian besar siswa tidak diizinkan membawa ponsel atau tidak memiliki akun pribadi. Namun, data daya terima makanan (rasa & plate waste) langsung dari siswa sangat krusial bagi BGN.

Kami memutuskan memisahkan kanal pelaporan menjadi model Hybrid:
1. **Siswa (Unauthenticated Feedback)**: Mengisi rating rasa, foto plate waste, dan keluhan menu melalui scan Dynamic QR Code per menu/baki harian tanpa perlu akun atau login.
2. **PIC Sekolah (Authenticated Verification & BAP)**: Bertanggung jawab atas Berita Acara Penerimaan (BAP) resmi (jam tiba, kondisi suhu, kuota porsi terverifikasi, serta pelaporan insiden darurat) dengan otentikasi resmi.

## Consequences
- Mencegah *friction* adopsi pada siswa dan mematuhi regulasi sekolah.
- Data umpan balik siswa diperlakukan sebagai sinyal sentimen statistik (*crowd-sourced sentiment*), sedangkan data PIC Sekolah menjadi dokumen audit operasional legal (*system of record*).
