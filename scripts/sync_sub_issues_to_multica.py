#!/usr/bin/env python3
import os
import subprocess
import json

def main():
    project_id = "5e08cd57-04d9-4931-9de1-42f34a5577af"

    sub_issues = [
        # Epic 1 (GORE-1)
        {"parent": "GORE-1", "title": "[BE] Database Schema Design with Prisma ORM & Multi-Tenant Scoping", "desc": "Merancang skema database PostgreSQL menggunakan Prisma ORM untuk mengisolasi data antar tenant (BGN, SPPG, Sekolah)."},
        {"parent": "GORE-1", "title": "[BE] RBAC Middleware & Passwordless OTP/Magic Link Auth Service", "desc": "Membangun service autentikasi dan middleware otorisasi berbasis peran serta layanan login Passwordless OTP/Magic Link untuk PIC Sekolah."},
        {"parent": "GORE-1", "title": "[FE] Next.js 14 App Shell, Theme & Unified Auth Portal", "desc": "Menyiapkan struktur Next.js App Router, tema Tailwind CSS, komponen dasar Shadcn UI, serta antarmuka login terpadu."},
        {"parent": "GORE-1", "title": "[QA] Multi-Tenant Isolation & Session Token Expiration Test Suite", "desc": "Membuat automated test suite untuk menguji keamanan isolasi data antar tenant (Cross-Tenant Data Leak Test)."},
        {"parent": "GORE-1", "title": "[Design] MBG Design System: Tokens, Typography & Component Kit", "desc": "Merancang Design System komprehensif untuk platform LaporMBG (Tokens, Colors, Typography, Components)."},

        # Epic 2 (GORE-2)
        {"parent": "GORE-2", "title": "[BE] Distribution Manifest & Macronutrient AKG Estimation API", "desc": "Endpoint REST / Server Action untuk pencatatan Manifest Distribusi harian SPPG & gizi AKG."},
        {"parent": "GORE-2", "title": "[BE] Cryptographic HMAC-SHA256 Dynamic QR Token Generator", "desc": "Layanan pembuatan token QR dinamis bertanda tangan kriptografis (HMAC-SHA256)."},
        {"parent": "GORE-2", "title": "[FE] Kitchen Pre-flight Manifest Multi-Step Input Form", "desc": "Antarmuka form input manifest dapur SPPG: upload foto sampel masakan, input waktu/suhu masak."},
        {"parent": "GORE-2", "title": "[FE/Design] Printable Dynamic QR Stickers & Handover Sheets", "desc": "Template cetak stiker QR Code (format thermal & lembar A4) dan Surat Jalan Serah Terima Makanan."},
        {"parent": "GORE-2", "title": "[QA] QR Tampering & Departure Temperature Constraint Tests", "desc": "Uji coba manipulasi signature QR code dan pengujian batas kondisi suhu pengiriman makanan."},
        {"parent": "GORE-2", "title": "[Design] Kitchen Manifest UX & Thermal/A4 Printable QR Sticker Layout", "desc": "Desain layout stiker QR Code high-contrast tahan basah/minyak dan form tablet dapur."},

        # Epic 3 (GORE-3)
        {"parent": "GORE-3", "title": "[FE] School PWA Setup with Service Worker & IndexedDB Queue", "desc": "Konfigurasi PWA lengkap dengan Service Worker caching dan IndexedDB queue untuk offline BAP."},
        {"parent": "GORE-3", "title": "[FE] School BAP Form with Local Image Compression & Auto-Sync", "desc": "Formulir pencatatan BAP PIC Sekolah dengan kompresi foto lokal dan auto-sync saat online."},
        {"parent": "GORE-3", "title": "[BE] Idempotent BAP Ingestion & State Reconciliation API", "desc": "Endpoint penerimaan BAP yang idempotent untuk mencegah duplikasi data."},
        {"parent": "GORE-3", "title": "[QA] Offline-to-Online Network Resilience & Photo Integrity Tests", "desc": "Pengujian skenario ekstrem serah terima makanan dalam kondisi jaringan offline (Airplane Mode)."},
        {"parent": "GORE-3", "title": "[Design] School PIC Offline PWA Experience & Photo Receipt UI", "desc": "Desain mobile UI serah terima satu tangan (<45 detik) dan panduan bingkai kamera sampel."},

        # Epic 4 (GORE-4)
        {"parent": "GORE-4", "title": "[FE] 4-Step Mobile Visual Feedback Flow for Students", "desc": "Antarmuka publik mobile web ulasan siswa (<30 detik): Emotikon rasa, visual plate waste, quick tags, konfirmasi animasi."},
        {"parent": "GORE-4", "title": "[BE] Haversine Geofencing Validator & Quota Rate-Limiter API", "desc": "Endpoint ulasan siswa yang memvalidasi radius koordinat GPS Haversine (<= 500m) dan kuota porsi."},
        {"parent": "GORE-4", "title": "[QA] Geofence Boundary & Lunch Rush Concurrent Load Tests", "desc": "Pengujian batas GPS dan simulasi beban puncak 10.000 ulasan serentak jam makan siang."},
        {"parent": "GORE-4", "title": "[Design] Child-Friendly 4-Step Interactive Visual Feedback UI & Micro-Animations", "desc": "Desain emotikon rasa ekspresif, visual piring plate waste, dan animasi confetti."},

        # Epic 5 (GORE-5)
        {"parent": "GORE-5", "title": "[BE] Incident Ticket Schema, 24h SLA Countdown & Escalation Worker", "desc": "Skema IncidentTicket beserta background worker pemantau SLA 1x24 jam dan eskalasi BGN."},
        {"parent": "GORE-5", "title": "[FE] SPPG Incident Management Inbox with Live SLA Countdown", "desc": "Halaman antrean tiket komplain di dashboard SPPG dengan timer hitung mundur real-time."},
        {"parent": "GORE-5", "title": "[QA] Timezone SLA Calculations & Ticket State Transition Tests", "desc": "Pengujian perhitungan SLA lintas zona waktu (WIB/WITA/WIT) dan transisi tiket."},
        {"parent": "GORE-5", "title": "[Design] SPPG Incident Management Queue & Live SLA Countdown Timer UI", "desc": "Desain visual kartu tiket urgensi (Badge Hijau/Kuning/Merah berkedip) & modal investigasi."},

        # Epic 6 (GORE-6)
        {"parent": "GORE-6", "title": "[DS] Plate Waste Score Index & Menu Waste Regression Model", "desc": "Formulasi dan implementasi algoritma pembobotan Plate Waste Score per menu hidangan."},
        {"parent": "GORE-6", "title": "[DS] NLP Student Feedback Keyword & Sentiment Clustering", "desc": "Modul NLP untuk mengekstrak dan mengelompokkan pola keluhan rasa siswa."},
        {"parent": "GORE-6", "title": "[DS/BE] SPPG Composite Health & Risk Radar Scoring Algorithm", "desc": "Algoritma komposit penentuan status risiko SPPG (Hijau, Kuning, Merah)."},
        {"parent": "GORE-6", "title": "[FE] Interactive Plate Waste Charts & Satisfaction Heatmaps", "desc": "Komponen grafik visualisasi data analitik di dashboard SPPG."},
        {"parent": "GORE-6", "title": "[Design] Plate Waste & AKG Nutrition Analytics Visualizations", "desc": "Desain grafik gauge AKG, barchart plate waste, dan visualisasi sentimen rasa."},

        # Epic 7 (GORE-7)
        {"parent": "GORE-7", "title": "[FE] Interactive National Map with SPPG Risk Pins & Filters", "desc": "Peta Indonesia interaktif di Dashboard BGN yang menampilkan sebaran seluruh SPPG & radar risiko."},
        {"parent": "GORE-7", "title": "[FE] BGN National Macro KPI Cards & Nutrition AKG Aggregator", "desc": "Komponen kartu KPI eksekutif BGN (Total Porsi, % BAP, Skor Rasa, AKG Gizi)."},
        {"parent": "GORE-7", "title": "[BE] Streaming Excel (.xlsx) & PDF Official Audit Exporter", "desc": "Service generator laporan audit resmi dalam format Excel dan PDF berbasis streaming."},
        {"parent": "GORE-7", "title": "[QA] Audit Export Data Reconciliation vs Raw Ledger Database Tests", "desc": "Verifikasi konsistensi data antara laporan ekspor dengan database transaksi asli."},
        {"parent": "GORE-7", "title": "[Design] BGN National Command Center Map & Executive Audit Dashboard UI", "desc": "Desain Command Center wall display, peta risiko, dan template laporan audit resmi A4."}
    ]

    print(f"Creating {len(sub_issues)} sub-issues in Multica under project {project_id}...")

    count = 0
    for sub in sub_issues:
        parent_key = sub["parent"]
        title = sub["title"]
        desc = sub["desc"]

        cmd = [
            "multica", "issue", "create",
            "--project", project_id,
            "--parent", parent_key,
            "--title", title,
            "--description", desc,
            "--output", "json"
        ]

        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            data = json.loads(res.stdout)
            issue_key = data.get("key") or data.get("id")
            print(f"Created Sub-Issue {issue_key} (Parent {parent_key}): {title}")
            count += 1
        else:
            print(f"Failed to create {title}: {res.stderr}")

    print(f"Finished! Created {count}/{len(sub_issues)} sub-issues in Multica.")

if __name__ == "__main__":
    main()
