# Quiz Web — Jaringan Komputer

Quiz Web adalah aplikasi kuis interaktif berbasis **HTML, CSS, dan JavaScript** untuk menguji pengetahuan tentang jaringan komputer. Pengguna dapat memilih topik, menjawab soal pilihan ganda dengan timer, lalu melihat skor dan ringkasan performa.

## Fitur

- Antarmuka berbahasa Indonesia
- Empat kategori materi jaringan:
  - Dasar Jaringan
  - Perangkat Jaringan
  - Protokol Internet
  - Keamanan Jaringan
- Lima soal per sesi dengan pilihan ganda
- Timer 20 detik untuk setiap soal
- Navigasi maju dan kembali antarsoal
- Indikator progres dan nomor soal
- Perhitungan skor otomatis
- Perhitungan streak jawaban benar
- Halaman hasil dengan persentase, durasi, dan rekap jawaban
- Opsi mengulang sesi atau memilih kategori lain
- Layout responsif untuk desktop dan perangkat mobile
- Tidak memerlukan backend atau proses login

## Teknologi

- HTML5
- CSS3 dengan layout Grid, Flexbox, dan responsive media queries
- Vanilla JavaScript tanpa framework
- Google Fonts: Manrope dan DM Mono

## Menjalankan secara lokal

Karena aplikasi menggunakan file statis, project dapat dijalankan dengan server HTTP sederhana:

```bash
python3 -m http.server 3000
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Project

```text
.
├── index.html          # Struktur halaman dan tiga state utama aplikasi
├── styles.css          # Sistem visual, layout, responsive UI, dan readability pass
├── app.js              # Data soal, state kuis, timer, scoring, dan interaksi
├── manus-routes.json   # Manifest route untuk preview managed
├── app.config.ts       # Metadata logo project
└── quizroom-logo.svg   # Mark logo Quizroom
```

## Alur Pengguna

1. Pengguna membuka halaman utama dan memilih kategori jaringan.
2. Sesi dimulai dari soal pertama dengan timer 20 detik.
3. Pengguna memilih satu jawaban lalu berpindah menggunakan tombol **Lanjut**.
4. Jika waktu habis, aplikasi otomatis berpindah ke soal berikutnya.
5. Setelah soal terakhir, aplikasi menampilkan skor, streak, durasi, dan rekap jawaban.

## Preview

[ Buka Quiz Web Preview ](https://3000-iwujhjqnukpqwobirn3st-d7e377d5.sg2.manus.computer/)

## Lisensi

Project ini dibuat sebagai aplikasi demo edukasi dan dapat dikembangkan sesuai kebutuhan project.
