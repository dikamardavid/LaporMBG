# LaporMBG — Platform Pelaporan & Monitoring MBG

Platform pelaporan dan pengawasan operasional program Makan Bergizi Gratis (MBG) terpadu yang menghubungkan seluruh siklus hulu-ke-hilir: dari persiapan dapur (**SPPG**), penerimaan sekolah (**PIC Sekolah & Siswa**), hingga pengawasan audit makro nasional (**Badan Gizi Nasional / BGN**).

---

## 🏛️ Arsitektur & Hierarki Pelaporan 3-Tingkat

1. **Kanal Siswa (Penerima Manfaat)**:
   - Form ulasan visual 4-langkah ramah anak (<30 detik).
   - Akses instan via pemindaian **Dynamic Signed QR Code** per batch makanan (tanpa registrasi/login).
   - Dilengkapi validasi **GPS Geofencing radius sekolah** dan kuota submission harian untuk mencegah ulasan palsu/bot.

2. **Kanal PIC Sekolah (Penanggung Jawab Sekolah)**:
   - Progressive Web App (**PWA Offline-First**) dengan penyimpanan lokal *IndexedDB*.
   - Pencatatan Berita Acara Penerimaan (BAP) makanan (waktu tiba, suhu, porsi, dan foto fisik).
   - *Auto-sync* ke server saat jaringan internet terhubung kembali.
   - Pelaporan **Tiket Insiden & Komplain** jika ditemukan ketidaksesuaian mutu.

3. **Kanal SPPG (Satuan Pelayanan Pemenuhan Gizi / Dapur)**:
   - Pencatatan **Manifest Distribusi** harian (komponen menu, takaran makronutrisi AKG, jam masak, suhu berangkat, foto sampel masakan).
   - Generator kode QR dinamis bertanda tangan kriptografis (HMAC SHA-256) dan surat jalan serah terima.
   - Dashboard analitik **Plate Waste Score** (sisa makanan).
   - Manajemen investigasi tiket komplain dengan **SLA 1x24 jam**.

4. **Kanal BGN (Badan Gizi Nasional)**:
   - Command Center eksekutif makro nasional.
   - **Peta Radar Risiko SPPG** (Hijau: Normal, Kuning: Keterlambatan/Komplain >5%, Merah: Ada Tiket Kritis).
   - Agregasi pemenuhan Angka Kecukupan Gizi (AKG) nasional.
   - Modul ekspor laporan audit resmi (Excel & PDF) untuk BPK/Inspektorat.

---

## 📚 Dokumentasi Proyek

- **Kamus Istilah Domain**: [](./CONTEXT.md)
- **Spesifikasi Lengkap**: [](./docs/SPEC.md)
- **Keputusan Arsitektur (ADRs)**:
  - [](./docs/adr/0001-hybrid-reporting-model.md)
  - [](./docs/adr/0002-ticket-based-incident-workflow.md)
  - [](./docs/adr/0003-pwa-offline-first-and-geofenced-signed-qr.md)
  - [](./docs/adr/0004-nextjs-postgres-single-db-multitenant.md)
  - [](./docs/adr/0005-nutrition-breakdown-and-visual-feedback.md)
  - [](./docs/adr/0006-otp-magiclink-school-auth.md)
  - [](./docs/adr/0007-ds-microservice-fastapi-deviation.md)
- **Daftar Tiket / Issues**: [](./docs/issues/)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling & UI**: Tailwind CSS, Shadcn UI, Lucide Icons, Framer Motion
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Cache & Rate-Limiting**: Redis
- **Offline Storage**: IndexedDB (PWA Service Worker)
- **Security**: HMAC-SHA256 Signed Dynamic QR, Passwordless OTP/Magic Link, RBAC Middleware
- **Data Science Services**: Standalone FastAPI (Python) microservices in Docker containers for analytics/ML workloads (e.g. `services/ds-plate-waste`), called via push-based REST from the Next.js backend — see [ADR-0007](./docs/adr/0007-ds-microservice-fastapi-deviation.md)
