# 0003-pwa-offline-first-and-geofenced-signed-qr

## Status
accepted

## Context & Decision
Aksesibilitas pelaporan di sekolah memiliki tantangan konektivitas internet yang fluktuatif serta risiko spam/manipulasi data umpan balik jika form dibuka publik tanpa login.

Kami memutuskan:
1. **PIC Sekolah (Offline-First PWA)**: Menggunakan Progressive Web App dengan penyimpanan lokal IndexedDB untuk pencatatan BAP dan pengambilan foto, yang otomatis disinkronisasi ke server saat koneksi internet pulih.
2. **Siswa (Dynamic Signed QR + Geofencing)**: QR code di-generate dinamis per Batch Distribusi dengan payload kriptografi bertanda waktu (*signed token*), pembatasan kuota respons sesuai jumlah porsi yang dikirim, dan validasi koordinat Geofence browser untuk memastikan pengisian dilakukan di lingkungan sekolah terkait.

## Consequences
- PIC Sekolah tidak terhambat oleh *blank spot* sinyal saat serah terima makanan di pagi hari.
- Ulasan siswa terlindungi dari *botting*, manipulasi ulasan dari luar sekolah, atau pengisian berulang melebihi kapasitas siswa.
