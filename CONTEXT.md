# MBG Reporting Context

Platform pelaporan dan pengawasan operasional program Makan Bergizi Gratis (MBG), mencakup siklus hulu-ke-hilir dari persiapan dapur (SPPG), penerimaan & verifikasi sekolah, umpan balik siswa, hingga agregasi audit Badan Gizi Nasional (BGN).

## Language

### Aktor & Organisasi

**BGN (Badan Gizi Nasional)**:
Lembaga pemerintah pusat pemegang otoritas pengawas, regulator, dan pengambil kebijakan tertinggi pada program MBG.
_Avoid_: Kemendikbud, Kemenkes, Admin Pusat

**SPPG (Satuan Pelayanan Pemenuhan Gizi)**:
Unit dapur produksi dan distribusi makanan bergizi yang melayani klaster sekolah penerima manfaat.
_Avoid_: Dapur MBG, Vendor Catering, Dapur Umum

**PIC Sekolah (Penanggung Jawab Sekolah)**:
Tenaga pendidik atau perwakilan resmi sekolah yang bertugas menerima, memverifikasi, dan mencatat berita acara distribusi makanan.
_Avoid_: Guru Piket, Petugas Lapangan, Admin Sekolah

**Penerima Manfaat (Siswa)**:
Peserta didik di sekolah yang menerima dan mengonsumsi makanan bergizi.
_Avoid_: User Siswa, Murid, Konsumen

---

### Alur & Siklus Pelaporan

**Batch Distribusi**:
Satu paket pengiriman makanan dari SPPG ke sekolah tertentu pada satu hari layanan yang memiliki siklus status mutu terkontrol.
_Avoid_: Pengiriman Harian, Paket Makanan

**Manifest Distribusi (Pre-flight Logistik)**:
Catatan keberangkatan dari SPPG yang mendokumentasikan menu harian, komponen nutrisi, jam selesai masak, suhu makanan saat kirim, jumlah porsi, dan foto sampel hidangan sebelum diberangkatkan.
_Avoid_: Surat Jalan, Jadwal Pengiriman

**Berita Acara Penerimaan (BAP Sekolah)**:
Laporan verifikasi resmi dari PIC Sekolah yang mencatat waktu tiba makanan, kesesuaian jumlah porsi, kondisi kemasan/suhu, dan kelayakan konsumsi saat tiba di sekolah.
_Avoid_: Tanda Terima, Konfirmasi Kiriman

**Umpan Balik Siswa (Student Feedback)**:
Data kepuasan rasa, tekstur, porsi, dan sisa makanan (plate waste) yang diisi langsung oleh siswa melalui pemindaian QR Code interaktif tanpa akun.
_Avoid_: Review Siswa, Survey Siswa, Rating Aplikasi

**QR Bertanda Tangan Dinamis (Dynamic Signed QR)**:
Kode QR unik per Batch Distribusi yang memuat token kriptografis berbatas waktu dan kuota respon setara jumlah porsi makanan.
_Avoid_: QR Statis, Link Survey

**Validasi Geofence (Geofenced Feedback Verification)**:
Pengecekan koordinat lokasi GPS perangkat saat pengiriman umpan balik agar berada dalam radius area sekolah yang bersangkutan.
_Avoid_: Lokasi Pengguna, GPS Tracking

**Tingkat Sisa Makanan (Plate Waste Score)**:
Persentase makanan yang tidak habis dikonsumsi oleh siswa per menu/komponen untuk evaluasi daya terima makanan dan perbaikan resep gizi.
_Avoid_: Makanan Dibuang, Limbah Pangan, Sampah Makanan

**Tiket Komplain & Insiden (Incident Ticket)**:
Laporan ketidaksesuaian mutu pangan, keterlambatan, atau keluhan dari sekolah yang masuk ke antrean investigasi SPPG dengan batas SLA penyelesaian 1x24 jam.
_Avoid_: Komplain Keras, Tiket Bantuan, Keluhan, Food Safety Alert

**Komposisi Nutrisi & AKG**:
Data makronutrisi (Kalori, Protein, Karbohidrat, Lemak, Serat) serta informasi alergen per komponen menu untuk kepatuhan standar Angka Kecukupan Gizi.
_Avoid_: Info Kalori, Daftar Gizi
