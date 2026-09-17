# Design Specification: Kitchen Manifest UX & Thermal/A4 Printable QR Stickers

**Issue**: GORE-18 / Issue #36  
**Epic**: 02 — EPIC 2: SPPG Kitchen Operations & Dynamic Signed QR Generator  
**Role**: Senior Product & UI/UX Designer  
**Target Stakeholders**: Kepala Dapur & Ahli Gizi SPPG, Petugas Logistik/Kurir, PIC Sekolah, Frontend Engineer (GORE-15, GORE-16)

---

## 1. Executive Summary & Design Rationale

Platform LaporMBG menghubungkan rantai pasok makanan bergizi dari dapur Satuan Pelayanan Pemenuhan Gizi (SPPG) hingga ke sekolah penerima manfaat. Lingkungan operasional dapur SPPG memiliki tantangan fisik dan ergonomis yang unik:
- **Kondisi Lingkungan Ekstrem**: Suhu ruangan panas (35°C - 45°C), kelembapan tinggi, uap air dari kuali masak, serta cipratan minyak dan kuah.
- **Batasan Fisik Pengguna**: Staf dapur dan koki mengenakan sarung tangan plastik/karet basah atau berminyak, serta bekerja dalam tempo tinggi pada *morning rush* (pukul 05.00 - 08.30 WIB).
- **Integritas Fisik Media**: Wadah baki/thermobox yang dikirimkan mengalami kondensasi uap panas, gesekan di mobil armada, dan tumpahan minyak ringan sebelum tiba di sekolah untuk dipindai oleh siswa/guru.

Desain ini menetapkan dua pilar solusi:
1. **Kitchen Manifest Tablet UX**: Antarmuka berbasis tablet landscape (1024x768 / 1280x800) yang memiliki *touch target* minimal 48x48px, kontras visual tinggi, kontrol numerik *stepped*, kalkulator masa simpan (*holding time*), serta indikator titik kontrol mutu suhu (CCP) bersertifikasi keamanan pangan.
2. **High-Contrast Physical QR Sticker & Surat Jalan Layouts**: Tata letak cetak monokromik tahan basah/minyak untuk printer Thermal (58mm dan 80mm) serta kertas stiker A4 multi-label (8-up grid), dilengkapi sertifikat mutu dan batas waktu konsumsi yang tidak luntur bila terkena uap dan minyak.

---

## 2. Kitchen Manifest Tablet UX Architecture

### 2.1. Ergonomic & Usability Principles
- **Touch Target Minimum**: Seluruh elemen interaktif (tombol, input, selector) memiliki tinggi minimum 48px dengan jarak antar-elemen (gap) minimal 12px untuk mencegah *accidental touch* saat memakai sarung tangan tebal.
- **High-Contrast Dark Text on Crisp Surfaces**: Menggunakan warna teks `#0f172a` (Slate-900) di atas latar `#ffffff` atau `#f8fafc` dengan rasio kontras 12:1 (jauh di atas batas WCAG 2.2 AA 4.5:1).
- **Stepped & Direct Numeric Inputs**: Input suhu dan kuota porsi dilengkapi tombol `+` dan `-` besar di samping input keyboard langsung, mempercepat penyesuaian di dapur tanpa harus mengetik manual seluruh angka.
- **Haptic & Visual Feedback**: Setiap status suhu dan batas waktu memberikan feedback warna instan yang tidak ambigu.

### 2.2. Information Architecture & Section Breakdown

| Section | Komponen Data | Elemen UX & Titik Kontrol |
|---|---|---|
| **1. Header & Batch Meta** | Tanggal Layanan, SPPG ID, Sekolah Tujuan, Alokasi Porsi | Dropdown sekolah binaan besar, badge status batch (`DRAFT`), kalkulator total baki/container |
| **2. Komposisi Menu & AKG** | Karbohidrat, Lauk Hewani, Lauk Nabati, Sayur, Buah, Susu | Multi-item row, kalkulasi otomatis Kalori (kcal), Protein (g), Karbohidrat (g), Lemak (g), Serat (g) |
| **3. Allergen Alert Matrix** | 6 Kategori Alergen: Telur, Susu/Dairy, Kacang, Ikan/Seafood, Kedelai, Gluten | Chip toggle berukuran 48px dengan ikon visual dan indikator aktif warna kontras |
| **4. Titik Kontrol Mutu (CCP)** | Jam Selesai Masak, Jam Berangkat, Suhu Keberangkatan | Kalkulator otomatis Holding Time (Max 4 jam), Suhu Keberangkatan Gauge (Safe/Warning/Danger) |
| **5. Foto Sampel Hidangan** | Foto baki sampel representatif sebelum ditutup | Guided Camera Frame (4:3 ratio) dengan tombol Shutter besar dan thumbnail review |
| **6. Logistik & Kurir** | Nama Kurir, Nomor Polisi Armada, Nomor Telepon, Nomor Segel | Form ringkas untuk melacak rantai dingin/panas selama perjalanan |
| **7. Persistent Bottom Bar** | Aksi: "Simpan Draft" & "Kunci Manifest & Cetak QR" | Tombol tinggi 56px, konfirmasi modal saat mengunci batch menjadi `PRE_FLIGHT_LOGGED` |

### 2.3. Critical Control Point (CCP) Temperature Rules

Sesuai standar sanitasi dan keamanan pangan Badan Gizi Nasional (BGN) serta WHO Five Keys to Safer Food, makanan matang yang disimpan panas (*hot holding*) wajib diberangkatkan pada suhu aman di atas batas berkembang biak bakteri:

```
                BAHAYA MUTU                      PERINGATAN                      SUHU AMAN
           (Zona Bahaya Bakteri)          (Segera Berangkatkan)             (Bakteri Dorman)
   [-----------------------------)[-----------------------)[--------------------------------->
  0°C                           50°C                    60°C                               100°C
              MERAH                              KUNING                            HIJAU
           (#ef4444)                           (#f59e0b)                         (#059669)
  Tombol Cetak QR DIBLOKIR          Peringatan: Wajib Thermobox      Validasi Lolos & Siap Cetak
```

1. **Zone Aman (>= 60.0°C)**:
   - Warna: Token `Brand/Primary` (`#059669`) / `Status/Success` (`#10b981`).
   - Copy: *"SUHU AMAN — Titik kontrol mutu terpenuhi. Makanan siap dikunci dan diberangkatkan."*
   - Status: Tombol *"Kunci Manifest & Cetak QR"* aktif.
2. **Zone Peringatan (50.0°C - 59.9°C)**:
   - Warna: Token `Status/Warning-SLA` (`#f59e0b`).
   - Copy: *"PERINGATAN SUHU — Suhu mendekati batas kritis. Wajib menggunakan wadah berinsulasi ganda dan dikirim segera!"*
   - Status: Memerlukan konfirmasi checklist persetujuan Kepala Dapur sebelum mencetak.
3. **Zone Bahaya (< 50.0°C)**:
   - Warna: Token `Status/Danger-Incident` (`#ef4444`).
   - Copy: *"BAHAYA KEAMANAN PANGAN — Suhu makanan berada di zona bahaya pertumbuhan bakteri patogen (< 50°C). Batch tidak dapat diberangkatkan!"*
   - Status: Tombol cetak dikunci/disabled total untuk mencegah keracunan pangan di sekolah.

---

## 3. Physical QR Sticker Layout Specifications

Stiker ditempelkan pada wadah pengiriman makanan (thermobox/gastronorm) yang dibagikan ke sekolah. Setiap stiker memuat **Dynamic Signed QR Code** (HMAC-SHA256) yang memungkinkan siswa dan guru mengakses portal umpan balik dan serah terima secara instan.

### 3.1. Spesifikasi Format Thermal 58mm (Receipt / Small Label)
- **Dimensi**: Lebar 58mm x Tinggi 65mm.
- **Resolusi Output**: 203 DPI (8 dots/mm) -> 464px x 520px.
- **Warna**: Murni 1-bit Monokrom (`#000000` di atas `#ffffff`), tanpa shading abu-abu agar printer thermal ekonomis tidak menghasilkan artefak buram.
- **Hierarki Konten**:
  1. Header Strip: `[ BGN • SPPG MBG ]` (Bold 10pt)
  2. Nama Sekolah Tujuan: `SDN RAWAMANGUN 01` (Bold 13pt)
  3. Batch & Porsi: `BATCH: #MBG-20260917-01` | `KOUTA: 350 PORSI`
  4. Core QR Code: Ukuran minimal 32mm x 32mm, Error Correction Level Q (25% recovery), Quiet Zone 4 modul putih keliling.
  5. Negative Bar (Kotak Hitam Teks Putih): `KONSUMSI SBLM: 12:30 WIB`
  6. Suhu & Waktu Kirim: `SUHU: 65°C [AMAN] | PK 08:15`
  7. Call-to-Action: `SCAN UNTUK PENILAIAN MAKANAN`

### 3.2. Spesifikasi Format Thermal 80mm (Standard Kitchen Label)
- **Dimensi**: Lebar 80mm x Tinggi 100mm.
- **Resolusi Output**: 203 DPI -> 640px x 800px.
- **Hierarki Konten**:
  1. Official Header: Logo BGN + Identitas Satuan Pelayanan Pemenuhan Gizi (SPPG).
  2. Detail Penerima: Nama Sekolah, Nomor Klaster, Jumlah Porsi, Alamat Singkat.
  3. Dynamic Signed QR Code: Ukuran 45mm x 45mm, Error Correction Level Q (mampu terbaca meskipun terkena goresan atau cipratan minyak hingga 25% area).
  4. Komposisi Menu Ringkas & Label Alergen: Contoh: *"Nasi Putih, Ayam Bakar, Sup Brokoli, Pisang. [Alergen: Telur, Kedelai]"*.
  5. Stempel Jaminan Keamanan Pangan:
     - Waktu Selesai Masak: `07:15 WIB`
     - Waktu Berangkat: `08:15 WIB`
     - Suhu Keberangkatan: `68°C (STANDAR >= 60°C TERPENUHI)`
  6. Batas Akhir Konsumsi: `BATAS KONSUMSI: MAKS 12:30 WIB (HOLDING TIME 4 JAM)`.
  7. Klausul Integritas: *"JANGAN TERIMA JIKA SEGEL THERMOBOX RUSAK ATAU MAKANAN BERBAU ASAM"*.

### 3.3. Spesifikasi Lembar Stiker A4 Grid (8-Up Die-Cut Sheet)
- **Dimensi**: Kertas A4 Standar (210mm x 297mm).
- **Grid Layout**: 2 Kolom x 4 Baris = 8 label stiker per lembar.
- **Ukuran Tiap Label**: 99.1mm x 67.7mm dengan margin potong aman 3mm.
- **Kelebihan**: Sangat efisien untuk SPPG yang belum memiliki printer thermal khusus, dapat dicetak menggunakan printer kantor biasa di atas kertas stiker tahan air (waterproof vinyl/synthetic sticker).

### 3.4. Rekomendasi Material & Ketahanan Lingkungan
- **Bahan Kertas**: *Top-Coated Thermal Synthetic Paper* (Polypropylene / BOPP) dengan lapisan pelindung tahan air, minyak, alkohol, dan uap panas hingga 80°C.
- **Lem/Perekat**: *High-Tack Permanent Acrylic Food-Contact Adhesive* yang menempel kuat pada permukaan *stainless steel* baki gastronorm dan kotak styrofoam/thermobox berinsulasi.
- **Daya Baca Kamera**: Diuji untuk kamera ponsel beresolusi rendah (kamera siswa/guru) pada jarak 15 cm - 40 cm pada kondisi pencahayaan kelas remang (200 lux) hingga terik siang hari (1000 lux).

---

## 4. Surat Jalan Serah Terima Makanan Resmi (A4 Handover Sheet)

Dokumen fisik A4 Portrait resmi yang mendampingi pengemudi saat mengantarkan makanan ke sekolah:
1. **Kop Resmi**: Lambang Garuda / Logo BGN di kiri, Logo SPPG di kanan, Judul: *"SURAT JALAN & BERITA ACARA SERAH TERIMA MAKANAN BERGIZI GRATIS"*.
2. **Nomor Dokumen & Tanggal**: Contoh: `No: MBG/SJL/2026/09/17/0042`.
3. **Data Pengirim & Penerima**: SPPG, Penanggung Jawab Dapur, Sekolah Tujuan, Nama PIC Sekolah, Nomor Kontak.
4. **Tabel Rincian Manifest Makanan**:
   - Komponen Menu & Takaran
   - Jumlah Porsi yang Dikirim
   - Jumlah Wadah / Container / Thermobox
   - Kondisi Segel Keamanan Wadah
5. **Form Verifikasi Titik Kontrol Mutu Lapangan**:
   - Kolom Jam Selesai Masak (SPPG)
   - Kolom Jam Berangkat & Suhu Berangkat (SPPG, target >=60°C)
   - Kolom Jam Tiba di Sekolah & Suhu Saat Tiba (Diisi oleh PIC Sekolah, target >=50°C)
   - Checklist Fisik: Bau Segar, Kemasan Utuh, Tekstur Normal, Suhu Cukup Panas.
6. **Blok Tanda Tangan 3 Pihak**:
   - Pihak 1: Kepala Dapur / Ahli Gizi SPPG
   - Pihak 2: Pengemudi / Kurir Distribusi
   - Pihak 3: PIC Sekolah Penerima (Guru Piket)
7. **Pusat Bantuan & Saluran Darurat**: Nomor hotline BGN dan prosedur eskalasi jika makanan mengalami keterlambatan >60 menit atau suhu tiba di bawah 45°C.

---

## 5. Token System & Figma Variable Mapping

Seluruh rancangan visual terikat penuh pada Design Tokens yang telah dibakukan:

| Elemen UI | Variable Token | Nilai Hex / Float | Penggunaan |
|---|---|---|---|
| **Header / Brand Primary** | `Brand/Primary` | `#059669` | Aksen tombol utama, header section |
| **BGN Official Navy** | `BGN/Navy-900` | `#0f172a` | Header kop surat jalan, teks judul display |
| **Suhu Aman Badge** | `PlateWaste/Clean-0pct` | `#10b981` | Indikator suhu >= 60°C aman |
| **Suhu Warning Badge** | `Status/Warning-SLA` | `#f59e0b` | Indikator suhu 50°C - 59°C |
| **Suhu Bahaya Badge** | `Status/Danger-Incident` | `#ef4444` | Indikator suhu < 50°C dilarang kirim |
| **Surface Background** | `Brand/Surface` | `#ecfdf5` | Background kartu ringkasan gizi |
| **Canvas Background** | `Neutral/Slate-50` | `#f8fafc` | Latar belakang halaman tablet |
| **Border & Divider** | `Neutral/Slate-200` | `#e2e8f0` | Pembatas kartu dan tabel |
| **Large Touch Padding** | `Spacing/md` & `Spacing/lg` | `16px` & `24px` | Padding tombol sentuh dan kartu |
| **Corner Radius** | `Radius/md` & `Radius/lg` | `12px` & `16px` | Sudut membulat modern |
| **Primary Typography** | `Typography/Family/Primary` | `Inter` | Tipografi tegas terbaca jelas |

---

## 6. Handoff Guidelines for Front-End Engineers (GORE-15 & GORE-16)

1. **Untuk GORE-15 (Form Multi-Step Manifest)**:
   - Gunakan layout responsif yang dioptimalkan untuk ukuran layar `>= 768px` (tablet landscape).
   - Pastikan touch area tombol `+` / `-` pada suhu dan porsi minimal `48px x 48px`.
   - Hitung nilai holding time secara reaktif: `holdingTimeMinutes = differenceInMinutes(departureTime, cookTime)`. Berikan badge merah jika `> 240` menit (4 jam).
   - Validasi `departureTemp`: Jika `< 50`, kunci submit button dan tampilkan banner peringatan bahaya mutu.
2. **Untuk GORE-16 (Printable Stickers & Surat Jalan)**:
   - Terapkan CSS `@media print` khusus agar header/footer browser (`about:blank`, pagination default) hilang dengan aturan `@page { margin: 0; }`.
   - Untuk stiker 58mm, gunakan layout CSS murni hitam-putih `filter: grayscale(100%) contrast(200%)` untuk memastikan output thermal tajam.
   - Gunakan library `qrcode` dengan opsi `{ errorCorrectionLevel: 'Q', margin: 1 }`.
