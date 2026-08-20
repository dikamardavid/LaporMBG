# Panduan Integrasi MBG Design Tokens ke Figma & Codebase

Dokumen ini adalah panduan eksekusi untuk tiket **[Issue #35 / GORE-1: MBG Design System: Tokens, Typography & Component Kit](https://github.com/dikamardavid/LaporMBG/issues/35)**.

---

## 🎨 1. Struktur Design Tokens yang Dibuat

1. **Tokens Standar W3C/DTCG**: [`tokens/mbg-tokens.json`](./mbg-tokens.json)
2. **Script Import Otomatis ke Figma**: [`tokens/figma-import-script.js`](./figma-import-script.js)
3. **Sinkronisasi Tailwind CSS**: [`tailwind.config.js`](../tailwind.config.js)

---

## 🚀 2. Cara Eksekusi Inject Tokens ke Figma Anda (Sekali Klik)

Anda dapat langsung meng-inject seluruh Variable Collection (Warna, Spacing, Radius) dan Canvas Swatches ke dalam file Figma baru/lama Anda:

1. **Buka file Figma Anda** di Figma Desktop atau Browser.
2. Buka **Console Figma**:
   - Klik menu **Figma (Icon Pojok Kiri Atas)** ➔ **Plugins** ➔ **Development** ➔ **Open Console** (atau tekan `Option + Cmd + I` di Mac).
3. Salin seluruh isi file [`tokens/figma-import-script.js`](./figma-import-script.js) dan **Paste ke Console**, lalu tekan **Enter**.
4. ✨ **Hasil Otomatis:**
   - Figma Variables Collection **`MBG Design System`** akan dibuat otomatis (24 Warna Semantik, Spacing `xs` s/d `xl`, Radius `sm` s/d `full`).
   - Frame visual **Swatch Card Palet Warna MBG** akan otomatis digambar di Canvas Figma Anda!

---

## 📦 3. Palet Warna Semantik yang Diimpor

| Kategori | Token Name | Hex | Deskripsi Penggunaan |
|---|---|---|---|
| **Brand** | `Brand/Primary` | `#059669` | Warna utama hijau segar gizi MBG |
| **Brand** | `Brand/Surface` | `#ecfdf5` | Background kartu hijau lembut |
| **BGN** | `BGN/Navy-900` | `#0f172a` | Warna resmi Badan Gizi Nasional |
| **BGN** | `BGN/Gold-Accent` | `#f59e0b` | Aksen emas kepresidenan / BGN |
| **Plate Waste** | `PlateWaste/Clean-0pct` | `#10b981` | Habis Bersih (0% sisa makanan) |
| **Plate Waste** | `PlateWaste/Low-25pct` | `#84cc16` | Sisa Sedikit (<25%) |
| **Plate Waste** | `PlateWaste/Half-50pct` | `#f59e0b` | Sisa Separuh (50%) |
| **Plate Waste** | `PlateWaste/High-75pct` | `#ef4444` | Sisa Banyak (>75%) |
| **Status** | `Status/Danger-Incident` | `#ef4444` | Indikasi insiden mutu pangan / basi |
| **Status** | `Status/Warning-SLA` | `#f59e0b` | Peringatan timer SLA komplain SPPG |
