'use client'

import React, { useState } from 'react'
import { Printer, ArrowLeft, Sliders, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import ThermalSticker58mm from '@/components/manifest/ThermalSticker58mm'
import ThermalSticker80mm from '@/components/manifest/ThermalSticker80mm'
import StickerSheetA4 from '@/components/manifest/StickerSheetA4'
import SuratJalanA4, { SuratJalanData } from '@/components/manifest/SuratJalanA4'

export default function ManifestPrintPage() {
  const [activeTab, setActiveTab] = useState<'58mm' | '80mm' | 'a4-sheet' | 'surat-jalan'>('80mm')
  const [highContrast, setHighContrast] = useState(true)

  const sampleData: SuratJalanData = {
    batchId: 'MBG-20260917-01',
    documentNo: 'MBG/SJL/2026/09/17/0042',
    sppgName: 'SPPG Pulogadung Mandiri',
    chefName: 'Hendra Kusuma, S.Gz',
    schoolName: 'SDN Rawamangun 01 Pagi',
    schoolCode: 'SCH-JKT-042',
    schoolAddress: 'Jl. Pemuda No. 45, Rawamangun, Pulo Gadung, Jakarta Timur',
    schoolPicName: 'Ibu Sri Wahyuni, S.Pd',
    schoolPicPhone: '0813-8899-7711',
    portions: 350,
    thermoboxCount: 14,
    sealNumbers: 'SEAL-BGN-8841 s/d 8854',
    serviceDate: 'Kamis, 17 September 2026',
    cookTime: '07:15',
    departureTime: '08:15',
    departureTemp: 68.5,
    expiryTime: '11:15',
    menuSummary: 'Nasi Organik, Ayam Bakar Madu, Tempe Bacem, Sup Wortel Brokoli, Pisang, Susu UHT',
    allergens: ['Telur', 'Kedelai'],
    courierName: 'Supriyadi',
    courierPhone: '0812-3456-7890',
    vehiclePlate: 'B 9182 MBG',
    signedQrPayload: JSON.stringify({
      bId: 'MBG-20260917-01',
      sId: 'SCH-JKT-042',
      date: '2026-09-17',
      quota: 350,
      exp: '11:15',
      sig: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    }),
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white print:p-0">
      {/* Non-printable Control Navigation */}
      <header className="print:hidden bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            href="/manifest/tablet"
            className="flex items-center space-x-1 text-slate-400 hover:text-white text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Tablet Form</span>
          </Link>
          <div className="h-4 w-px bg-slate-700" />
          <h1 className="text-sm font-black tracking-tight text-white flex items-center space-x-2">
            <span>Pusat Cetak Stiker QR & Surat Jalan MBG</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {/* Format Selector Tabs */}
          <div className="bg-slate-800 p-1 rounded-lg flex space-x-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('58mm')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === '58mm' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Thermal 58mm
            </button>
            <button
              onClick={() => setActiveTab('80mm')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === '80mm' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Thermal 80mm
            </button>
            <button
              onClick={() => setActiveTab('a4-sheet')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'a4-sheet' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lembar Stiker A4 (8-Up)
            </button>
            <button
              onClick={() => setActiveTab('surat-jalan')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'surat-jalan' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Surat Jalan A4
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-black shadow transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </header>

      {/* Guidelines & Print Preview Canvas */}
      <main className="max-w-5xl mx-auto py-8 px-4 print:p-0 print:m-0">
        {/* Print Setup Guide Banner (Screen Only) */}
        <div className="print:hidden bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase">
                Standar Kualitas Cetak Thermal & Lembar A4 Tahan Basah/Minyak
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5">
                • <strong>Thermal 58mm/80mm</strong>: Gunakan kertas sintetis BOPP top-coated pada 203 DPI.
                <br />• <strong>Lembar A4</strong>: Gunakan stiker label vinyl matte tahan air pada printer laser/inkjet.
                <br />• <strong>Surat Jalan</strong>: Gunakan kertas HVS A4 standar 80gsm untuk tanda tangan resmi 3 pihak.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
            <Sliders className="w-4 h-4 text-slate-400" />
            <label className="cursor-pointer flex items-center space-x-1.5">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span>High Contrast 1-bit</span>
            </label>
          </div>
        </div>

        {/* The Printable Container */}
        <div className="print-area flex justify-center items-start">
          {activeTab === '58mm' && <ThermalSticker58mm data={sampleData} />}
          {activeTab === '80mm' && <ThermalSticker80mm data={sampleData} />}
          {activeTab === 'a4-sheet' && <StickerSheetA4 items={[sampleData]} />}
          {activeTab === 'surat-jalan' && <SuratJalanA4 data={sampleData} />}
        </div>
      </main>
    </div>
  )
}
