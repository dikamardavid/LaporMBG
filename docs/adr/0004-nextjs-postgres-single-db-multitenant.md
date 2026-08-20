# 0004-nextjs-postgres-single-db-multitenant

## Status
accepted

## Context & Decision
Sistem membutuhkan integrasi cepat antara form siswa mobile yang ringan, portal offline PWA sekolah, serta dashboard analitik multi-tier (SPPG dan BGN).

Kami memutuskan menggunakan:
- **Stack**: TypeScript Fullstack dengan Next.js App Router, Tailwind CSS, Shadcn UI, PostgreSQL (Prisma/Drizzle ORM), dan Redis (rate-limiting & caching analitik).
- **Multi-Tenancy Model**: Single PostgreSQL Database dengan Tenant & Role-Based Access Control (RBAC). Data SPPG dan Sekolah diisolasi secara logis melalui foreign keys dan middleware authorization, memungkinkan kueri agregasi makro nasional BGN dieksekusi secara efisien tanpa *cross-database join*.

## Consequences
- Satu codebase terpadu untuk form publik, PWA PIC Sekolah, dan Dashboard Admin/Auditor.
- Efisiensi biaya infrastruktur awal dan pemeliharaan skema database tunggal.
