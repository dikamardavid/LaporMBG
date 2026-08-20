#!/usr/bin/env python3
import os
import sys
import json
import urllib.request
import urllib.error

def main():
    repo = os.environ.get("GITHUB_REPO") or (sys.argv[1] if len(sys.argv) > 1 else "dikamardavid/LaporMBG")
    token = os.environ.get("GITHUB_TOKEN") or (sys.argv[2] if len(sys.argv) > 2 else "None")

    sub_issues = [
        # Epic 1 (Parent #1)
        {
            "parent": 1,
            "title": "[BE] Database Schema Design with Prisma ORM & Multi-Tenant Scoping",
            "role": "backend",
            "body": """## Parent Epic
Part of #1

## What to build
Merancang skema database PostgreSQL menggunakan Prisma ORM untuk mengisolasi data antar tenant (BGN, SPPG, Sekolah).
Entitas inti: User, Role, SPPG, School, ClusterMapping, Menu, DistributionBatch, BapReceipt, StudentFeedback, IncidentTicket.

## Acceptance Criteria
- [ ] Skema Prisma terdefinisi lengkap dengan relasi dan composite index yang tepat.
- [ ] Foreign keys mengunci kepemilikan data ke `sppg_id` atau `school_id`.
- [ ] Migrasi database berhasil dijalankan tanpa konflik.
- [ ] Script seeding menghasilkan data uji coba realistis (1 BGN, 2 SPPG, 5 Sekolah).
"""
        },
        {
            "parent": 1,
            "title": "[BE] RBAC Middleware & Passwordless OTP/Magic Link Auth Service",
            "role": "backend",
            "body": """## Parent Epic
Part of #1

## What to build
Membangun service autentikasi dan middleware otorisasi berbasis peran (BGN_ADMIN, BGN_AUDITOR, SPPG_ADMIN, SPPG_CHEF, SCHOOL_PIC) serta layanan login Passwordless OTP/Magic Link untuk PIC Sekolah.

## Acceptance Criteria
- [ ] PIC Sekolah dapat login melalui nomor WhatsApp/Email via kode OTP 6-digit atau Magic Link.
- [ ] Middleware Next.js memblokir akses rute yang tidak sesuai hak akses peran.
- [ ] Token session terenkripsi (JWT/Session Cookie) dengan masa berlaku yang aman.
"""
        },
        {
            "parent": 1,
            "title": "[FE] Next.js 14 App Shell, Theme & Unified Auth Portal",
            "role": "frontend",
            "body": """## Parent Epic
Part of #1

## What to build
Menyiapkan struktur Next.js App Router, tema Tailwind CSS, komponen dasar Shadcn UI, serta antarmuka login terpadu (Email/Password untuk Admin & OTP untuk PIC Sekolah).

## Acceptance Criteria
- [ ] App shell responsif dengan navigasi sidebar dinamis berdasarkan peran pengguna.
- [ ] Halaman login terpadu dengan validasi form dan feedback error yang jelas.
- [ ] State management autentikasi tersimpan aman di client context.
"""
        },
        {
            "parent": 1,
            "title": "[QA] Multi-Tenant Isolation & Session Token Expiration Test Suite",
            "role": "qa",
            "body": """## Parent Epic
Part of #1

## What to build
Membuat automated test suite untuk menguji keamanan isolasi data antar tenant (Cross-Tenant Data Leak Test) dan skenario siklus hidup session token.

## Acceptance Criteria
- [ ] Test memastikan SPPG A mendapat HTTP 403 saat mengakses data milik SPPG B.
- [ ] Test verifikasi kegagalan login saat OTP kadaluarsa (>5 menit) atau salah input >3 kali.
"""
        },

        # Epic 2 (Parent #2)
        {
            "parent": 2,
            "title": "[BE] Distribution Manifest & Macronutrient AKG Estimation API",
            "role": "backend",
            "body": """## Parent Epic
Part of #2

## What to build
Endpoint REST / Server Action untuk pencatatan Manifest Distribusi harian SPPG, mencakup komponen menu, takaran makronutrisi (Kalori kcal, Protein, Karbohidrat, Lemak, Serat), jam masak, dan suhu keberangkatan.

## Acceptance Criteria
- [ ] Endpoint validasi batas suhu aman (menolak jika suhu keberangkatan < 60°C).
- [ ] Kalkulasi otomatis total kalori dan persentase pemenuhan AKG per porsi.
- [ ] Status batch bertransisi ke `PRE_FLIGHT_LOGGED`.
"""
        },
        {
            "parent": 2,
            "title": "[BE] Cryptographic HMAC-SHA256 Dynamic QR Token Generator",
            "role": "backend",
            "body": """## Parent Epic
Part of #2

## What to build
Layanan pembuatan token QR dinamis bertanda tangan kriptografis (HMAC-SHA256) yang mengenkode batchId, schoolId, serviceDate, maxQuota, dan exp time.

## Acceptance Criteria
- [ ] Token QR tidak dapat dipalsukan atau diubah isinya (*tamper-proof*).
- [ ] Token otomatis kadaluarsa setelah jendela waktu ulasan berakhir (pukul 16:00 WIB pada hari layanan).
"""
        },
        {
            "parent": 2,
            "title": "[FE] Kitchen Pre-flight Manifest Multi-Step Input Form",
            "role": "frontend",
            "body": """## Parent Epic
Part of #2

## What to build
Antarmuka form input manifest dapur SPPG: upload foto sampel masakan, input waktu selesai masak, pencatatan suhu armada, dan builder komponen menu.

## Acceptance Criteria
- [ ] Form multi-step intuitif dengan preview foto sampel masakan sebelum submit.
- [ ] Live preview indikator total kalori dan gizi saat komponen menu ditambahkan.
"""
        },
        {
            "parent": 2,
            "title": "[FE/Design] Printable Dynamic QR Stickers & Handover Sheets",
            "role": "frontend",
            "body": """## Parent Epic
Part of #2

## What to build
Template cetak stiker QR Code (format thermal & lembar A4) dan Surat Jalan Serah Terima Makanan per sekolah tujuan.

## Acceptance Criteria
- [ ] Tampilan stiker QR high-contrast dan siap cetak via tombol Print browser.
- [ ] Surat jalan memuat rincian menu, jumlah porsi target, jam berangkat, dan kolom tanda tangan serah terima.
"""
        },
        {
            "parent": 2,
            "title": "[QA] QR Tampering & Departure Temperature Constraint Tests",
            "role": "qa",
            "body": """## Parent Epic
Part of #2

## What to build
Uji coba manipulasi signature QR code dan pengujian batas kondisi suhu pengiriman makanan.

## Acceptance Criteria
- [ ] Server menolak request verifikasi jika token QR dimanipulasi 1 karakter sekalipun.
- [ ] Validasi form memberikan peringatan merah jika suhu armada di bawah batas standar keamanan pangan.
"""
        },

        # Epic 3 (Parent #3)
        {
            "parent": 3,
            "title": "[FE] School PWA Setup with Service Worker & IndexedDB Queue",
            "role": "frontend",
            "body": """## Parent Epic
Part of #3

## What to build
Konfigurasi Progressive Web App (PWA) lengkap dengan Service Worker caching dan IndexedDB queue (`localforage`) untuk menyimpan form BAP secara lokal saat offline.

## Acceptance Criteria
- [ ] Aplikasi dapat diinstall ke homescreen ponsel/tablet (PWA installable).
- [ ] Indikator status jaringan real-time (Online/Offline badge).
- [ ] Transaksi BAP lokal tersimpan di antrean IndexedDB saat tanpa internet.
"""
        },
        {
            "parent": 3,
            "title": "[FE] School BAP Form with Local Image Compression & Auto-Sync",
            "role": "frontend",
            "body": """## Parent Epic
Part of #3

## What to build
Formulir pencatatan Berita Acara Penerimaan (BAP) oleh PIC Sekolah: jam tiba, suhu saat diterima, jumlah porsi aktual, dan upload foto bukti fisik dengan kompresi lokal sebelum disimpan ke antrean offline.

## Acceptance Criteria
- [ ] Foto bukti penerimaan otomatis dikompresi di sisi client (<500KB) agar cepat terunggah.
- [ ] Event listener `window.addEventListener(online)` otomatis memicu pengunggahan antrean BAP ke server.
"""
        },
        {
            "parent": 3,
            "title": "[BE] Idempotent BAP Ingestion & State Reconciliation API",
            "role": "backend",
            "body": """## Parent Epic
Part of #3

## What to build
Endpoint penerimaan BAP yang idempotent untuk mencegah duplikasi data jika client PWA melakukan sinkronisasi berulang saat sinyal tidak stabil.

## Acceptance Criteria
- [ ] Request sinkronisasi dengan UUID transaksi yang sama tidak menghasilkan duplikasi record di database.
- [ ] Status batch berhasil diubah menjadi `BAP_VERIFIED`.
"""
        },
        {
            "parent": 3,
            "title": "[QA] Offline-to-Online Network Resilience & Photo Integrity Tests",
            "role": "qa",
            "body": """## Parent Epic
Part of #3

## What to build
Pengujian skenario ekstrem serah terima makanan dalam kondisi jaringan offline (Airplane Mode) hingga konektivitas pulih.

## Acceptance Criteria
- [ ] Data BAP dan foto yang diinput saat offline terkirim utuh tanpa korupsi data saat internet aktif kembali.
"""
        },

        # Epic 4 (Parent #4)
        {
            "parent": 4,
            "title": "[FE] 4-Step Mobile Visual Feedback Flow for Students",
            "role": "frontend",
            "body": """## Parent Epic
Part of #4

## What to build
Antarmuka publik mobile web ulasan siswa (<30 detik): Emotikon rasa (1–5), visual piring Plate Waste Selector, Quick Tags rasa, dan selebrasi konfirmasi animasi.

## Acceptance Criteria
- [ ] Desain ramah anak, tombol sentuh besar, kontras tinggi, dan tanpa form input teks yang wajib.
- [ ] Konfirmasi sukses menampilkan animasi confetti / mikro-animasi perayaan.
"""
        },
        {
            "parent": 4,
            "title": "[BE] Haversine Geofencing Validator & Quota Rate-Limiter API",
            "role": "backend",
            "body": """## Parent Epic
Part of #4

## What to build
Endpoint pemrosesan ulasan siswa yang memvalidasi radius koordinat GPS perangkat siswa menggunakan formula Haversine (radius <= 500m dari sekolah) dan kuota maksimum porsi harian.

## Acceptance Criteria
- [ ] Menolak ulasan jika GPS perangkat terdeteksi di luar radius sekolah penerima manfaat.
- [ ] Menolak submission jika jumlah ulasan telah mencapai kuota porsi yang dikirimkan.
"""
        },
        {
            "parent": 4,
            "title": "[QA] Geofence Boundary & Lunch Rush Concurrent Load Tests",
            "role": "qa",
            "body": """## Parent Epic
Part of #4

## What to build
Pengujian batas toleransi koordinat GPS dan simulasi beban puncak (load testing 10.000 req serentak pada jam istirahat makan siang).

## Acceptance Criteria
- [ ] Sistem memproses lonjakan submission ulasan tanpa error 500 atau race condition pada kuota porsi.
"""
        },

        # Epic 5 (Parent #5)
        {
            "parent": 5,
            "title": "[BE] Incident Ticket Schema, 24h SLA Countdown & Escalation Worker",
            "role": "backend",
            "body": """## Parent Epic
Part of #5

## What to build
Skema entitas `IncidentTicket` (kategori: SPOILAGE, FOREIGN_OBJECT, DELAY, SHORTAGE) beserta background job yang memantau batas waktu penyelesaian SLA 1x24 jam dan memicu status eskalasi BGN.

## Acceptance Criteria
- [ ] Tiket yang dibuka otomatis menghitung `sla_deadline` = created_at + 24 jam.
- [ ] Status berubah menjadi `SLA_WARNING` saat sisa waktu <4 jam dan `SLA_BREACHED` saat melebihi batas waktu.
"""
        },
        {
            "parent": 5,
            "title": "[FE] SPPG Incident Management Inbox with Live SLA Countdown",
            "role": "frontend",
            "body": """## Parent Epic
Part of #5

## What to build
Halaman antrean tiket komplain di dashboard SPPG yang menampilkan daftar keluhan masuk dengan timer hitung mundur real-time dan modal form investigasi dapur.

## Acceptance Criteria
- [ ] Kartu tiket menampilkan badge warna dinamis sesuai sisa waktu SLA (Hijau >8h, Kuning 4-8h, Merah <4h / Breached).
- [ ] Form input aksi korektif dan unggah foto bukti investigasi dapur sebelum tiket ditutup.
"""
        },
        {
            "parent": 5,
            "title": "[QA] Timezone SLA Calculations & Ticket State Transition Tests",
            "role": "qa",
            "body": """## Parent Epic
Part of #5

## What to build
Pengujian perhitungan SLA lintas zona waktu di Indonesia (WIB, WITA, WIT) dan validasi seluruh transisi status tiket.

## Acceptance Criteria
- [ ] Perhitungan SLA konsisten dalam format UTC / ISO string tanpa bias zona waktu lokal server.
"""
        },

        # Epic 6 (Parent #6)
        {
            "parent": 6,
            "title": "[DS] Plate Waste Score Index & Menu Waste Regression Model",
            "role": "data-science",
            "body": """## Parent Epic
Part of #6

## What to build
Formulasi dan implementasi algoritma pembobotan Plate Waste Score per menu hidangan untuk mengidentifikasi bahan/resep yang memiliki tingkat penolakan tertinggi oleh siswa.

## Acceptance Criteria
- [ ] Menghitung skor sisa makanan kuantitatif harian per komponen menu (Lauk utama, Sayur, Nasi, Buah).
- [ ] Menyediakan data rekomendasi perbaikan porsi atau modifikasi resep bagi ahli gizi SPPG.
"""
        },
        {
            "parent": 6,
            "title": "[DS] NLP Student Feedback Keyword & Sentiment Clustering",
            "role": "data-science",
            "body": """## Parent Epic
Part of #6

## What to build
Modul pemrosesan teks alami (NLP) untuk mengekstrak dan mengelompokkan pola keluhan rasa siswa (misal: klasterisasi masalah rasa asin/hambar/pedas per kelompok usia SD vs SMA).

## Acceptance Criteria
- [ ] Menghasilkan ringkasan topik keluhan rasa utama harian per SPPG secara otomatis.
"""
        },
        {
            "parent": 6,
            "title": "[DS/BE] SPPG Composite Health & Risk Radar Scoring Algorithm",
            "role": "data-science",
            "body": """## Parent Epic
Part of #6

## What to build
Algoritma komposit penentuan status risiko SPPG (Hijau, Kuning, Merah) berdasarkan matriks kepatuhan SLA, rasio komplain, tingkat plate waste, dan deviasi waktu pengiriman.

## Acceptance Criteria
- [ ] Formula kalkulasi menghasilkan skor indeks risiko terstandardisasi (0 - 100) per SPPG secara harian.
"""
        },
        {
            "parent": 6,
            "title": "[FE] Interactive Plate Waste Charts & Satisfaction Heatmaps",
            "role": "frontend",
            "body": """## Parent Epic
Part of #6

## What to build
Komponen grafik visualisasi data analitik di dashboard SPPG: Bar chart menu favorit vs paling banyak bersisa, dan heatmap tren kepuasan rasa mingguan.

## Acceptance Criteria
- [ ] Grafik interaktif responsif dengan tooltip detail metrik gizi dan plate waste.
"""
        },

        # Epic 7 (Parent #7)
        {
            "parent": 7,
            "title": "[FE] Interactive National Map with SPPG Risk Pins & Filters",
            "role": "frontend",
            "body": """## Parent Epic
Part of #7

## What to build
Peta Indonesia interaktif di Dashboard BGN yang menampilkan sebaran seluruh unit SPPG dengan pin berkode warna status risiko (Hijau, Kuning, Merah) dan filter wilayah (Provinsi / Kabupaten).

## Acceptance Criteria
- [ ] Peta memuat ribuan pin SPPG secara lancar (smooth clustering / mapbox / leaflet).
- [ ] Klik pada pin menampilkan popover ringkasan performa SPPG, skor kepuasan, dan tiket aktif.
"""
        },
        {
            "parent": 7,
            "title": "[FE] BGN National Macro KPI Cards & Nutrition AKG Aggregator",
            "role": "frontend",
            "body": """## Parent Epic
Part of #7

## What to build
Komponen kartu KPI eksekutif BGN: Total Porsi Tersalurkan Nasional, Persentase BAP Tepat Waktu, Skor Kepuasan Nasional, dan Rata-rata Ketercapaian AKG Gizi.

## Acceptance Criteria
- [ ] Kartu KPI menampilkan perbandingan tren (MoM / WoW) dan indikator status program nasional.
"""
        },
        {
            "parent": 7,
            "title": "[BE] Streaming Excel (.xlsx) & PDF Official Audit Exporter",
            "role": "backend",
            "body": """## Parent Epic
Part of #7

## What to build
Service generator laporan audit resmi dalam format Excel (.xlsx) dan PDF berbasis streaming untuk kebutuhan pelaporan ke BPK/Inspektorat tanpa beban memori tinggi.

## Acceptance Criteria
- [ ] Ekspor data jutaan baris distribusi selesai tanpa memory leak / crash pada server.
- [ ] Laporan PDF terformat rapi dengan kop resmi BGN, ringkasan eksekutif, dan tabel audit.
"""
        },
        {
            "parent": 7,
            "title": "[QA] Audit Export Data Reconciliation vs Raw Ledger Database Tests",
            "role": "qa",
            "body": """## Parent Epic
Part of #7

## What to build
Verifikasi konsistensi dan integritas data antara laporan hasil ekspor (Excel/PDF) dengan data transaksi asli di database PostgreSQL.

## Acceptance Criteria
- [ ] Seluruh total angka porsi, nilai gizi, dan status tiket pada laporan ekspor 100% cocok dengan query agregasi database.
"""
        }
    ]

    print(f"Total sub-issues to create: {len(sub_issues)} in repo {repo}")
    api_url = f"https://api.github.com/repos/{repo}/issues"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "MBG-Sub-Issue-Publisher"
    }

    created_count = 0
    for item in sub_issues:
        parent_id = item["parent"]
        title = item["title"]
        role = item["role"]
        body = item["body"]

        payload = {
            "title": title,
            "body": body,
            "labels": [f"epic-{parent_id}", role, "sub-task"]
        }

        req = urllib.request.Request(
            api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )

        try:
            with urllib.request.urlopen(req) as response:
                res = json.loads(response.read().decode("utf-8"))
                num = res.get("number")
                url = res.get("html_url")
                print(f"Created Sub-Issue #{num} (Parent #{parent_id}): {title} -> {url}")
                created_count += 1
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8")
            print(f"Failed to create {title}: HTTP {e.code} - {err_msg}")

    print(f"Finished! Created {created_count}/{len(sub_issues)} sub-issues successfully.")

if __name__ == "__main__":
    main()
