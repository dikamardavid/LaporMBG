# 07 — EPIC 6: BGN National Command Center & Audit Reporting Dashboard

**What to build:** Command Center nasional Badan Gizi Nasional (BGN) yang menampilkan peta radar risiko SPPG seluruh Indonesia, agregasi pemenuhan AKG makronutrisi, ringkasan capaian porsi harian, serta modul ekspor laporan audit resmi (Excel dan PDF) untuk BPK/Inspektorat.

**Blocked by:** 05 — EPIC 4: Managed Incident Ticketing & Resolution SLA (1x24 Jam), 06 — EPIC 5: Intelligence, Analytics & Plate Waste / AKG Science Engine

**Status:** ready-for-agent

## Tasks per Role:
- **[Front End]** Peta Indonesia interaktif dengan penanda titik SPPG berkode warna risiko (Hijau/Kuning/Merah) & filter wilayah.
- **[Front End]** Kartu KPI makro nasional (Total Porsi Hari Ini, % BAP Tuntas, Rata-rata Skor Rasa, Ketercapaian AKG).
- **[Front End]** Modul filter dan generator ekspor laporan kustom.
- **[Back End]** Generator streaming ekspor laporan audit format Excel (.xlsx) dan PDF.
- **[Back End]** Kueri agregasi analitik nasional teroptimasi (materialized views / query indexing).
- **[QA]** Uji rekonsiliasi dan integritas data ekspor terhadap data mentah transaksi di database.
- **[QA]** Verifikasi performa rendering peta interaktif dengan 1.000+ titik SPPG.

## Acceptance Criteria:
- [ ] Pimpinan BGN dapat melihat status distribusi nasional dan sebaran SPPG bermasalah secara real-time pada peta.
- [ ] Auditor BGN dapat mengunduh berkas laporan audit lengkap dalam format Excel dan PDF siap saji.
- [ ] Data rekapitulasi nasional mencerminkan seluruh transaksi hulu (SPPG) dan hilir (Sekolah/Siswa).
