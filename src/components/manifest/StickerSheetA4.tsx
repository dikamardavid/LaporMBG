'use client'

import React from 'react'
import { StickerManifestData } from './ThermalSticker58mm'
import ThermalSticker80mm from './ThermalSticker80mm'

export default function StickerSheetA4({
  items,
}: {
  items: StickerManifestData[]
}) {
  // Pad or slice to 8 items for a standard 2x4 A4 grid
  const displayItems = items.slice(0, 8)
  while (displayItems.length < 8 && displayItems.length > 0) {
    displayItems.push({
      ...displayItems[0],
      batchId: `${displayItems[0].batchId}-${displayItems.length + 1}`,
    })
  }

  return (
    <div
      className="a4-sticker-sheet bg-white p-4 mx-auto border border-gray-300 shadow-md print:shadow-none print:border-none print:p-2"
      style={{
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
      }}
    >
      <div className="text-center mb-2 print:hidden">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Lembar Cetak Stiker A4 Grid (8 Label / Lembar) • Potong Mengikuti Garis Tepi
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 place-items-center">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="border-2 border-dashed border-gray-400 p-1.5 rounded relative print:border-dashed"
          >
            <span className="absolute -top-2.5 left-2 bg-white px-1 text-[8px] font-bold text-gray-500 print:hidden">
              Label #{idx + 1}
            </span>
            <div className="scale-90 origin-top">
              <ThermalSticker80mm data={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
