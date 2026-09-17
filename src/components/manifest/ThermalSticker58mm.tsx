'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export interface StickerManifestData {
  batchId: string
  schoolName: string
  schoolCode: string
  portions: number
  serviceDate: string
  cookTime: string
  departureTime: string
  departureTemp: number
  expiryTime: string
  menuSummary: string
  allergens: string[]
  signedQrPayload: string
  sppgName: string
}

export default function ThermalSticker58mm({ data }: { data: StickerManifestData }) {
  const [qrUrl, setQrUrl] = useState<string>('')

  useEffect(() => {
    QRCode.toDataURL(data.signedQrPayload, {
      errorCorrectionLevel: 'Q',
      margin: 1,
      width: 160,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err))
  }, [data.signedQrPayload])

  return (
    <div
      className="thermal-58mm-card bg-white text-black font-sans border-2 border-black p-3 w-[220px] mx-auto rounded shadow-sm print:shadow-none print:border-black print:m-0"
      style={{
        width: '58mm',
        minHeight: '65mm',
        boxSizing: 'border-box',
        filter: 'contrast(150%)',
      }}
    >
      {/* Header Strip */}
      <div className="text-center border-b border-black pb-1 mb-1">
        <p className="text-[10px] font-black uppercase tracking-wider leading-tight">
          ★ BGN • SPPG MBG ★
        </p>
        <p className="text-[8px] font-bold tracking-tight text-gray-800">
          {data.sppgName}
        </p>
      </div>

      {/* Target School Destination */}
      <div className="text-center my-1">
        <h2 className="text-[12px] font-black uppercase tracking-tight leading-tight">
          {data.schoolName}
        </h2>
        <p className="text-[9px] font-bold text-gray-900 mt-0.5">
          BATCH: <span className="underline">{data.batchId}</span> | {data.portions} PORSI
        </p>
      </div>

      {/* High ECC Core QR Code Container */}
      <div className="flex justify-center my-1.5">
        <div className="border border-black p-1 bg-white inline-block">
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrUrl}
              alt="Dynamic Signed QR Code"
              className="w-[125px] h-[125px] object-contain block mx-auto"
            />
          ) : (
            <div className="w-[125px] h-[125px] flex items-center justify-center bg-gray-100 text-[9px] font-bold">
              MEMUAT QR...
            </div>
          )}
        </div>
      </div>

      {/* High-Contrast Negative Expiry Warning Bar */}
      <div className="bg-black text-white text-center py-1 px-1 my-1 rounded-sm">
        <p className="text-[10px] font-black uppercase tracking-wide leading-none">
          KONSUMSI SBLM: {data.expiryTime} WIB
        </p>
      </div>

      {/* Quality Safety Stamp & Verification CTA */}
      <div className="text-center pt-1 border-t border-dashed border-black">
        <p className="text-[8px] font-bold leading-tight">
          SUHU: {data.departureTemp}°C [AMAN] • KIRIM: {data.departureTime}
        </p>
        <p className="text-[7.5px] font-extrabold uppercase tracking-tight mt-0.5">
          SCAN UTK PENILAIAN MAKANAN SISWA
        </p>
      </div>
    </div>
  )
}
