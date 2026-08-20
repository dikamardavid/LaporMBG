# 02 — EPIC 2: SPPG Kitchen Operations & Dynamic Signed QR Generator

**What to build:** Alur pencatatan Manifest Distribusi harian oleh kepala dapur dan ahli gizi SPPG (komponen menu, takaran makronutrisi AKG, jam masak, suhu berangkat, foto hidangan) serta generator stiker Dynamic Signed QR Code (HMAC-SHA256) dan lembar serah terima siap cetak untuk setiap sekolah penerima.

**Blocked by:** 01 — EPIC 1: Foundation, Multi-Tenant RBAC & Master Data Management

**Status:** ready-for-agent

## Tasks per Role:
- **[Back End]** Endpoint CRUD Manifest Distribusi & Komposisi Gizi (Kalori kcal, Protein, Karbohidrat, Lemak, Serat, Alergen).
- **[Back End]** Generator token QR kriptografis (HMAC-SHA256) dengan payload batchId, schoolId, serviceDate, maxQuota, exp.
- **[Back End]** State transition endpoint (PRE_FLIGHT_LOGGED -> DISPATCHED).
- **[Front End]** Form multi-step input manifest (upload foto sampel, time/temp picker, kalkulator AKG otomatis).
- **[Front End]** Halaman pratinjau cetak stiker QR Code (thermal/A4) dan Surat Jalan Serah Terima.
- **[UI/UX Design]** Desain layout stiker QR Code high-contrast tahan basah/minyak.
- **[QA]** Uji tampering token QR kriptografis dan validasi batas suhu aman keberangkatan (>= 60°C).

## Acceptance Criteria:
- [ ] Manifest harian SPPG menyimpan rincian komponen menu dan estimasi makronutrisi AKG.
- [ ] Staf SPPG dapat men-generate dan mencetak stiker QR Code per sekolah tujuan.
- [ ] Kode QR memuat signed token yang tidak dapat dimanipulasi atau dipalsukan.
- [ ] Status batch bertransisi ke DISPATCHED saat armada diberangkatkan.
