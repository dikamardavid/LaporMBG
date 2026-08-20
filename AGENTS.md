# AGENTS.md — LaporMBG Engineering Guide for AI Agents

Guidelines, context pointers, and architectural guardrails for autonomous AI coding agents working on the **LaporMBG** platform.

---

## 🧭 Context Pointers (Always Consult First)

Before making any schema changes, designing API contracts, or writing UI components:

1. **Domain Terminology**: Read [`CONTEXT.md`](./CONTEXT.md) for canonical terms (BGN, SPPG, PIC Sekolah, Batch Distribusi, BAP, Plate Waste Score, Dynamic Signed QR). Never use forbidden/avoided terms.
2. **System Specification**: Read [`docs/SPEC.md`](./docs/SPEC.md) for complete user stories, state machines, and testing seams.
3. **Architectural Decisions**: Consult [`docs/adr/`](./docs/adr/):
   - `0001`: Hybrid Reporting Model (QR Unauthenticated vs BAP Authenticated).
   - `0002`: Managed Incident Ticketing Workflow (SLA 1x24h).
   - `0003`: Offline-First PWA (IndexedDB) & Geofenced Signed QR.
   - `0004`: Single Database Multi-Tenant Architecture (Next.js + Postgres + Prisma + Redis).
   - `0005`: Macronutrient AKG Breakdown & 4-Step Visual Feedback Flow.
   - `0006`: Passwordless OTP / Magic Link School Auth.
   - `0007`: Data Science FastAPI Microservice Deviation (Python services under `services/`, stateless/push-based REST, no direct DB access).
4. **Active Tickets & Backlog**: Check [`docs/issues/`](./docs/issues/) and [GitHub Issues](https://github.com/dikamardavid/LaporMBG/issues) for acceptance criteria.

---

## 🏗️ Architectural Guardrails

### 1. Multi-Tenancy & RBAC Scoping
- **Never allow cross-tenant data leaks**: Every query for SPPG or School must filter by `sppg_id` or `school_id` derived from the verified session.
- **Roles**: `BGN_ADMIN`, `BGN_AUDITOR`, `SPPG_ADMIN`, `SPPG_CHEF`, `SCHOOL_PIC`, `STUDENT` (public ephemeral).
- Only `BGN_*` roles can execute unbounded cross-national aggregate queries.

### 2. State Machine Integrity (`DistributionBatch`)
Batch status transitions must follow the strict sequence:
`PRE_FLIGHT_LOGGED` ➔ `DISPATCHED` ➔ `ARRIVED_AT_SCHOOL` ➔ `BAP_VERIFIED` ➔ `FEEDBACK_WINDOW_OPEN` ➔ `BATCH_RECONCILED`.
- Departure temperature must be >= 60°C.
- Maximum holding time (cook to delivery) is 4 hours.

### 3. Student Feedback Flow (<30 Seconds)
- Accessed via **Dynamic Signed QR** (HMAC-SHA256 token encoding `batchId`, `schoolId`, `date`, `maxQuota`, `exp`).
- Must validate client coordinates via **Haversine Geofencing** (radius <= 500m of school).
- Must enforce daily quota rate limit per batch.
- UI must remain visual, child-friendly, touch-optimized, and free of mandatory long-text fields.

### 4. School PIC PWA (Offline-First)
- All BAP records must be written to **IndexedDB** first and queued with a unique transaction UUID.
- Server ingestion must be **idempotent** (re-sending the same UUID must not duplicate records).
- Images must be compressed client-side (<500KB) before saving to IndexedDB.

### 5. Incident Ticketing & SLA
- Tickets (`IncidentTicket`) have an unyielding `sla_deadline` of `created_at + 24 hours`.
- Real-time countdown and automated warning states (`SLA_WARNING` at <4h, `SLA_BREACHED` at >24h).

---

## 🛠️ Development & Tooling Commands

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Prisma ORM workflow
npx prisma generate
npx prisma db push
npm run seed

# Build & Lint
npm run build
npm run lint
```

---

## 🧪 Testing Discipline

When implementing a vertical slice:
1. Test behavior at the highest seam (API boundaries, cryptographic validation, state transitions).
2. Write tests for edge cases: offline-to-online network flip, GPS boundary spoofing, expired QR tokens, and cross-tenant unauthorized access.
