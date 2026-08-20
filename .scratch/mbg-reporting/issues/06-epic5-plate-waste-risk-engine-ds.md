# 06 — EPIC 5: Intelligence, Analytics & Plate Waste / AKG Science Engine

**What to build:** Engine analitik berbasis Data Science / AI untuk menghitung Plate Waste Score, klasterisasi sentimen rasa/tekstur dari ulasan siswa, serta algoritma penentuan skor risiko operasional SPPG (Hijau, Kuning, Merah) secara kuantitatif.

**Blocked by:** 02 — EPIC 2: SPPG Kitchen Operations & Dynamic Signed QR Generator, 04 — EPIC 3 (Part 2): Geofenced Student Feedback Interactive Flow

**Status:** ready-for-agent

## Tasks per Role:
- **[Data Science]** Formulasi algoritma pembobotan Plate Waste Score per komponen menu makanan.
- **[Data Science]** NLP Keyword & Sentiment Mining untuk ekstraksi keluhan rasa (klasterisasi masalah rasa per kelompok usia).
- **[Data Science]** Algoritma Scoring Radar Risiko SPPG: pembobotan SLA Compliance + Complaint Ratio + Plate Waste Rate + Holding Delay.
- **[Back End]** Scheduled aggregation pipeline untuk menyimpan metrik hasil kalkulasi ke tabel analitik/Redis.
- **[Back End]** REST API endpoint data analitik untuk konsumsi dashboard SPPG & BGN.
- **[Front End]** Visualisasi grafik interaktif (Barchart menu terfavorit vs paling banyak bersisa, Heatmap kepuasan).
- **[QA]** Validasi akurasi formula matematis scoring risiko terhadap dataset uji coba.

## Acceptance Criteria:
- [ ] Tingkat sisa makanan (Plate Waste Score) terkalkulasi otomatis per menu dan komponen hidangan.
- [ ] Algoritma mengklasifikasikan status risiko setiap SPPG (Hijau, Kuning, Merah) berdasarkan metrik objektif.
- [ ] Dashboard SPPG menampilkan rekomendasi perbaikan menu berdasarkan analisis sentimen ulasan siswa.
