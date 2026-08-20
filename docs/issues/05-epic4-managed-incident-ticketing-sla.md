# 05 — EPIC 4: Managed Incident Ticketing & Resolution SLA (1x24 Jam)

**What to build:** Sistem pengelolaan tiket komplain dan ketidaksesuaian mutu pangan terkelola. PIC Sekolah dapat membuka tiket insiden (makanan basi, benda asing, porsi kurang), dan tim SPPG wajib melakukan investigasi serta tindakan korektif dengan pengawasan countdown timer SLA 1x24 jam.

**Blocked by:** 03 — EPIC 3 (Part 1): School PIC Offline-First PWA BAP Receipt

**Status:** ready-for-agent

## Tasks per Role:
- **[Back End]** Skema IncidentTicket (SPOILAGE, FOREIGN_OBJECT, DELAY, PORTION_SHORTAGE) dan relasi ke batch/sppg.
- **[Back End]** Perhitungan sla_deadline (24 jam) dan background job status SLA_WARNING / SLA_BREACHED.
- **[Back End]** Endpoint resolusi tiket (upload bukti investigasi dapur dan catatan tindakan pencegahan).
- **[Front End]** Tombol Laporkan Komplain pada form BAP PIC Sekolah.
- **[Front End]** Antrean Tiket di Dashboard SPPG dengan Live SLA Countdown Timer (badge merah jika <4 jam).
- **[Front End]** Modal investigasi dapur & form penyelesaian komplain.
- **[QA]** Uji perhitungan batas waktu SLA lintas zona waktu (WIB/WITA/WIT) dan eskalasi status tiket.

## Acceptance Criteria:
- [ ] PIC Sekolah dapat melaporkan komplain mutu dengan melampirkan foto bukti.
- [ ] Tiket masuk ke antrean SPPG dengan batas SLA 24 jam terhitung mundur secara real-time.
- [ ] SPPG dapat menginput tindakan korektif untuk menyelesaikan tiket sebelum tenggat waktu SLA.
- [ ] Dashboard BGN dapat memantau tingkat kepatuhan penyelesaian SLA tiket SPPG.
