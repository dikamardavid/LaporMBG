# 03 — EPIC 3 (Part 1): School PIC Offline-First PWA BAP Receipt

**What to build:** Aplikasi PWA untuk PIC Sekolah yang bekerja secara Offline-First dengan penyimpanan IndexedDB lokal. Memungkinkan pencatatan Berita Acara Penerimaan (BAP) makanan (waktu tiba, suhu makanan, jumlah porsi diterima, dan foto fisik) saat sinyal terputus, dan otomatis tersinkronisasi saat koneksi pulih.

**Blocked by:** 01 — EPIC 1: Foundation, Multi-Tenant RBAC & Master Data Management, 02 — EPIC 2: SPPG Kitchen Operations & Dynamic Signed QR Generator

**Status:** ready-for-agent

## Tasks per Role:
- **[Front End]** Konfigurasi PWA (Service Worker caching, web app manifest, offline status indicator).
- **[Front End]** Form BAP offline berbasis IndexedDB (kompresi foto lokal, penyimpanan transaksi antrean).
- **[Front End]** Event listener online auto-sync background queue ke server.
- **[Back End]** Endpoint sinkronisasi BAP idempotent (mencegah duplikasi data saat sync online).
- **[QA]** Offline resilience test (mode airplane saat submit BAP -> kembali online -> pastikan tersimpan utuh di DB).
- **[QA]** Uji kompresi dan integritas file foto bukti penerimaan makanan.

## Acceptance Criteria:
- [ ] PIC Sekolah dapat mengisi dan menyelesaikan form BAP tanpa koneksi internet sama sekali.
- [ ] Data BAP dan foto tersimpan aman di IndexedDB perangkat lokal saat offline.
- [ ] Saat koneksi internet terhubung kembali, data BAP otomatis tersinkronisasi ke server tanpa intervensi manual.
- [ ] Status batch distribusi terupdate menjadi BAP_VERIFIED.
