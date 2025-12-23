# Panduan Migrasi ke Ubuntu (WebAlumni)

Dokumen ini menjelaskan langkah minimal untuk memindahkan dan menjalankan project WebAlumni di mesin Ubuntu.

## Ringkasan langkah

- Clone repo dan checkout branch `migrate/ubuntu-desktop`
- Transfer file `.env` secara aman ke mesin Ubuntu (jangan commit `.env`)
- Install dependencies backend (PHP/Composer) dan frontend (Node)
- Siapkan database dan jalankan migrasi
- Build/serve frontend dan jalankan backend

## Prasyarat (Ubuntu)

- Akses SSH ke mesin Ubuntu
- Git
- PHP 8.x dan ekstensi umum (mbstring, xml, curl, zip, pdo_mysql)
- Composer
- MySQL/MariaDB atau PostgreSQL
- Node.js (disarankan via nvm) dan npm
- Nginx (opsional untuk production)

## Clone repository

```bash
git clone https://github.com/iunekeputri-bot/webalumni.git
cd webalumni
git checkout migrate/ubuntu-desktop
```

## Transfer `.env` (aman)

Jangan push `.env` ke Git. Gunakan salah satu metode:

- SCP dari mesin sumber:

```bash
# contoh: copy backend .env
scp /path/to/webalumni/backend/.env user@ubuntu-ip:/home/user/webalumni/backend/.env
```

- Salin isi `.env` dan buat file `backend/.env` di server.
- Gunakan password manager untuk menyimpan dan restore nilai sensitif.

> Repo sudah berisi `*.env.example` — gunakan sebagai referensi.

## Backend (Laravel) — setup

1. Install PHP dan ekstensi:

```bash
sudo apt update
sudo apt install -y php php-cli php-fpm php-mbstring php-xml php-zip php-curl php-mysql unzip curl
```

2. Install Composer:

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

3. Install dependencies dan konfigurasi:

```bash
cd /home/user/webalumni/backend
composer install --no-interaction --prefer-dist
# jika belum ada .env, gunakan contoh
cp .env.example .env
# edit .env sesuai kredensial DB dan MAIL
php artisan key:generate
chown -R www-data:www-data storage bootstrap/cache
```

4. Jalankan migrasi:

```bash
php artisan migrate --force
php artisan storage:link
```

## Database

Instal dan konfigurasi MySQL/MariaDB (contoh singkat):

```bash
sudo apt install -y mysql-server
sudo mysql
# di dalam mysql shell:
CREATE DATABASE webalumni;
CREATE USER 'web'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON webalumni.* TO 'web'@'localhost';
FLUSH PRIVILEGES;
```

Set `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` di `backend/.env` sesuai.

## Frontend (Vite/React)

Di root project:

```bash
cd /home/user/webalumni
# gunakan node versi LTS (via nvm disarankan)
npm install
# development
npm run dev
# atau build production
npm run build
```

## Menjalankan aplikasi untuk pengujian cepat

- Backend (dev):

```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

- Frontend (dev):

```bash
npm run dev
```

Untuk production, konfigurasikan Nginx untuk melayani frontend dan mengarahkan PHP ke php-fpm.

## Permissions & keamanan

- Pastikan `storage/` dan `bootstrap/cache` writable oleh user web server (www-data).
- Jangan commit `.env` — repo sudah berisi `.env.example`.

## Transfer dari mesin lama ke Ubuntu

- Jangan kirim `.env` lewat email atau commit ke Git.
- Gunakan `scp` atau SFTP, atau simpan di password manager.

## Catatan akhir

Jika butuh saya bantu otomatisasi (mis. script deploy, transfer `.env` via scp, atau membuat instruksi lebih terperinci), beritahu metode dan akses (atau saya tunjukkan perintah lengkap yang bisa Anda jalankan).
