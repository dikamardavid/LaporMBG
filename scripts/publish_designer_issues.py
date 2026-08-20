#!/usr/bin/env python3
import os
import sys
import json
import urllib.request
import urllib.error

def main():
    repo = os.environ.get("GITHUB_REPO") or (sys.argv[1] if len(sys.argv) > 1 else "dikamardavid/LaporMBG")
    token = os.environ.get("GITHUB_TOKEN") or (sys.argv[2] if len(sys.argv) > 2 else "None")

    designer_issues = [
        {
            "parent": 1,
            "title": "[Design] MBG Design System: Tokens, Typography & Component Kit",
            "body": """## Parent Epic
Part of #1

## Role
🎨 **UI/UX & Product Design**

## What to build
Merancang Design System komprehensif untuk platform LaporMBG di Figma/Tokens:
- Palet warna semantik (Brand Green, BGN Navy/Gold, Quality Control Alert Red/Amber, Food category accents).
- Tipografi ramah anak untuk form siswa & tipografi profesional kontras tinggi untuk dashboard analitik.
- Component library: tombol sentuh ekstra besar (min 48px), kartu status, badge SLA dinamis, modal dialog.

## Acceptance Criteria
- [ ] Figma component kit siap pakai dengan Auto-Layout & Design Tokens (DTCG format).
- [ ] Kontras warna memenuhi standar aksesibilitas WCAG 2.2 AA.
- [ ] Asset icon & illustration kit untuk berbagai jenjang usia siswa (SD hingga SMA).
"""
        },
        {
            "parent": 2,
            "title": "[Design] Kitchen Manifest UX & Thermal/A4 Printable QR Sticker Layout",
            "body": """## Parent Epic
Part of #2

## Role
🎨 **UI/UX & Product Design**

## What to build
Merancang alur UX form input manifest dapur SPPG serta spesifikasi layout stiker QR Code fisik:
- Form ergonomis ramah tablet untuk koki/staf dapur di lingkungan dapur panas.
- Layout stiker QR Code siap cetak format printer Thermal (58mm/80mm) dan kertas stiker A4 (tahan basah/minyak, mudah di-scan kamera ponsel).
- Template Surat Jalan Serah Terima Makanan resmi siap print.

## Acceptance Criteria
- [ ] Desain stiker QR Code memiliki margin aman, kontras tinggi, dan informasi batch/sekolah terbaca jelas.
- [ ] User flow pencatatan suhu & waktu masak memiliki feedback visual titik kontrol mutu.
"""
        },
        {
            "parent": 3,
            "title": "[Design] School PIC Offline PWA Experience & Photo Receipt UI",
            "body": """## Parent Epic
Part of #3

## Role
🎨 **UI/UX & Product Design**

## What to build
Merancang antarmuka PWA mobile bagi PIC Sekolah untuk serah terima makanan cepat di pagi hari:
- Antarmuka satu tangan (*one-handed mobile UI*) untuk pencatatan suhu, jam tiba, dan kuota porsi.
- Indikator status jaringan offline/online yang jelas dan tidak membingungkan guru.
- Panduan bingkai foto (*camera overlay guide*) untuk memandu pengambilan foto sampel baki makanan yang baik.

## Acceptance Criteria
- [ ] Flow serah terima BAP dapat diselesaikan dalam waktu < 45 detik.
- [ ] UI state transisi offline ➔ sync progress ➔ synced terdesain intuitif.
"""
        },
        {
            "parent": 4,
            "title": "[Design] Child-Friendly 4-Step Interactive Visual Feedback UI & Micro-Animations",
            "body": """## Parent Epic
Part of #4

## Role
🎨 **UI/UX & Product Design**

## What to build
Merancang antarmuka publik ulasan siswa yang super ekspresif, intuitif, dan ramah anak:
- **Step 1**: 5 emotikon rasa ekspresif (Sangat Suka, Enak, Biasa, Kurang Enak, Tidak Enak).
- **Step 2**: Visual Plate Waste Selector piring interaktif (Habis Bersih, Sisa Sedikit, Sisa Separuh, Hampir Utuh).
- **Step 3**: Tag rasa visual bergambar (Porsi Pas, Sayur Enak, Kurang Gurih, Dingin, dll).
- **Step 4**: Layar selebrasi dengan mikro-animasi confetti & pesan apresiasi.

## Acceptance Criteria
- [ ] Seluruh form dapat dioperasikan tanpa mengetik teks sama sekali.
- [ ] Desain responsif optimal untuk layar HP kecil hingga tablet kelas.
"""
        },
        {
            "parent": 5,
            "title": "[Design] SPPG Incident Management Queue & Live SLA Countdown Timer UI",
            "body": """## Parent Epic
Part of #5

## Role
🎨 **UI/UX & Product Design**

## What to build
Merancang antarmuka antrean tiket investigasi komplain untuk manajemen dapur SPPG:
- Kartu tiket komplain dengan hierarki visual urgensi (Badge Hijau >8h, Kuning 4-8h, Merah Berkedip <4h/Breached).
- Modal alur investigasi dapur & form unggah bukti perbaikan rasa/porsi.
- Tab filter status tiket (Baru, Sedang Investigasi, Selesai, Dieskalasi ke BGN).

## Acceptance Criteria
- [ ] Visual timer countdown SLA menonjol dan langsung menarik perhatian staf dapur.
- [ ] Tampilan komparasi foto laporan sekolah vs foto sampel masak SPPG berdampingan (*side-by-side comparison*).
"""
        },
        {
            "parent": 6,
            "title": "[Design] Plate Waste & AKG Nutrition Analytics Visualizations",
            "body": """## Parent Epic
Part of #6

## Role
🎨 **UI/UX & Product Design**

## What to build
Merancang dashboard visualisasi data kecerdasan gizi dan analisis sisa makanan untuk SPPG & BGN:
- Gauge chart pencapaian Angka Kecukupan Gizi (AKG) makronutrisi harian.
- Bar chart interaktif perbandingan menu favorit vs menu dengan persentase sisa tertinggi.
- Word-cloud / sentiment cluster visual untuk rangkuman ulasan rasa siswa.

## Acceptance Criteria
- [ ] Visualisasi data mudah dipahami oleh ahli gizi dapur maupun pimpinan tanpa latar belakang teknis data.
- [ ] Desain dashboard mendukung Dark Mode dan Light Mode.
"""
        },
        {
            "parent": 7,
            "title": "[Design] BGN National Command Center Map & Executive Audit Dashboard UI",
            "body": """## Parent Epic
Part of #7

## Role
🎨 **UI/UX & Product Design**

## What to build
Merancang antarmuka Command Center eksekutif nasional Badan Gizi Nasional (BGN):
- Peta sebaran SPPG seluruh Indonesia dengan custom marker status radar risiko (Hijau, Kuning, Merah).
- Kartu metrik makro nasional (Total Porsi Nasional, % BAP Tuntas, Rata-rata Skor Rasa Nasional).
- Template layout ekspor berkas laporan audit PDF resmi berstandar kenegaraan (kop resmi BGN, tipografi formal, tabel rekapitulasi presisi).

## Acceptance Criteria
- [ ] Desain Command Center elegan, modern, dan siap dipresentasikan pada layar monitor besar (*wall display*).
- [ ] Template laporan PDF siap cetak dengan layout halaman rapi berukuran A4 Portrait/Landscape.
"""
        }
    ]

    print(f"Publishing {len(designer_issues)} UI/UX Designer sub-issues to {repo}...")
    api_url = f"https://api.github.com/repos/{repo}/issues"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "MBG-Designer-Issue-Publisher"
    }

    created_count = 0
    for item in designer_issues:
        parent_id = item["parent"]
        title = item["title"]
        body = item["body"]

        payload = {
            "title": title,
            "body": body,
            "labels": [f"epic-{parent_id}", "design", "ui-ux", "sub-task"]
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
                print(f"Created Designer Sub-Issue #{num} (Parent #{parent_id}): {title} -> {url}")
                created_count += 1
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8")
            print(f"Failed to create {title}: HTTP {e.code} - {err_msg}")

    print(f"Finished! Created {created_count}/{len(designer_issues)} Designer sub-issues successfully.")

if __name__ == "__main__":
    main()
