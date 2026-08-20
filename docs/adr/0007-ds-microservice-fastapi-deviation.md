# 0007-ds-microservice-fastapi-deviation

## Status
accepted

## Context & Decision
Epic 6 (Intelligence, Analytics & Plate Waste/AKG Science Engine) membutuhkan
pekerjaan Data Science: formulasi skor tertimbang, NLP sentiment mining, dan
model regresi/statistik untuk risk scoring. Ekosistem Python (scikit-learn,
pandas, NLP libraries) jauh lebih matang untuk beban kerja ini dibanding
ekosistem TypeScript, sehingga memaksakan seluruh Epic 6 ke dalam stack
Next.js tunggal (ADR-0004) akan menghasilkan implementasi yang lebih lemah
atau bergantung pada binding native yang rapuh.

Kami memutuskan, **khusus untuk beban kerja Data Science (Epic 6 dan
turunannya)**:
- Layanan DS dijalankan sebagai microservice **FastAPI (Python)** terpisah,
  masing-masing dalam container Docker sendiri (mis. `services/ds-plate-waste/`
  untuk issue #27), bukan bagian dari codebase Next.js.
- Layanan bersifat **stateless dan tanpa akses database langsung** — Next.js
  backend (yang tetap menjadi pemilik tunggal skema Postgres per ADR-0004)
  memanggil layanan DS via REST dengan payload JSON (push-based), dan layanan
  DS mengembalikan hasil komputasi tanpa menyimpan state atau melakukan query
  lintas-tenant sendiri.
- Otorisasi/RBAC dan tenant scoping (`sppg_id`/`school_id`) tetap sepenuhnya
  menjadi tanggung jawab Next.js backend; layanan DS memperlakukan
  identifier tersebut sebagai data passthrough opak untuk audit/logging saja.
- Kontrak antar-layanan didokumentasikan melalui OpenAPI (`/docs`,
  `/openapi.json`) yang di-generate otomatis oleh FastAPI, menjadi acuan
  tunggal untuk integrasi dari sisi Next.js.

Ini adalah **deviasi eksplisit** dari ADR-0004, dibatasi ruang lingkupnya
hanya untuk beban kerja Data Science — bagian lain platform (form siswa,
PWA sekolah, dashboard admin) tetap satu codebase Next.js/Postgres/Prisma
sesuai ADR-0004.

## Consequences
- Layanan DS dapat memakai library Python best-in-class (scikit-learn,
  pandas, NLP) tanpa kompromi, dan dapat diuji/di-deploy secara independen
  dari siklus rilis Next.js.
- Menambah kompleksitas operasional: dua runtime (Node.js + Python), dua
  jalur deployment, dan kebutuhan kontrak API eksplisit antar layanan yang
  harus dijaga backward-compatible.
- Karena layanan DS tidak memiliki akses database, setiap fitur baru di
  Epic 6 memerlukan Next.js backend untuk mengambil data dari Postgres dan
  mengirimkannya via payload — layanan DS tidak bisa melakukan query historis
  secara mandiri (lihat trade-off model regresi in-request pada
  `services/ds-plate-waste/README.md`).
- Skema `docker-compose.yml` root mulai memuat layanan non-Next.js pertama;
  layanan Next.js + Postgres perlu ditambahkan ke compose yang sama saat
  `app/` dan `prisma/schema.prisma` dibuat.
