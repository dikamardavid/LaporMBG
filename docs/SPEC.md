# Spesifikasi Sistem: Platform Pelaporan & Monitoring Operasional MBG (Siswa ➔ SPPG ➔ BGN)

## Problem Statement

Program nasional Makan Bergizi Gratis (MBG) menjangkau jutaan peserta didik setiap hari di seluruh Indonesia. Namun, pengawasan operasional menghadapi beberapa tantangan kritis:
1. **Ketiadaan Transparansi Hulu-ke-Hilir**: Badan Gizi Nasional (BGN) sulit memverifikasi secara real-time apakah makanan yang dimasak di Satuan Pelayanan Pemenuhan Gizi (SPPG) telah sampai di sekolah tepat waktu, dengan suhu aman, dan jumlah porsi yang sesuai.
2. **Keterbatasan Aksesibilitas di Sekolah**: Siswa (PAUD-SMA) tidak memiliki akun aplikasi personal atau dilarang membawa ponsel ke sekolah, sementara sekolah di wilayah 3T sering mengalami blank spot konektivitas internet saat serah terima makanan.
3. **Data Kepuasan & Sisa Makanan (Plate Waste) yang Bias**: Tanpa instrumen pengumpulan umpan balik langsung yang ramah anak dan terlindungi dari manipulasi data (spam/bot), SPPG dan BGN tidak memiliki data objektif mengenai daya terima menu dan tingkat pemborosan pangan.
4. **Penanganan Ketidaksesuaian yang Lambat**: Keluhan mengenai makanan kurang matang, porsi kurang, atau indikasi basi tidak terdokumentasi dalam antrean terstruktur dengan batas waktu penyelesaian yang jelas.

---

## Solution

Membangun platform pelaporan dan monitoring operasional MBG multi-tier terpadu yang menghubungkan seluruh pemangku kepentingan dalam satu ekosistem data:
- **Kanal Siswa (Penerima Manfaat)**: Form interaktif visual 4-langkah yang diakses melalui pemindaian *Dynamic Signed QR Code* per batch distribusi tanpa perlu login, divalidasi dengan radius *Geofencing* sekolah untuk menjamin keaslian respon.
- **Kanal PIC Sekolah**: Progressive Web App (PWA) berorientasi *Offline-First* dengan penyimpanan lokal IndexedDB untuk pencatatan Berita Acara Penerimaan (BAP), pencatatan suhu/porsi, serta pelaporan tiket insiden yang otomatis sinkron saat online.
- **Kanal SPPG (Dapur)**: Portal pembuatan *Manifest Distribusi* harian (komponen menu, estimasi AKG makronutrisi, foto sampel, waktu & suhu masak), generator QR, dashboard evaluasi *Plate Waste Score*, dan antrean penanganan tiket komplain dengan SLA 1x24 jam.
- **Kanal BGN (Pusat)**: Dashboard analitik makro nasional yang menampilkan radar risiko SPPG (kepatuhan SLA, skor kepuasan, insiden aktif), matriks pemenuhan gizi, dan ekspor laporan rekapitulasi audit.

---

## User Stories

### A. Siswa (Penerima Manfaat)
1. **Sebagai Siswa**, saya ingin memindai QR Code di baki/kelas tanpa perlu registrasi akun atau password, sehingga saya bisa memberikan ulasan secara instan dalam waktu istirahat sekolah (<30 detik).
2. **Sebagai Siswa**, saya ingin memilih ikon emotikon ekspresi wajah untuk menilai rasa makanan, sehingga saya dapat mengekspresikan kepuasan saya dengan mudah dan menyenangkan.
3. **Sebagai Siswa**, saya ingin memilih tingkat sisa makanan (*Plate Waste Selector*) menggunakan ilustrasi visual piring (Habis Total, Sisa Sedikit, Sisa Separuh, Hampir Tidak Dimakan), sehingga saya dapat menginformasikan porsi/komponen mana yang tidak habis saya makan.
4. **Sebagai Siswa**, saya ingin memilih *quick tags* alasan rasa (seperti "Enak Banget", "Kurang Gurih", "Sayur Terlalu Lembek", "Dingin", "Porsi Pas"), sehingga tim dapur mengetahui secara persis aspek masakan yang perlu diperbaiki.
5. **Sebagai Siswa**, saya ingin memiliki opsi melampirkan foto sisa makanan atau memberikan catatan singkat, sehingga saya dapat menunjukkan bagian makanan yang tidak sesuai.
6. **Sebagai Siswa**, saya ingin melihat konfirmasi visual animasi setelah berhasil mengirim ulasan, sehingga saya yakin suara saya sudah didengar oleh pihak dapur dan pemerintah.

### B. PIC Sekolah (Penanggung Jawab Sekolah)
7. **Sebagai PIC Sekolah**, saya ingin login menggunakan *passwordless Magic Link / OTP WhatsApp*, sehingga saya tidak perlu menghafal kata sandi dan proses serah terima akun antar guru piket berjalan mulus.
8. **Sebagai PIC Sekolah**, saya ingin mencatat Berita Acara Penerimaan (BAP) makanan (jam tiba, suhu makanan, dan jumlah porsi diterima vs target) secara offline ketika jaringan sekolah sedang terputus, sehingga distribusi makanan ke kelas tidak terhambat.
9. **Sebagai PIC Sekolah**, saya ingin mengambil foto bukti fisik penerimaan makanan langsung melalui aplikasi PWA, sehingga dokumentasi kondisi makanan tersimpan dengan stempel waktu otentik.
10. **Sebagai PIC Sekolah**, saya ingin aplikasi secara otomatis menyinkronkan data BAP yang tersimpan di IndexedDB saat perangkat saya terhubung kembali ke internet, sehingga saya tidak perlu melakukan pengunggahan ulang secara manual.
11. **Sebagai PIC Sekolah**, saya ingin membuat *Tiket Komplain & Insiden* jika menemukan makanan berbau asam, kemasan rusak, atau porsi kurang, sehingga SPPG segera melakukan investigasi formal.
12. **Sebagai PIC Sekolah**, saya ingin memantau status tindak lanjut tiket komplain dan membaca klarifikasi serta aksi korektif dari SPPG pengampu.

### C. Tim Dapur & Ahli Gizi SPPG
13. **Sebagai Ahli Gizi SPPG**, saya ingin menginput rincian komponen menu harian beserta estimasi makronutrisi (Kalori, Protein, Karbohidrat, Lemak, Serat) dan label alergen, sehingga kepatuhan standar AKG nasional dapat terpantau sistematis.
14. **Sebagai Kepala Dapur SPPG**, saya ingin mencatat *Manifest Distribusi* (jam selesai masak, jam keberangkatan, suhu pengiriman, armada kurir, foto sampel hidangan), sehingga titik kontrol mutu (*holding time* batas aman) terdokumentasi sebelum makanan diberangkatkan.
15. **Sebagai Staf SPPG**, saya ingin men-generate dan mencetak lembar serah terima beserta stiker *Dynamic Signed QR Code* per sekolah penerima, sehingga kode QR siap ditempel pada wadah/baki distribusi.
16. **Sebagai Manajer SPPG**, saya ingin melihat dashboard operasional harian yang menampilkan rekapitulasi status BAP dari seluruh sekolah binaan secara real-time.
17. **Sebagai Manajer SPPG**, saya ingin melihat analitik *Plate Waste Score* dan ranking menu favorit vs menu yang paling banyak bersisa, sehingga tim menu dapat memodifikasi resep pada siklus berikutnya.
18. **Sebagai Manajer SPPG**, saya ingin menerima notifikasi antrean *Tiket Komplain* baru dari sekolah dengan *countdown timer SLA 1x24 jam*, sehingga tim dapur dapat menyelesaikan investigasi tepat waktu.

### D. Badan Gizi Nasional (BGN Pusat & Auditor)
19. **Sebagai Pimpinan BGN**, saya ingin melihat ringkasan makro nasional (total porsi tersalurkan hari ini, persentase sekolah yang berhasil menerima makanan, rata-rata skor kepuasan nasional), sehingga saya memiliki gambaran utuh performa program setiap hari.
20. **Sebagai Auditor BGN**, saya ingin melihat *Peta Sebaran & Radar Risiko SPPG* dengan indikator warna (Hijau: Normal, Kuning: Keterlambatan/Komplain >5%, Merah: Ada Tiket Kritis Melebihi SLA), sehingga intervensi pengawasan dapat diprioritaskan secara presisi.
21. **Sebagai Tim Gizi BGN**, saya ingin memantau agregasi pemenuhan Angka Kecukupan Gizi (AKG) harian di tingkat provinsi dan kabupaten/kota berdasarkan data manifest SPPG.
22. **Sebagai Auditor BGN**, saya ingin mengunduh laporan rekapitulasi operasional dan log audit dalam format Excel/PDF per wilayah/rentang tanggal, sehingga data siap digunakan untuk keperluan audit kepatuhan regulasi dan transparansi anggaran.
23. **Sebagai Administrator BGN**, saya ingin mengelola master data SPPG, klaster sekolah binaan, dan penetapan kuota alokasi porsi harian.

---

## Implementation Decisions

### 1. Model Domain & Hierarki Data
- Menggunakan skema data terpadu 3-tingkat: **BGN** (Regulator/Auditor) ➔ **SPPG** (Unit Produksi Dapur) ➔ **Sekolah** (Penerima Manfaat).
- Pemisahan akses berbasis *Role-Based Access Control (RBAC)* dengan Single PostgreSQL Database dan *Tenant Scoping* via foreign keys (`sppg_id`, `school_id`). *(Ref: ADR-0004)*

### 2. State Machine Siklus Hidup Batch Distribusi
Setiap paket pengiriman harian memiliki siklus status mutu terkontrol:
`PRE_FLIGHT_LOGGED` ➔ `DISPATCHED` ➔ `ARRIVED_AT_SCHOOL` ➔ `BAP_VERIFIED` ➔ `FEEDBACK_WINDOW_OPEN` ➔ `BATCH_RECONCILED`.

```typescript
type BatchStatus = 
  | "PRE_FLIGHT_LOGGED" 
  | "DISPATCHED" 
  | "ARRIVED_AT_SCHOOL" 
  | "BAP_VERIFIED" 
  | "FEEDBACK_WINDOW_OPEN" 
  | "BATCH_RECONCILED";
```

### 3. Dynamic Signed QR & Geofencing Anti-Spam
- QR Code dibangkitkan dinamis per `DistributionBatch` menggunakan payload token bertanda tangan kriptografis (HMAC SHA-256) yang mengenkode `batchId`, `schoolId`, `serviceDate`, dan `exp`.
- Submission ulasan siswa dibatasi kuota maksimal sama dengan jumlah porsi yang dikirimkan ke sekolah tersebut.
- Browser siswa meminta izin koordinat GPS saat submit untuk memvalidasi *Haversine Geofence* berada dalam radius toleransi (misal: radius 500 meter) dari koordinat sekolah. *(Ref: ADR-0001, ADR-0003)*

### 4. PWA Offline-First untuk PIC Sekolah
- Menggunakan Service Worker dengan cache assets statis dan IndexedDB untuk antrean offline transaksi BAP (`bap_offline_queue`).
- Foto bukti dikompresi di sisi browser sebelum disimpan ke IndexedDB dan diunggah saat event `online` terdeteksi. *(Ref: ADR-0003)*

### 5. Alur Tiket Komplain Terkelola (SLA 1x24 Jam)
- Keluhan mutu atau ketidaksesuaian BAP dikonversi menjadi entitas `IncidentTicket` yang terikat pada `batch_id` dan `sppg_id`.
- SPPG wajib merespons klarifikasi, mengunggah bukti investigasi dapur, dan menentukan tindakan korektif sebelum `sla_deadline` (24 jam sejak tiket dibuka). *(Ref: ADR-0002)*

### 6. Struktur Data Gizi & Form Interaktif
- Manifest SPPG mencatat rincian makronutrisi per menu (Kalori, Protein, Karbohidrat, Lemak, Serat, Alergen).
- Form umpan balik siswa didesain 4-langkah visual (Emotikon rasa 1-5, Visual Plate Waste, Quick Tags, Foto sisa opsional). *(Ref: ADR-0005)*

---

## Testing Decisions

### Seams Pengujian (Testing Seams)
Pengujian difokuskan pada perilaku eksternal (*external behavior*) pada titik temu kritis (high seams):

1. **Seam 1: Dynamic Signed QR & Token Verification**:
   - Memverifikasi token valid pada jam operasional batch.
   - Memverifikasi penolakan token kadaluarsa atau token dari sekolah yang berbeda.
   - Memverifikasi kalkulasi validasi Geofence (koordinat di dalam vs di luar radius sekolah).
2. **Seam 2: Batch Distribution State Machine & Quality Control**:
   - Memverifikasi transisi status batch dari `PRE_FLIGHT_LOGGED` hingga `BATCH_RECONCILED`.
   - Memverifikasi holding time (durasi waktu selesai masak hingga penerimaan di sekolah) dan deteksi anomali suhu.
3. **Seam 3: Offline BAP Queue & Reconciliation**:
   - Memverifikasi bahwa payload BAP tersimpan utuh di antrean lokal saat kondisi offline dan berhasil terkirim ke database saat sinkronisasi online.
4. **Seam 4: Incident Ticket SLA Counter & Escalation**:
   - Memverifikasi perhitungan `sla_deadline` 24 jam dan status eskalasi peringatan pada Dashboard SPPG & BGN jika mendekati batas waktu.
5. **Seam 5: RBAC Authorization & Multi-Tenancy Boundary**:
   - Memverifikasi bahwa akun SPPG A tidak dapat mengakses atau memanipulasi data sekolah/batch milik SPPG B.

---

## Out of Scope

1. **Manajemen Pengadaan Bahan Baku Hulu**: Sistem e-procurement pembelian beras/sayur langsung ke petani/koperasi lokal (dikelola oleh modul logistik terpisah).
2. **Payroll & Penggajian Karyawan SPPG**: Sistem absensi juru masak dan penggajian staf dapur.
3. **Sistem Penilaian Akademik Siswa**: Integrasi nilai rapor atau profil akademis sekolah di luar data demografi kuota makan bergizi.

---

## Further Notes

- Seluruh terminologi wajib merujuk pada kamus kanonik di [CONTEXT.md](file:///Users/goregadget/.gemini/antigravity/scratch/mbg-reporting/CONTEXT.md).
- Keputusan desain arsitektural didokumentasikan di [docs/adr/](file:///Users/goregadget/.gemini/antigravity/scratch/mbg-reporting/docs/adr/).
- Desain antarmuka publik siswa harus ramah sentuhan (touch-friendly), kontras tinggi, dan responsif pada berbagai ukuran layar ponsel/tablet.
