# 0002-ticket-based-incident-workflow

## Status
accepted

## Context & Decision
Ketika terjadi ketidaksesuaian mutu pangan atau keluhan di sekolah (seperti rasa asam, makanan basi parsial, atau porsi kurang), sistem harus menentukan bagaimana laporan tersebut ditindaklanjuti.

Kami memutuskan menggunakan alur **Tiket Komplain Terkelola (Managed Incident Ticketing)**:
- Laporan dari PIC Sekolah atau anomali feedback siswa dikonversi menjadi tiket investigasi di dashboard SPPG terkait.
- SPPG memiliki Service Level Agreement (SLA) maksimal 1x24 jam untuk memberikan klarifikasi, investigasi batch masak, dan tindakan korektif.
- Dashboard BGN memantau SLA kepatuhan tiket dan rekap insiden tanpa melakukan pemblokiran batch otomatis di tingkat sistem.

## Consequences
- Mencegah *false alarm* atau kepanikan massal di klaster sekolah lain yang disebabkan oleh laporan sepihak yang belum diverifikasi.
- Tanggung jawab investigasi langsung berada di bawah SPPG pengampu dengan pengawasan berkala melalui metrik dashboard BGN.
