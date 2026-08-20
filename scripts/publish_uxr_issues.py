#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import urllib.request
import urllib.error

def main():
    repo = os.environ.get("GITHUB_REPO") or (sys.argv[1] if len(sys.argv) > 1 else "dikamardavid/LaporMBG")
    token = os.environ.get("GITHUB_TOKEN") or (sys.argv[2] if len(sys.argv) > 2 else "None")
    project_id = "5e08cd57-04d9-4931-9de1-42f34a5577af"

    uxr_issues = [
        {
            "parent_num": 1,
            "parent_key": "GORE-1",
            "title": "[UXR] Baseline Contextual Inquiry: School PIC Habits & 3T Connectivity Constraints",
            "body": """## Parent Epic
Part of #1

## Role
🔍 **UX Research (UXR)**

## Objective & Research Questions
Melakukan riset kontekstual lapangan (*contextual inquiry*) terhadap calon PIC Sekolah (guru piket/tenaga pendidik) untuk memahami:
- Bagaimana alur kerja dan beban kerja guru di pagi hari saat jam serah terima makanan (07:00–08:30 WIB)?
- Kendala teknis perangkat (spesifikasi ponsel low-end, pembagian gawai piket, dan area *blank spot* sekolah di wilayah 3T vs perkotaan).
- Preferensi autentikasi guru: seberapa efektif metode *Passwordless WhatsApp OTP / Magic Link* dibandingkan kata sandi biasa?

## Methodology
- 10-15 sesi wawancara mendalam (*In-depth Interviews*) & observasi langsung di 5 sekolah uji coba (SD, SMP, SMA).
- *Tech & Connectivity Shadowing*: pemetaan kualitas sinyal seluler di titik serah terima sekolah.

## Deliverables & Acceptance Criteria
- [ ] Dokumen **User Persona & Journey Map PIC Sekolah** dalam alur serah terima makanan.
- [ ] Laporan **Pain Points & Connectivity Matrix** di area serah terima sekolah.
- [ ] Rekomendasi UX untuk sistem autentikasi passwordless dan alur pergantian guru piket.
"""
        },
        {
            "parent_num": 2,
            "parent_key": "GORE-2",
            "title": "[UXR] Kitchen Staff Ergonomics & QR Sticker Field Scannability Study",
            "body": """## Parent Epic
Part of #2

## Role
🔍 **UX Research (UXR)**

## Objective & Research Questions
Mengevaluasi ergonomi pencatatan manifest dapur SPPG dan keterbacaan stiker QR Code fisik di lingkungan dapur:
- Bagaimana juru masak dan staf packing SPPG berinteraksi dengan tablet/layar di lingkungan dapur bersuhu tinggi dan tangan berminyak/basah?
- Seberapa cepat dan akurat kamera ponsel guru/siswa dapat memindai stiker QR Code pada kotak makanan dengan berbagai kondisi pencahayaan kelas dan kelembapan wadah?

## Methodology
- *Usability Testing* & *Ergonomic Assessment* pada staf SPPG saat jam produksi sibuk (03:00–06:00 pagi).
- *Physical QR Scannability Benchmark*: uji coba scan dengan 10 jenis kamera ponsel berbeda pada jarak 15cm–50cm dan sudut kemiringan hingga 45°.

## Deliverables & Acceptance Criteria
- [ ] Laporan evaluasi form input manifest SPPG (waktu input, *error rate* pencatatan suhu).
- [ ] Rekomendasi spesifikasi ukuran fisik stiker QR Code, margin kontras, dan material kertas tahan uap panas/minyak.
"""
        },
        {
            "parent_num": 3,
            "parent_key": "GORE-3",
            "title": "[UXR] Field Usability Testing: School PIC Offline BAP Handover under Morning Rush",
            "body": """## Parent Epic
Part of #3

## Role
🔍 **UX Research (UXR)**

## Objective & Research Questions
Menguji kemudahan penggunaan alur pencatatan Berita Acara Penerimaan (BAP) PWA dalam kondisi stres waktu pagi hari:
- Apakah guru dapat menyelesaikan seluruh proses verifikasi porsi, input suhu, dan foto baki dalam waktu < 45 detik?
- Bagaimana reaksi dan pemahaman guru ketika aplikasi berada dalam mode *offline* dan transisi saat kembali *online*?
- Apakah panduan bingkai kamera (*camera overlay*) efektif membantu guru mengambil foto baki makanan yang fokus dan representatif?

## Methodology
- *Moderated Usability Testing* dengan 8 PIC Sekolah menggunakan skenario simulasi pengantaran makanan dengan batas waktu ketat.
- Pengujian simulasi jaringan terputus (Airplane mode) dan observasi respon guru terhadap indikator status sync.

## Deliverables & Acceptance Criteria
- [ ] Metrik *Time-on-Task (ToT)* dan *Single Ease Question (SEQ)* pencatatan BAP sekolah.
- [ ] Daftar temuan hambatan kognitif guru saat pengambilan foto dan input angka porsi.
- [ ] Rekomendasi perbaikan mikro-copy indikator sinkronisasi offline-to-online.
"""
        },
        {
            "parent_num": 4,
            "parent_key": "GORE-4",
            "title": "[UXR] Kid-Centric Evaluative Study: Student Rating Comprehension & Plate Waste Fractions",
            "body": """## Parent Epic
Part of #4

## Role
🔍 **UX Research (UXR)**

## Objective & Research Questions
Mengevaluasi daya pemahaman kognitif siswa (lintas jenjang kelas 1 SD s/d SMA) terhadap form ulasan makanan visual:
- Apakah anak-anak SD kelas rendah memahami makna visual 5 ekspresi emotikon rasa?
- Apakah ilustrasi visual piring sisa makanan (*Plate Waste Selector*: Habis, Sisa Sedikit, Separuh, Banyak) dapat diestimasi dengan akurat oleh siswa sesuai sisa makanan aslinya?
- Seberapa cepat siswa dapat menyelesaikan form saat jam istirahat tanpa mengganggu waktu makan (<30 detik)?

## Methodology
- *Kid-Centric Usability Testing* & *Cognitive Walkthrough* dengan 20 siswa (kelompok SD, SMP, SMA).
- *A/B Testing Visual vs Text*: membandingkan akurasi pemilihan plate waste menggunakan gambar piring vs opsi teks persentase.

## Deliverables & Acceptance Criteria
- [ ] Laporan validasi pemahaman visual emotikon rasa dan ilustrasi piring plate waste per kelompok usia.
- [ ] Rekomendasi tata letak tombol sentuh dan mikro-copy ramah anak untuk mencegah kebingungan pengisian.
"""
        },
        {
            "parent_num": 5,
            "parent_key": "GORE-5",
            "title": "[UXR] Dispute & Incident Workflow Study: SPPG Complaint Resolution Experience",
            "body": """## Parent Epic
Part of #5

## Role
🔍 **UX Research (UXR)**

## Objective & Research Questions
Memetakan dinamika penanganan komplain mutu antara PIC Sekolah dan Manajer Dapur SPPG:
- Bagaimana ekspektasi transparansi sekolah saat melaporkan makanan yang terindikasi basi atau kurang porsi?
- Bagaimana tim SPPG melakukan investigasi batch masakan dan menentukan aksi korektif dalam batas SLA 24 jam?
- Apakah *Live SLA Countdown Timer* membantu meningkatkan kepatuhan respon atau justru menimbulkan stres berlebih?

## Methodology
- *Service Blueprinting Workshop* & Wawancara mendalam dengan manajer katering/dapur umum dan kepala sekolah.
- Simulasi skenario sengketa mutu makanan (*mock dispute resolution*).

## Deliverables & Acceptance Criteria
- [ ] **Service Blueprint Alur Penanganan Insiden Mutu** dari pelaporan hingga investigasi tuntas.
- [ ] Rekomendasi formulir investigasi dapur yang seimbang antara kecepatan input dan kelengkapan bukti.
"""
        },
        {
            "parent_num": 6,
            "parent_key": "GORE-6",
            "title": "[UXR] Nutritionist & Menu Planner Data Discovery: Plate Waste Actionability",
            "body": """## Parent Epic
Part of #6

## Role
🔍 **UX Research (UXR)**

## Objective & Research Questions
Meneliti bagaimana Ahli Gizi SPPG dan BGN memanfaatkan analitik data ulasan rasa dan sisa makanan (*Plate Waste Score*):
- Bagaimana ahli gizi menerjemahkan data sisa makanan sayur/lauk menjadi keputusan modifikasi resep pada siklus menu berikutnya?
- Apakah klasterisasi sentimen kata kunci ulasan siswa (misal: "terlalu asin", "sayur lembek") cukup informatif untuk perbaikan juru masak?

## Methodology
- *Co-Design Sessions* & *Expert Interviews* dengan 6 Ahli Gizi / Menu Planner profesional.
- *Card Sorting & Data Visualization Preference Testing* untuk tampilan grafik AKG dan waste score.

## Deliverables & Acceptance Criteria
- [ ] Panduan kebutuhan analitik data ahli gizi (*Nutritionist Decision-Making Needs*).
- [ ] Rekomendasi format visualisasi metrik gizi dan rekomendasi aksi perbaikan menu otomatis.
"""
        },
        {
            "parent_num": 7,
            "parent_key": "GORE-7",
            "title": "[UXR] Executive & Auditor Decision Support Study: BGN Macro Command Center",
            "body": """## Parent Epic
Part of #7

## Role
🔍 **UX Research (UXR)**

## Objective & Research Questions
Mengevaluasi efektivitas Dashboard Command Center nasional dan laporan audit PDF bagi pembuat kebijakan di BGN dan tim auditor:
- Informasi makro apa yang paling krusial dilihat pimpinan BGN dalam 5 detik pertama membuka dashboard (*Executive Glanceability*)?
- Apakah klasifikasi warna radar risiko SPPG (Hijau, Kuning, Merah) memudahkan intervensi pengawasan wilayah secara objektif?
- Apakah struktur laporan ekspor PDF/Excel telah memenuhi standar format dokumen pemeriksaan BPK / Inspektorat?

## Methodology
- *Executive Usability Walkthrough* dengan stakeholder pengambil kebijakan dan auditor pemerintahan.
- *Document Compliance Audit Study*: evaluasi tata letak laporan PDF terhadap checklist audit formal.

## Deliverables & Acceptance Criteria
- [ ] Laporan evaluasi keterbacaan visual Command Center nasional pada layar besar (*Big Screen Glanceability*).
- [ ] Checklist kepatuhan standar format laporan audit kenegaraan.
"""
        }
    ]

    print(f"Publishing {len(uxr_issues)} UX Researcher sub-issues to GitHub ({repo}) and Multica...")
    api_url = f"https://api.github.com/repos/{repo}/issues"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "MBG-UXR-Issue-Publisher"
    }

    created_github = []
    for item in uxr_issues:
        parent_num = item["parent_num"]
        parent_key = item["parent_key"]
        title = item["title"]
        body = item["body"]

        payload = {
            "title": title,
            "body": body,
            "labels": [f"epic-{parent_num}", "uxr", "ux-research", "sub-task"]
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
                print(f"Created GitHub UXR Issue #{num} (Parent #{parent_num}): {title} -> {url}")
                created_github.append((num, title, url))
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8")
            print(f"Failed to create GitHub issue for {title}: HTTP {e.code} - {err_msg}")

        # Also create in Multica under parent_key
        cmd = [
            "multica", "issue", "create",
            "--project", project_id,
            "--parent", parent_key,
            "--title", title,
            "--description", f"UX Research task for Epic {parent_num}: {title}",
            "--output", "json"
        ]
        res_m = subprocess.run(cmd, capture_output=True, text=True)
        if res_m.returncode == 0:
            data_m = json.loads(res_m.stdout)
            issue_id_m = data_m.get("id") or data_m.get("key")
            print(f"Created Multica UXR Issue {issue_id_m} (Parent {parent_key})")
        else:
            print(f"Failed to create Multica issue for {title}: {res_m.stderr}")

    print(f"Finished! Created {len(created_github)}/{len(uxr_issues)} UXR sub-issues in GitHub and Multica.")

if __name__ == "__main__":
    main()
