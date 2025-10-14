# 🍡 Website Mochi Sehat

Website e-commerce untuk toko mochi dengan sistem pemesanan yang mudah dan user-friendly.

## ✨ Fitur Utama

### 🛒 Sistem Pemesanan
- **Pesan Langsung**: Klik tombol "Pesan Langsung" pada menu untuk memesan langsung via WhatsApp
- **Keranjang Belanja**: Tambahkan item ke keranjang dan checkout dengan sistem login
- **Form Kontak**: Kirim pesan umum melalui form kontak

### 🔐 Sistem Autentikasi
- Login dan registrasi user
- Proteksi halaman keranjang dan checkout
- Session management dengan localStorage

### 💳 Metode Pembayaran
- Transfer Bank BCA
- Cash on Delivery (COD)

## 🚀 Cara Menggunakan

### 1. Pemesanan Langsung (Tanpa Login)
1. Buka halaman utama website
2. Scroll ke bagian menu
3. Hover pada menu card untuk melihat tombol "Pesan Langsung"
4. Klik tombol "Pesan Langsung"
5. Isi form data pemesanan:
   - Nama Lengkap
   - Nomor Telepon
   - Alamat Pengiriman
   - Jumlah Pesanan
   - Catatan (opsional)
6. Klik "Kirim Pesanan"
7. Pesanan akan dikirim ke WhatsApp secara otomatis

### 2. Pemesanan dengan Keranjang (Perlu Login)
1. Klik tombol "Add to Cart" pada menu
2. Login atau registrasi akun
3. Lihat keranjang belanja
4. Lanjutkan ke checkout
5. Isi data pengiriman dan pilih metode pembayaran
6. Pesanan akan dikirim ke WhatsApp

### 3. Form Kontak
1. Scroll ke bagian kontak
2. Isi nama, email, dan nomor telepon
3. Klik "kirim pesan"
4. Pesan akan dikirim ke WhatsApp

## 📱 Integrasi WhatsApp

Semua pesanan dan pesan akan dikirim ke nomor WhatsApp: **6285212312795**

Format pesan otomatis:
```
Hallo kak, saya mau order Mochi

📋 Detail Pesanan:
[Produk] x[Jumlah] - [Harga]

👤 Data Pembeli:
Nama: [Nama]
Telepon: [Nomor]
Alamat: [Alamat]

📝 Catatan: [Catatan]

💰 Total: [Total Harga]

Mohon konfirmasi pesanan saya. Terima kasih!
```

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur website
- **CSS3**: Styling dengan efek glassmorphism dan animasi
- **JavaScript**: Fungsionalitas interaktif
- **Feather Icons**: Icon library
- **LocalStorage**: Penyimpanan data lokal
- **WhatsApp API**: Integrasi pesan otomatis

## 📁 Struktur File

```
├── index.html          # Halaman utama
├── login.html          # Halaman login
├── register.html       # Halaman registrasi
├── cart.html          # Halaman keranjang
├── checkout.html      # Halaman checkout
├── css/
│   ├── style.css      # Styling utama
│   ├── auth.css       # Styling halaman auth
│   ├── cart.css       # Styling halaman cart
│   └── checkout.css   # Styling halaman checkout
├── js/
│   ├── script.js      # JavaScript utama
│   ├── auth.js        # JavaScript autentikasi
│   ├── cart.js        # JavaScript keranjang
│   └── checkout.js    # JavaScript checkout
└── img/               # Folder gambar
```

## 🎨 Fitur Desain

- **Glassmorphism**: Efek kaca modern
- **Responsive Design**: Tampilan optimal di semua device
- **Smooth Animations**: Animasi halus dan menarik
- **Hover Effects**: Efek interaktif pada elemen
- **Dark Theme**: Tema gelap yang elegan

## 🔧 Cara Menjalankan

1. Clone atau download project
2. Buka folder project
3. Jalankan server lokal:
   ```bash
   python -m http.server 8000
   ```
4. Buka browser dan akses: `http://localhost:8000`


## 📞 Kontak

- **WhatsApp**: 6285212312795
- **Email**: [Email toko]
- **Alamat**: [Alamat toko]

## 👨‍💻 Developer

Dibuat dengan ❤️ oleh **Nana**

---

**Note**: Website ini menggunakan localStorage untuk menyimpan data, jadi data akan hilang jika browser cache dibersihkan. 