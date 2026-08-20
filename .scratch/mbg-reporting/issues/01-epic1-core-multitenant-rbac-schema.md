# 01 — EPIC 1: Foundation, Multi-Tenant RBAC & Master Data Management

**What to build:** Pondasi sistem multi-tenant terisolasi dalam single PostgreSQL database dengan sistem autentikasi RBAC (BGN, SPPG, PIC Sekolah). Memungkinkan PIC Sekolah login dengan passwordless OTP/Magic Link, pengelola SPPG dan BGN mengelola data organisasi, serta menyediakan seed fixtures realistis untuk pengujian.

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

## Tasks per Role:
- **[Back End]** Skema PostgreSQL Prisma ORM (User, Role, SPPG, School, ClusterMapping, Menu).
- **[Back End]** RBAC Middleware authorization (BGN_ADMIN, BGN_AUDITOR, SPPG_ADMIN, SPPG_CHEF, SCHOOL_PIC).
- **[Back End]** Endpoint autentikasi Passwordless OTP / Magic Link untuk PIC Sekolah.
- **[Front End]** Setup Next.js 14+ App Router, Tailwind CSS, Shadcn UI base theme.
- **[Front End]** Form login terpadu (Email/Password & OTP WhatsApp/Email) dan Auth Route Guard.
- **[QA]** Cross-Tenant Data Leak Test (memastikan isolasi data antar SPPG) dan Expired OTP test.
- **[DevOps]** Setup Docker PostgreSQL, Redis, dan CI GitHub Actions workflow.

## Acceptance Criteria:
- [ ] User dari SPPG A tidak dapat membaca atau memodifikasi data milik SPPG B.
- [ ] PIC Sekolah dapat login dengan OTP/Magic Link tanpa perlu mengingat password.
- [ ] Admin BGN memiliki akses baca agregat seluruh data nasional.
- [ ] Database terisi data seed awal (1 BGN, 2 SPPG klaster, 5 sekolah binaan).
