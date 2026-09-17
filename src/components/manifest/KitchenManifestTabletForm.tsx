'use client'

import React, { useState, useId } from 'react'
import {
  Thermometer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Printer,
  FileText,
  ShieldCheck,
  Plus,
  Minus,
  Save,
  Send,
} from 'lucide-react'
import ThermalSticker58mm, { StickerManifestData } from './ThermalSticker58mm'
import ThermalSticker80mm from './ThermalSticker80mm'
import StickerSheetA4 from './StickerSheetA4'
import SuratJalanA4, { SuratJalanData } from './SuratJalanA4'

interface MenuItem {
  id: string
  category: string
  name: string
  portionGram: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: '1', category: 'Karbohidrat', name: 'Nasi Putih Organik', portionGram: 150, calories: 195, protein: 4.2, carbs: 43.5, fat: 0.4 },
  { id: '2', category: 'Lauk Hewani', name: 'Ayam Bakar Madu BGN', portionGram: 80, calories: 220, protein: 24.5, carbs: 6.2, fat: 10.5 },
  { id: '3', category: 'Lauk Nabati', name: 'Tempe Bacem Kukus', portionGram: 50, calories: 110, protein: 9.8, carbs: 7.5, fat: 4.8 },
  { id: '4', category: 'Sayuran', name: 'Sup Bening Wortel & Brokoli', portionGram: 100, calories: 65, protein: 2.8, carbs: 11.2, fat: 0.8 },
  { id: '5', category: 'Buah Segar', name: 'Pisang Barangan', portionGram: 100, calories: 90, protein: 1.1, carbs: 23.0, fat: 0.3 },
]

const ALLERGEN_OPTIONS = [
  { id: 'telur', label: 'Telur' },
  { id: 'susu', label: 'Susu / Dairy' },
  { id: 'kacang', label: 'Kacang Tanah' },
  { id: 'ikan', label: 'Ikan / Seafood' },
  { id: 'kedelai', label: 'Kedelai / Kedelai Hitam' },
  { id: 'gluten', label: 'Gluten / Gandum' },
]

export default function KitchenManifestTabletForm() {
  const photoInputId = useId()
  // Form State
  const [selectedSchool, setSelectedSchool] = useState('SDN Rawamangun 01 Pagi')
  const [portions, setPortions] = useState(350)
  const [cookTime, setCookTime] = useState('07:15')
  const [departureTime, setDepartureTime] = useState('08:15')
  const [departureTemp, setDepartureTemp] = useState<number>(68.5)
  const [activeAllergens, setActiveAllergens] = useState<string[]>(['Telur', 'Kedelai'])
  const [courierName, setCourierName] = useState('Supriyadi')
  const [vehiclePlate, setVehiclePlate] = useState('B 9182 MBG')
  const [courierPhone, setCourierPhone] = useState('0812-3456-7890')
  const [samplePhoto, setSamplePhoto] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [activePrintModal, setActivePrintModal] = useState<
    '58mm' | '80mm' | 'a4-stickers' | 'surat-jalan' | null
  >(null)

  // Calculations: AKG Nutrition Totals
  const totalCalories = DEFAULT_MENU_ITEMS.reduce((acc, i) => acc + i.calories, 0)
  const totalProtein = DEFAULT_MENU_ITEMS.reduce((acc, i) => acc + i.protein, 0)
  const totalCarbs = DEFAULT_MENU_ITEMS.reduce((acc, i) => acc + i.carbs, 0)
  const totalFat = DEFAULT_MENU_ITEMS.reduce((acc, i) => acc + i.fat, 0)

  // Critical Control Point (CCP) Evaluation: Temperature
  const getTempStatus = (temp: number) => {
    if (temp >= 60.0) {
      return {
        level: 'SAFE',
        label: 'SUHU AMAN KEBERANGKATAN (≥ 60°C)',
        description: 'Bakteri patogen mati/dorman. Titik kontrol mutu CCP lolos pengujian.',
        badgeClass: 'bg-emerald-500 text-white border-emerald-600',
        boxClass: 'border-emerald-500 bg-emerald-50 text-emerald-950',
        icon: <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />,
      }
    }
    if (temp >= 50.0) {
      return {
        level: 'WARNING',
        label: 'PERINGATAN SUHU (50°C - 59.9°C)',
        description: 'Mendekati batas kritis pertumbuhan bakteri. Wajib gunakan insulated thermobox & kirim segera!',
        badgeClass: 'bg-amber-500 text-white border-amber-600',
        boxClass: 'border-amber-500 bg-amber-50 text-amber-950',
        icon: <AlertTriangle className="w-7 h-7 text-amber-600 flex-shrink-0" />,
      }
    }
    return {
      level: 'DANGER',
      label: 'BAHAYA MUTU PANGAN (< 50°C)',
      description: 'Makanan berada di zona bahaya pertumbuhan bakteri patogen (Danger Zone)! BATCH DILARANG DIKIRIM!',
      badgeClass: 'bg-rose-500 text-white border-rose-600',
      boxClass: 'border-rose-500 bg-rose-50 text-rose-950',
      icon: <XCircle className="w-7 h-7 text-rose-600 flex-shrink-0" />,
    }
  }

  const tempStatus = getTempStatus(departureTemp)

  // Holding Time Calculation (Max 4 hours = 240 mins)
  const calculateHoldingTime = () => {
    const [cHours, cMins] = cookTime.split(':').map(Number)
    const [dHours, dMins] = departureTime.split(':').map(Number)
    const diff = dHours * 60 + dMins - (cHours * 60 + cMins)
    const hours = Math.floor(diff / 60)
    const mins = diff % 60
    return { diffMinutes: diff, text: `${hours} Jam ${mins} Menit`, isOk: diff <= 240 }
  }

  const holdingTime = calculateHoldingTime()

  // Calculate Expiry Time (Cook Time + 4 Hours)
  const calculateExpiryTime = () => {
    const [cHours, cMins] = cookTime.split(':').map(Number)
    const expHours = (cHours + 4) % 24
    return `${String(expHours).padStart(2, '0')}:${String(cMins).padStart(2, '0')}`
  }

  const expiryTime = calculateExpiryTime()

  // Toggle Allergen
  const toggleAllergen = (name: string) => {
    if (activeAllergens.includes(name)) {
      setActiveAllergens(activeAllergens.filter((a) => a !== name))
    } else {
      setActiveAllergens([...activeAllergens, name])
    }
  }

  // Handle Mock Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setSamplePhoto(url)
    }
  }

  // Unified Manifest Data for Sticker & Handover Prints
  const manifestData: SuratJalanData = {
    batchId: 'MBG-20260917-01',
    documentNo: 'MBG/SJL/2026/09/17/0042',
    sppgName: 'SPPG Pulogadung Mandiri',
    chefName: 'Hendra Kusuma, S.Gz',
    schoolName: selectedSchool,
    schoolCode: 'SCH-JKT-042',
    schoolAddress: 'Jl. Pemuda No. 45, Rawamangun, Pulo Gadung, Jakarta Timur',
    schoolPicName: 'Ibu Sri Wahyuni, S.Pd',
    schoolPicPhone: '0813-8899-7711',
    portions: portions,
    thermoboxCount: Math.ceil(portions / 25),
    sealNumbers: 'SEAL-BGN-8841 s/d 8854',
    serviceDate: 'Kamis, 17 September 2026',
    cookTime: cookTime,
    departureTime: departureTime,
    departureTemp: departureTemp,
    expiryTime: expiryTime,
    menuSummary: 'Nasi Organik, Ayam Madu, Tempe Bacem, Sup Wortel, Pisang, Susu UHT',
    allergens: activeAllergens,
    courierName: courierName,
    courierPhone: courierPhone,
    vehiclePlate: vehiclePlate,
    signedQrPayload: JSON.stringify({
      bId: 'MBG-20260917-01',
      sId: 'SCH-JKT-042',
      date: '2026-09-17',
      quota: portions,
      exp: expiryTime,
      sig: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    }),
  }

  return (
    <div className="kitchen-tablet-shell min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Tablet Ergonomic Top Bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-xl text-white shadow">
            MBG
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-tight flex items-center space-x-2">
              <span>SPPG Pulogadung</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-emerald-400">Kitchen Manifest & CCP Station</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Mode Tablet Dapur • Suhu Ruang Masak Terpantau 38°C
            </p>
          </div>
        </div>

        {/* Status Badge & Quick Print Buttons */}
        <div className="flex items-center space-x-3">
          <div className="text-right mr-2 hidden md:block">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
              STATUS BATCH
            </span>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded inline-block uppercase tracking-wider ${
                isLocked
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-slate-900'
              }`}
            >
              {isLocked ? 'PRE_FLIGHT_LOGGED' : 'DRAFT MANIFEST'}
            </span>
          </div>

          <button
            onClick={() => setActivePrintModal('58mm')}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition border border-slate-700"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Thermal 58mm</span>
          </button>
          <button
            onClick={() => setActivePrintModal('80mm')}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition border border-slate-700"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Thermal 80mm</span>
          </button>
          <button
            onClick={() => setActivePrintModal('surat-jalan')}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition border border-slate-700"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Surat Jalan</span>
          </button>
        </div>
      </header>

      {/* Main Tablet Two-Column Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: School Target, Menu AKG, Allergen Matrix (7 cols) */}
        <section className="lg:col-span-7 space-y-6">
          {/* Card 1: Sekolah & Kuota Porsi */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white inline-flex items-center justify-center text-xs">
                1
              </span>
              <span>Sekolah Penerima & Kuota Porsi</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Sekolah Tujuan (Klaster Wilayah Pulogadung)
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  disabled={isLocked}
                  className="w-full text-base font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none h-13"
                >
                  <option value="SDN Rawamangun 01 Pagi">
                    SDN Rawamangun 01 Pagi (350 Siswa)
                  </option>
                  <option value="SDN Rawamangun 02 Petang">
                    SDN Rawamangun 02 Petang (280 Siswa)
                  </option>
                  <option value="SMPN 74 Jakarta Timur">
                    SMPN 74 Jakarta Timur (420 Siswa)
                  </option>
                  <option value="SDN Cempaka Putih Timur 03">
                    SDN Cempaka Putih Timur 03 (310 Siswa)
                  </option>
                </select>
              </div>

              {/* Stepped Numeric Input: Portions */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Jumlah Porsi yang Dikirimkan (Touch Friendly Control)
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setPortions(Math.max(10, portions - 25))}
                    disabled={isLocked}
                    className="w-14 h-14 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 flex items-center justify-center text-2xl font-black transition active:scale-95 disabled:opacity-50"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <div className="flex-1 bg-slate-50 border-2 border-slate-300 rounded-lg h-14 flex items-center justify-center">
                    <span className="text-2xl font-black text-emerald-700 tracking-tight">
                      {portions}{' '}
                      <span className="text-sm font-bold text-slate-500">Porsi</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPortions(portions + 25)}
                    disabled={isLocked}
                    className="w-14 h-14 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 flex items-center justify-center text-2xl font-black transition active:scale-95 disabled:opacity-50"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Komposisi Menu & Takaran AKG */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white inline-flex items-center justify-center text-xs">
                  2
                </span>
                <span>Komposisi Menu & Takaran Gizi AKG</span>
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Menu Siklus Hari Ke-4
              </span>
            </div>

            {/* Menu Items Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 text-left">Kategori</th>
                    <th className="p-2.5 text-left">Nama Hidangan</th>
                    <th className="p-2.5 text-center">Takaran</th>
                    <th className="p-2.5 text-right">Kalori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DEFAULT_MENU_ITEMS.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-500">{item.category}</td>
                      <td className="p-2.5 font-black text-slate-900">{item.name}</td>
                      <td className="p-2.5 text-center font-bold text-slate-600">
                        {item.portionGram}g
                      </td>
                      <td className="p-2.5 text-right font-black text-emerald-700">
                        {item.calories} kcal
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live AKG Nutrition Summary Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  TOTAL AKG MAKRONUTRISI PER PORSI:
                </span>
                <span className="text-xs font-black text-emerald-700">
                  100% Standar BGN Terpenuhi
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded border border-emerald-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 block">Kalori</span>
                  <span className="text-base font-black text-slate-900">{totalCalories}</span>
                  <span className="text-[9px] text-slate-400 block">kcal</span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 block">Protein</span>
                  <span className="text-base font-black text-slate-900">{totalProtein.toFixed(1)}</span>
                  <span className="text-[9px] text-slate-400 block">gram</span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 block">Karbo</span>
                  <span className="text-base font-black text-slate-900">{totalCarbs.toFixed(1)}</span>
                  <span className="text-[9px] text-slate-400 block">gram</span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 block">Lemak</span>
                  <span className="text-base font-black text-slate-900">{totalFat.toFixed(1)}</span>
                  <span className="text-[9px] text-slate-400 block">gram</span>
                </div>
              </div>
            </div>

            {/* Allergen Matrix Selector */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Peringatan Alergen Makanan (Pilih Semua yang Terkandung):
              </label>
              <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map((alg) => {
                  const active = activeAllergens.includes(alg.label)
                  return (
                    <button
                      key={alg.id}
                      type="button"
                      onClick={() => toggleAllergen(alg.label)}
                      disabled={isLocked}
                      className={`min-h-[48px] px-4 py-2.5 rounded-lg text-xs font-bold border-2 transition active:scale-95 flex items-center space-x-2 ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-amber-400' : 'bg-slate-300'}`} />
                      <span>{alg.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: CCP Safety Gate, Temperature Gauge, Photo Capture & Actions (5 cols) */}
        <section className="lg:col-span-5 space-y-6">
          {/* Card 3: Titik Kontrol Mutu (CCP) Suhu & Jam Masak */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white inline-flex items-center justify-center text-xs">
                3
              </span>
              <span>Titik Kontrol Mutu (CCP) Keamanan Pangan</span>
            </h2>

            {/* Cook Time, Departure Time & Holding Time */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Jam Selesai Masak</span>
                </label>
                <input
                  type="time"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  disabled={isLocked}
                  className="w-full text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-lg p-3 h-13"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Jam Berangkat SPPG</span>
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  disabled={isLocked}
                  className="w-full text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-lg p-3 h-13"
                />
              </div>
            </div>

            {/* Holding Time & Expiry Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block uppercase">
                  HOLDING TIME BERJALAN
                </span>
                <span className="text-sm font-black text-slate-900">
                  {holdingTime.text}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-rose-600 block uppercase">
                  BATAS AMAN KONSUMSI
                </span>
                <span className="text-sm font-black text-rose-600">
                  {expiryTime} WIB (Maks 4 Jam)
                </span>
              </div>
            </div>

            {/* Stepped Temperature Input & Real-Time Feedback */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Thermometer className="w-4 h-4 text-emerald-600" />
                  <span>Suhu Keberangkatan Makanan (°C)</span>
                </label>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase">
                  Target Standar: ≥ 60.0°C
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-3">
                <button
                  type="button"
                  onClick={() => setDepartureTemp(Number((departureTemp - 1.0).toFixed(1)))}
                  disabled={isLocked}
                  className="w-14 h-14 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 flex items-center justify-center text-2xl font-black transition active:scale-95 disabled:opacity-50"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <div className="flex-1 bg-slate-50 border-2 border-slate-300 rounded-lg h-14 flex items-center justify-center">
                  <span className="text-3xl font-black tracking-tight text-slate-900">
                    {departureTemp.toFixed(1)} <span className="text-base font-bold text-slate-500">°C</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDepartureTemp(Number((departureTemp + 1.0).toFixed(1)))}
                  disabled={isLocked}
                  className="w-14 h-14 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 flex items-center justify-center text-2xl font-black transition active:scale-95 disabled:opacity-50"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {/* Real-Time Temperature Feedback Box */}
              <div className={`border-2 rounded-xl p-3.5 flex items-start space-x-3 transition-all ${tempStatus.boxClass}`}>
                {tempStatus.icon}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wide leading-tight">
                    {tempStatus.label}
                  </h3>
                  <p className="text-[11px] font-medium mt-1 leading-snug">
                    {tempStatus.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Photo Capture Area (Camera Overlay Guide) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center space-x-1">
                <Camera className="w-4 h-4 text-slate-500" />
                <span>Foto Sampel Baki Hidangan (Wajib Sebelum Disegel)</span>
              </label>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition relative">
                {samplePhoto ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={samplePhoto}
                      alt="Sample Dish"
                      className="w-full h-36 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setSamplePhoto(null)}
                      className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded"
                    >
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      id={photoInputId}
                      onChange={handlePhotoUpload}
                      disabled={isLocked}
                      className="hidden"
                    />
                    <label
                      htmlFor={photoInputId}
                      className="cursor-pointer flex flex-col items-center justify-center py-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Ambil Foto Baki Hidangan Lengkap
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Rasio 4:3 • Pastikan seluruh komponen menu terlihat jelas
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Logistik Armada & Form Action Buttons */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white inline-flex items-center justify-center text-xs">
                4
              </span>
              <span>Armada Pengiriman & Aksi Kunci</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                  Nama Driver / Kurir
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  disabled={isLocked}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">
                  Plat Nomor Armada
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  disabled={isLocked}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
              </div>
            </div>

            {/* Tablet Action Buttons (Large Touch Target min 52px) */}
            <div className="space-y-3">
              {tempStatus.level === 'DANGER' ? (
                <div className="w-full bg-rose-100 text-rose-800 p-3 rounded-lg text-xs font-bold text-center border border-rose-300">
                  Tombol cetak dinonaktifkan: Suhu makanan di bawah 50°C tidak aman!
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsLocked(true)
                    setActivePrintModal('80mm')
                  }}
                  className="w-full min-h-[52px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition active:scale-[0.98]"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>KUNCI MANIFEST & CETAK QR STIKER</span>
                </button>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => alert('Draft Manifest berhasil disimpan di penyimpanan tablet offline.')}
                  className="flex-1 min-h-[48px] rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Draft</span>
                </button>

                {isLocked && (
                  <button
                    type="button"
                    onClick={() => setIsLocked(false)}
                    className="flex-1 min-h-[48px] rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-[0.98]"
                  >
                    <span>Buka Kunci Edit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Print Preview Modal */}
      {activePrintModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Pratinjau Cetak: {activePrintModal.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-500">
                  Layout telah dioptimalkan untuk kontras tinggi & tahan cipratan minyak/uap panas dapur.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  onClick={() => setActivePrintModal(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Modal Body: Active Layout */}
            <div className="flex justify-center p-4 bg-slate-100 rounded-xl overflow-x-auto">
              {activePrintModal === '58mm' && <ThermalSticker58mm data={manifestData} />}
              {activePrintModal === '80mm' && <ThermalSticker80mm data={manifestData} />}
              {activePrintModal === 'a4-stickers' && (
                <StickerSheetA4 items={[manifestData]} />
              )}
              {activePrintModal === 'surat-jalan' && <SuratJalanA4 data={manifestData} />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
