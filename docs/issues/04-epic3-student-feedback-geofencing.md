# 04 — EPIC 3 (Part 2): Geofenced Student Feedback Interactive Flow

**What to build:** Antarmuka mobile publik bagi siswa untuk memberikan umpan balik rasa dan sisa makanan (<30 detik) via pemindaian Dynamic QR Code tanpa akun. Dilengkapi validasi radius Geofencing sekolah dan kuota maksimal porsi untuk mencegah ulasan palsu atau bot.

**Blocked by:** 02 — EPIC 2: SPPG Kitchen Operations & Dynamic Signed QR Generator

**Status:** ready-for-agent

## Tasks per Role:
- **[Front End]** Alur form visual 4-langkah ramah anak (Emotikon rasa 1-5, Plate Waste Selector piring, Quick Tags rasa, Foto sisa opsional).
- **[Front End]** Integrasi HTML5 Geolocation API untuk mendeteksi koordinat perangkat.
- **[Front End]** Micro-animation selebrasi konfirmasi ulasan terkirim.
- **[Back End]** Endpoint validasi submission: verifikasi HMAC signature, kuota submission harian, dan rumus Haversine Geofence (radius <= 500m).
- **[QA]** Geofence boundary testing (pengujian di dalam vs di luar radius sekolah).
- **[QA]** Load test simulasi 10.000 ulasan serentak pada jam makan siang.

## Acceptance Criteria:
- [ ] Siswa dapat menyelesaikan seluruh ulasan rasa dan sisa makanan dalam waktu < 30 detik.
- [ ] Ulasan ditolak jika koordinat perangkat berada di luar radius sekolah atau kuota porsi telah habis.
- [ ] Ulasan tersimpan ke database dan teragregasi secara anonim per batch hidangan.
