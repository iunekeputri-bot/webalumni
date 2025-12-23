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

## Transfer `.env` dari ponsel (manual) dan penempatan frontend/backend

Jika Anda menyalin `.env` ke ponsel dan akan memindahkannya ke server Ubuntu secara manual, ikuti langkah ini:

1. Salin `.env` dari ponsel ke folder `Downloads` (atau lokasi sementara) pada Ubuntu.

2. Pindahkan ke folder proyek backend dan set permission:

```bash
# ganti user/path sesuai lingkungan Anda
sudo mkdir -p /var/www/webalumni/backend
sudo mkdir -p /var/www/webalumni/frontend
mv /home/$USER/Downloads/.env /var/www/webalumni/backend/.env
cd /var/www/webalumni/backend
chmod 600 .env
```

3. Hapus file `.env` dari ponsel setelah transfer dan kosongkan sampah.

4. Struktur yang diharapkan oleh panduan ini:

- Frontend build/output (index.html + assets): `/var/www/webalumni/frontend`
- Laravel backend repository: `/var/www/webalumni/backend` dengan `public` di `/var/www/webalumni/backend/public`

5. Membuat frontend build dan menempatkannya di folder yang dilayani Nginx:

```bash
# di mesin pengembangan (atau server jika Anda build di sana):
cd /path/to/webalumni
npm install
npm run build

# copy hasil build (sesuaikan folder output, mis. dist atau build)
sudo rm -rf /var/www/webalumni/frontend/*
sudo cp -r dist/* /var/www/webalumni/frontend/   # atau build/output sesuai config
sudo chown -R www-data:www-data /var/www/webalumni/frontend
```

6. Contoh konfigurasi Nginx untuk setup frontend + Laravel backend (letakkan di `/etc/nginx/sites-available/webalumni`):

```
server {
	listen 80;
	server_name 192.168.103.241; # ganti dengan domain atau IP Anda

	# Frontend (static SPA)
	root /var/www/webalumni/frontend;
	index index.html;

	# Static assets
	location ~* \.(?:css|js|jpg|jpeg|png|gif|ico|svg|woff2?|map)$ {
		try_files $uri =404;
		access_log off;
		expires 30d;
	}

	# API routes proxy to Laravel (backend/public)
	location ^~ /api/ {
		root /var/www/webalumni/backend/public;
		try_files $uri $uri/ /index.php?$query_string;
	}

	# PHP processing for Laravel
	location ~ \.php$ {
		root /var/www/webalumni/backend/public;
		fastcgi_split_path_info ^(.+\.php)(/.+)$;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		fastcgi_param PATH_INFO $fastcgi_path_info;
		fastcgi_pass unix:/run/php/php8.1-fpm.sock; # sesuaikan versi
		fastcgi_index index.php;
	}

	# SPA fallback
	location / {
		try_files $uri $uri/ /index.html;
	}

	# Laravel storage
	location /storage/ {
		alias /var/www/webalumni/backend/storage/app/public/;
		access_log off;
		expires 30d;
	}
}
```

7. Aktifkan site dan restart service:

```bash
sudo ln -s /etc/nginx/sites-available/webalumni /etc/nginx/sites-enabled/webalumni
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm   # sesuaikan versi php-fpm

# permissions
sudo chown -R www-data:www-data /var/www/webalumni
sudo chmod -R 775 /var/www/webalumni/backend/storage /var/www/webalumni/backend/bootstrap/cache
```

Jika socket php-fpm berbeda, temukan dengan `ls /run/php` dan update `fastcgi_pass` pada konfigurasi Nginx.

Catatan keamanan: hapus file `.env` dari ponsel segera setelah transfer, dan jangan mengirim `.env` lewat chat/email tanpa enkripsi.

