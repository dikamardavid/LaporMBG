'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { StickerManifestData } from './ThermalSticker58mm'

export default function ThermalSticker80mm({ data }: { data: StickerManifestData }) {
  const [qrUrl, setQrUrl] = useState<string>('')

  useEffect(() => {
    QRCode.toDataURL(data.signedQrPayload, {
      errorCorrectionLevel: 'Q',
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error('Failed to generate 80mm QR code', err))
  }, [data.signedQrPayload])

  return (
    <div
      className="thermal-80mm-card bg-white text-black font-sans border-2 border-black p-4 w-[302px] mx-auto rounded shadow-sm print:shadow-none print:border-black print:m-0"
      style={{
        width: '80mm',
        minHeight: '100mm',
        boxSizing: 'border-box',
        filter: 'contrast(150%)',
      }}
    >
      {/* 2-Column Official Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider leading-tight">
            ★ BADAN GIZI NASIONAL
          </p>
          <p className="text-[9px] font-bold text-gray-800">
            {data.sppgName}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block border border-black px-1.5 py-0.5 text-[8.5px] font-black uppercase">
            RESMI BGN
          </span>
        </div>
      </div>

      {/* Target School & Batch Details */}
      <div className="text-center my-1.5">
        <h2 className="text-[14px] font-black uppercase tracking-tight leading-tight">
          {data.schoolName}
        </h2>
        <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-900 mt-1 px-1">
          <span>BATCH: <span className="underline">{data.batchId}</span></span>
          <span>KUOTA: {data.portions} PORSI</span>
        </div>
      </div>

      {/* Core Dynamic Signed QR Code */}
      <div className="flex justify-center my-2">
        <div className="border-2 border-black p-1.5 bg-white inline-block">
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrUrl}
              alt="Dynamic Signed QR Code 80mm"
              className="w-[160px] h-[160px] object-contain block mx-auto"
            />
          ) : (
            <div className="w-[160px] h-[160px] flex items-center justify-center bg-gray-100 text-[10px] font-bold">
              MEMUAT QR...
            </div>
          )}
        </div>
      </div>

      {/* Menu Composition & Allergen Notice Box */}
      <div className="border border-black p-1.5 my-2 text-[9px] leading-snug rounded-sm">
        <p className="font-bold text-gray-900">
          <span className="font-black">Menu:</span> {data.menuSummary}
        </p>
        {data.allergens && data.allergens.length > 0 && (
          <p className="font-black text-black mt-0.5 uppercase">
            ⚠ Alergen: {data.allergens.join(', ')}
          </p>
        )}
      </div>

      {/* Negative Expiry Bar */}
      <div className="bg-black text-white text-center py-1 px-2 my-2 rounded-sm">
        <p className="text-[11px] font-black uppercase tracking-wide leading-none">
          BATAS KONSUMSI: MAKS {data.expiryTime} WIB
        </p>
        <p className="text-[8px] font-bold opacity-90 mt-0.5 tracking-tight">
          (MAKSIMAL 4 JAM SETELAH SELESAI MASAK)
        </p>
      </div>

      {/* Food Safety Certification & Tamper Clause */}
      <div className="text-center pt-1.5 border-t-2 border-black text-[8px] leading-tight font-bold">
        <p className="text-black">
          SUHU BERANGKAT: {data.departureTemp}°C [AMAN] • BERANGKAT: {data.departureTime} WIB
        </p>
        <p className="text-[7.5px] font-black uppercase tracking-tight text-gray-900 mt-1">
          JANGAN TERIMA JIKA SEGEL WADAH RUSAK / MAKANAN BERBAU ASAM
        </p>
      </div>
    </div>
  )
}
