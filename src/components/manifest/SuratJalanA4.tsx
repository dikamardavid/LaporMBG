'use client'

import React from 'react'
import { StickerManifestData } from './ThermalSticker58mm'

export interface SuratJalanData extends StickerManifestData {
  documentNo: string
  courierName: string
  courierPhone: string
  vehiclePlate: string
  schoolAddress: string
  schoolPicName: string
  schoolPicPhone: string
  thermoboxCount: number
  sealNumbers: string
  chefName: string
}

export default function SuratJalanA4({ data }: { data: SuratJalanData }) {
  return (
    <div
      className="surat-jalan-a4 bg-white text-slate-900 font-sans p-8 mx-auto border border-gray-300 shadow-md print:shadow-none print:border-none print:p-6"
      style={{
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Kop Resmi Kenegaraan BGN & SPPG */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded bg-brand-600 text-white flex items-center justify-center font-black text-xl">
            MBG
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-slate-900 leading-tight">
              BADAN GIZI NASIONAL REPUBLIK INDONESIA
            </h1>
            <p className="text-xs font-bold text-slate-700">
              PROGRAM MAKAN BERGIZI GRATIS (MBG) — WILAYAH OPERASIONAL DKI JAKARTA
            </p>
            <p className="text-[10px] text-slate-500">
              Unit Layanan: {data.sppgName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1">
            SURAT JALAN RESMI
          </span>
          <p className="text-[11px] font-black text-slate-900">
            {data.documentNo}
          </p>
          <p className="text-[10px] text-slate-600">
            Tanggal: {data.serviceDate}
          </p>
        </div>
      </div>

      {/* Identitas Pengirim & Penerima */}
      <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded p-3 mb-4 bg-slate-50 text-xs">
        <div>
          <p className="font-bold text-brand-700 text-[11px] uppercase mb-1">
            PENGIRIM (DAPUR SPPG):
          </p>
          <p className="font-bold text-slate-900">{data.sppgName}</p>
          <p className="text-slate-600">Kepala Dapur: {data.chefName}</p>
          <p className="text-slate-600">
            Armada: {data.courierName} ({data.vehiclePlate}) • Telp: {data.courierPhone}
          </p>
        </div>
        <div>
          <p className="font-bold text-brand-700 text-[11px] uppercase mb-1">
            PENERIMA (SEKOLAH):
          </p>
          <p className="font-bold text-slate-900">{data.schoolName}</p>
          <p className="text-slate-600">Alamat: {data.schoolAddress}</p>
          <p className="text-slate-600">
            PIC Sekolah: {data.schoolPicName} • Telp: {data.schoolPicPhone}
          </p>
        </div>
      </div>

      {/* Tabel Rincian Distribusi Makanan */}
      <div className="mb-4">
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-1.5">
          A. RINCIAN MANIFEST DISTRIBUSI MAKANAN BERGIZI
        </h2>
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-200 text-slate-900">
              <th className="border border-slate-300 p-2 text-left font-black w-8">No</th>
              <th className="border border-slate-300 p-2 text-left font-black">Komposisi Menu & Wadah</th>
              <th className="border border-slate-300 p-2 text-center font-black w-24">Jumlah Porsi</th>
              <th className="border border-slate-300 p-2 text-center font-black w-24">Jumlah Wadah</th>
              <th className="border border-slate-300 p-2 text-center font-black w-28">Status Segel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2 text-center">1</td>
              <td className="border border-slate-300 p-2">
                <p className="font-bold text-slate-900">{data.menuSummary}</p>
                <p className="text-[10px] text-slate-500">
                  Kemasan: Baki Stainless Gastronorm dalam Insulated Thermobox
                </p>
              </td>
              <td className="border border-slate-300 p-2 text-center font-bold">
                {data.portions} Porsi
              </td>
              <td className="border border-slate-300 p-2 text-center font-bold">
                {data.thermoboxCount} Baki
              </td>
              <td className="border border-slate-300 p-2 text-center text-brand-700 font-bold">
                Segel Utuh ({data.sealNumbers})
              </td>
            </tr>
            <tr className="bg-slate-50 font-bold">
              <td colSpan={2} className="border border-slate-300 p-2 text-right">
                TOTAL PORSI TERDISTRIBUSI:
              </td>
              <td className="border border-slate-300 p-2 text-center text-brand-700 font-black">
                {data.portions} Porsi
              </td>
              <td className="border border-slate-300 p-2 text-center">
                {data.thermoboxCount} Baki
              </td>
              <td className="border border-slate-300 p-2 text-center text-xs">
                Kondisi 100%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lembar Titik Kontrol Mutu & Keamanan Pangan (CCP) */}
      <div className="mb-4 border border-brand-200 bg-brand-50/40 rounded p-3 text-xs">
        <h2 className="text-xs font-black text-brand-800 uppercase tracking-wide mb-2 flex items-center justify-between">
          <span>B. LEMBAR TITIK KONTROL MUTU & KEAMANAN PANGAN (CCP)</span>
          <span className="text-[10px] font-bold bg-brand-600 text-white px-2 py-0.5 rounded">
            STANDAR KEAMANAN BGN
          </span>
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-2 text-[11px]">
          <div className="border border-brand-200 bg-white p-2 rounded">
            <span className="text-slate-500 text-[10px] block">Jam Selesai Masak:</span>
            <span className="font-black text-slate-900 text-sm">{data.cookTime} WIB</span>
          </div>
          <div className="border border-brand-200 bg-white p-2 rounded">
            <span className="text-slate-500 text-[10px] block">Jam Berangkat SPPG:</span>
            <span className="font-black text-slate-900 text-sm">{data.departureTime} WIB</span>
          </div>
          <div className="border border-brand-200 bg-white p-2 rounded">
            <span className="text-slate-500 text-[10px] block">Suhu Keberangkatan (≥60°C):</span>
            <span className="font-black text-brand-700 text-sm">{data.departureTemp}°C [AMAN]</span>
          </div>
        </div>

        {/* Verifikasi Lapangan PIC Sekolah */}
        <div className="border-t border-brand-200 pt-2 text-[10px] text-slate-800 space-y-1">
          <p className="font-bold text-slate-900 uppercase">
            Verifikasi Fisik oleh PIC Sekolah saat Makanan Tiba:
          </p>
          <div className="flex justify-between items-center bg-white p-2 rounded border border-brand-200">
            <span>[ &nbsp; ] Jam Tiba Sekolah: .......... WIB</span>
            <span>[ &nbsp; ] Suhu Saat Tiba: .......... °C (Wajib ≥ 50°C)</span>
            <span>[ &nbsp; ] Segel Wadah Masih Terkunci</span>
          </div>
          <p className="text-slate-500 text-[9px] italic">
            * Batas akhir aman konsumsi makanan adalah pukul <strong>{data.expiryTime} WIB</strong> (Maksimal 4 jam holding time sejak selesai masak). Jangan dikonsumsi jika lewat batas waktu atau berbau asam.
          </p>
        </div>
      </div>

      {/* Blok Tanda Tangan 3 Pihak */}
      <div className="border border-slate-300 rounded p-3 bg-white">
        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wide mb-3 text-center">
          BERITA ACARA SERAH TERIMA & PENGESAHAN 3 PIHAK
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div className="flex flex-col justify-between h-24">
            <p className="text-[10px] font-bold text-slate-600 uppercase">
              Petugas Dapur / Ahli Gizi SPPG
            </p>
            <div>
              <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
              <p className="font-bold text-slate-900">{data.chefName}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between h-24">
            <p className="text-[10px] font-bold text-slate-600 uppercase">
              Pengemudi / Kurir Logistik
            </p>
            <div>
              <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
              <p className="font-bold text-slate-900">{data.courierName}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between h-24">
            <p className="text-[10px] font-bold text-slate-600 uppercase">
              PIC Penerima Sekolah
            </p>
            <div>
              <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
              <p className="font-bold text-slate-900">{data.schoolPicName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Hotline BGN */}
      <div className="text-center mt-3 pt-2 border-t border-slate-200 text-[9px] text-slate-500">
        Pusat Bantuan & Pengaduan Cepat Badan Gizi Nasional: WhatsApp 0811-XXXX-BGN • Portal Web: lapormbg.go.id
      </div>
    </div>
  )
}
