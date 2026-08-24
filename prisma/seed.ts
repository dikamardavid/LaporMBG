import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // BGN Users
  await prisma.user.upsert({
    where: { email: 'admin@bgn.go.id' },
    update: {},
    create: { email: 'admin@bgn.go.id', name: 'Administrator BGN', role: UserRole.BGN_ADMIN },
  })

  await prisma.user.upsert({
    where: { email: 'auditor@bgn.go.id' },
    update: {},
    create: { email: 'auditor@bgn.go.id', name: 'Auditor BGN', role: UserRole.BGN_AUDITOR },
  })

  // SPPG 1 — Jakarta Selatan
  const sppg1 = await prisma.sppg.upsert({
    where: { code: 'SPPG-JAKSEL-001' },
    update: {},
    create: {
      code: 'SPPG-JAKSEL-001',
      name: 'Dapur Sehat Jakarta Selatan 1',
      address: 'Jl. Cilandak KKO No. 12, Jakarta Selatan',
      lat: -6.2902,
      lng: 106.8228,
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@sppg-jaksel-001.id' },
    update: {},
    create: {
      email: 'admin@sppg-jaksel-001.id',
      name: 'Admin Dapur Jaksel 1',
      role: UserRole.SPPG_ADMIN,
      sppgId: sppg1.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'chef@sppg-jaksel-001.id' },
    update: {},
    create: {
      email: 'chef@sppg-jaksel-001.id',
      name: 'Kepala Dapur Jaksel 1',
      role: UserRole.SPPG_CHEF,
      sppgId: sppg1.id,
    },
  })

  // SPPG 2 — Jakarta Timur
  const sppg2 = await prisma.sppg.upsert({
    where: { code: 'SPPG-JAKTIM-001' },
    update: {},
    create: {
      code: 'SPPG-JAKTIM-001',
      name: 'Dapur Sehat Jakarta Timur 1',
      address: 'Jl. Matraman Raya No. 35, Jakarta Timur',
      lat: -6.2099,
      lng: 106.8602,
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@sppg-jaktim-001.id' },
    update: {},
    create: {
      email: 'admin@sppg-jaktim-001.id',
      name: 'Admin Dapur Jaktim 1',
      role: UserRole.SPPG_ADMIN,
      sppgId: sppg2.id,
    },
  })

  // Schools under SPPG 1
  const school1 = await prisma.school.upsert({
    where: { code: 'SDN-JAKSEL-001' },
    update: {},
    create: {
      code: 'SDN-JAKSEL-001',
      name: 'SDN Cilandak 01',
      address: 'Jl. Cilandak Barat No. 5, Jakarta Selatan',
      lat: -6.2905,
      lng: 106.8199,
    },
  })

  const school2 = await prisma.school.upsert({
    where: { code: 'SDN-JAKSEL-002' },
    update: {},
    create: {
      code: 'SDN-JAKSEL-002',
      name: 'SDN Lebak Bulus 03',
      address: 'Jl. Lebak Bulus III No. 1, Jakarta Selatan',
      lat: -6.3091,
      lng: 106.7836,
    },
  })

  const school3 = await prisma.school.upsert({
    where: { code: 'SDN-JAKSEL-003' },
    update: {},
    create: {
      code: 'SDN-JAKSEL-003',
      name: 'SDN Fatmawati 01',
      address: 'Jl. RS Fatmawati No. 33, Jakarta Selatan',
      lat: -6.293,
      lng: 106.7925,
    },
  })

  // Schools under SPPG 2
  const school4 = await prisma.school.upsert({
    where: { code: 'SDN-JAKTIM-001' },
    update: {},
    create: {
      code: 'SDN-JAKTIM-001',
      name: 'SDN Matraman 01',
      address: 'Jl. Matraman Dalam No. 12, Jakarta Timur',
      lat: -6.21,
      lng: 106.862,
    },
  })

  const school5 = await prisma.school.upsert({
    where: { code: 'SDN-JAKTIM-002' },
    update: {},
    create: {
      code: 'SDN-JAKTIM-002',
      name: 'SDN Pisangan Lama 01',
      address: 'Jl. Pisangan Lama I No. 3, Jakarta Timur',
      lat: -6.2005,
      lng: 106.88,
    },
  })

  // Cluster mappings: SPPG 1 → schools 1-3, SPPG 2 → schools 4-5
  for (const [sppgId, schoolId] of [
    [sppg1.id, school1.id],
    [sppg1.id, school2.id],
    [sppg1.id, school3.id],
    [sppg2.id, school4.id],
    [sppg2.id, school5.id],
  ]) {
    await prisma.clusterMapping.upsert({
      where: { sppgId_schoolId: { sppgId, schoolId } },
      update: {},
      create: { sppgId, schoolId },
    })
  }

  // School PICs
  const pics = [
    { email: 'pic@sdn-cilandak01.id', phone: '6281234567001', name: 'Budi Santoso', schoolId: school1.id, sppgId: sppg1.id },
    { email: 'pic@sdn-lebakbulus03.id', phone: '6281234567002', name: 'Siti Rahayu', schoolId: school2.id, sppgId: sppg1.id },
    { email: 'pic@sdn-fatmawati01.id', phone: '6281234567003', name: 'Dewi Kusuma', schoolId: school3.id, sppgId: sppg1.id },
    { email: 'pic@sdn-matraman01.id', phone: '6281234567004', name: 'Ahmad Fauzi', schoolId: school4.id, sppgId: sppg2.id },
    { email: 'pic@sdn-pisanganlama01.id', phone: '6281234567005', name: 'Rina Wulandari', schoolId: school5.id, sppgId: sppg2.id },
  ]

  for (const pic of pics) {
    await prisma.user.upsert({
      where: { email: pic.email },
      update: {},
      create: { ...pic, role: UserRole.SCHOOL_PIC },
    })
  }

  console.log('Seed completed: 1 BGN org, 2 SPPG clusters, 5 schools, 10 users')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
