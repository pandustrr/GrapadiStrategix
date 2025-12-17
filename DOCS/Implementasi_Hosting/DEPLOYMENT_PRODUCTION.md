# 🚀 Panduan Deployment Production - Grapadi Strategix

**Versi**: 1.3  
**Tanggal**: 17 Desember 2025  
**Tujuan**: Dokumentasi lengkap untuk deployment aplikasi dari localhost ke production hosting

---

## 📋 Daftar Isi

1. [Persiapan Awal](#1-persiapan-awal)
2. [Konfigurasi Backend (Laravel)](#2-konfigurasi-backend-laravel)
3. [Konfigurasi Frontend (React)](#3-konfigurasi-frontend-react)
4. [Database Migration](#4-database-migration)
5. [File Storage & Upload](#5-file-storage--upload)
6. [CORS & Security](#6-cors--security)
7. [Build & Deployment](#7-build--deployment)
8. [Testing Production](#8-testing-production)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Persiapan Awal

### 1.1 Informasi Domain & Server

**Sebelum memulai, pastikan Anda memiliki:**

- ✅ Domain yang sudah terdaftar (contoh: `strategix.com`)
- ✅ Hosting server (VPS/Shared Hosting) dengan akses SSH
- ✅ Database MySQL/PostgreSQL di hosting
- ✅ SSL Certificate (untuk HTTPS)

**Contoh struktur domain:**
```
Frontend: https://strategix.com
Backend API: https://api.strategix.com
```

**Alternatif (satu domain):**
```
Frontend: https://strategix.com
Backend API: https://strategix.com/api
```

### 1.2 Persyaratan Server

**Backend Requirements:**
- PHP >= 8.1
- Composer
- MySQL >= 5.7 atau PostgreSQL >= 10
- Node.js >= 18.x (untuk Vite build)
- Extension PHP: OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath, GD/Imagick

**Frontend Requirements:**
- Node.js >= 18.x
- npm atau yarn
- Web server (Nginx/Apache)

---

## 2. Konfigurasi Backend (Laravel)

### 2.1 File `.env` Production

**Lokasi**: `backend/.env`

Buat file `.env` baru untuk production (jangan copy langsung dari `.env.local`):

```env
# ==========================================
# APPLICATION SETTINGS
# ==========================================
APP_NAME="Grapadi Strategix"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.strategix.com

# ==========================================
# FRONTEND URL (untuk CORS)
# ==========================================
FRONTEND_URL=https://strategix.com

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=strategix_production
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_db_password

# ==========================================
# SESSION & CACHE
# ==========================================
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_DOMAIN=.strategix.com

CACHE_DRIVER=file
QUEUE_CONNECTION=database

# ==========================================
# SANCTUM (API Authentication)
# ==========================================
SANCTUM_STATEFUL_DOMAINS=strategix.com,www.strategix.com
SESSION_DOMAIN=.strategix.com

# ==========================================
# LOGGING
# ==========================================
LOG_CHANNEL=stack
LOG_LEVEL=error
LOG_DEPRECATIONS_CHANNEL=null

# ==========================================
# MAIL CONFIGURATION
# ==========================================
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@strategix.com
MAIL_FROM_NAME="${APP_NAME}"

# ==========================================
# FILESYSTEM (Storage)
# ==========================================
FILESYSTEM_DISK=public

# ==========================================
# WHATSAPP API (optional)
# ==========================================
WHATSAPP_API_URL=your_whatsapp_api_url
WHATSAPP_API_TOKEN=your_whatsapp_token

# ==========================================
# SINGAPAY PAYMENT GATEWAY (optional)
# ==========================================
SINGAPAY_API_URL=https://api.singapay.id
SINGAPAY_MERCHANT_ID=your_merchant_id
SINGAPAY_API_KEY=your_api_key
SINGAPAY_SECRET_KEY=your_secret_key
```

**⚠️ PENTING:**
1. Generate APP_KEY baru dengan: `php artisan key:generate`
2. Set `APP_DEBUG=false` untuk production (keamanan)
3. Ganti semua password/token dengan nilai production yang aman
4. Pastikan `APP_URL` dan `FRONTEND_URL` sesuai domain production

---

### 2.2 File `config/cors.php`

**Lokasi**: `backend/config/cors.php`

Update konfigurasi CORS untuk production:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'https://strategix.com'),
        'https://www.strategix.com', // jika ada www subdomain
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

---

### 2.3 File `config/sanctum.php`

**Lokasi**: `backend/config/sanctum.php`

```php
<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'strategix.com')),

    'guard' => ['web'],

    'expiration' => null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],
];
```

---

### 2.4 File `config/app.php`

**Lokasi**: `backend/config/app.php`

Update URL settings:

```php
'url' => env('APP_URL', 'https://api.strategix.com'),

'asset_url' => env('ASSET_URL', 'https://api.strategix.com'),
```

---

### 2.5 File `.htaccess` (jika menggunakan Apache)

**Lokasi**: `backend/public/.htaccess`

Pastikan file ini ada dan berisi:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## 3. Konfigurasi Frontend (React)

### 3.1 File `.env` Production

**Lokasi**: `frontend/.env.production`

Buat file baru `.env.production`:

```env
# ==========================================
# BACKEND API URL
# ==========================================
VITE_API_URL=https://api.strategix.com

# ==========================================
# FRONTEND URL
# ==========================================
VITE_APP_URL=https://strategix.com

# ==========================================
# APPLICATION INFO
# ==========================================
VITE_APP_NAME="Grapadi Strategix"
VITE_APP_VERSION="1.3"

# ==========================================
# FEATURES (optional)
# ==========================================
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

**⚠️ PENTING:**
- Ganti `VITE_API_URL` dengan domain backend production Anda
- Vite menggunakan prefix `VITE_` untuk environment variables
- File ini akan otomatis digunakan saat `npm run build`

---

### 3.2 Update File `src/services/authApi.js`

**Lokasi**: `frontend/src/services/authApi.js`

Pastikan menggunakan environment variable:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ... rest of the code
```

---

### 3.3 Update Semua API Service Files

**File-file yang perlu diupdate:**

```
frontend/src/services/
├── authApi.js ✅
├── userApi.js ✅
├── businessPlan/
│   ├── businessPlanApi.js ✅
│   ├── marketAnalysisApi.js ✅
│   ├── financialPlanApi.js ✅
│   ├── marketingStrategyApi.js ✅
│   └── productServiceApi.js ✅
└── ManagementFinancial/
    ├── monthlyReportApi.js ✅
    ├── financialProjectionApi.js ✅
    ├── financialCategoryApi.js ✅
    ├── financialSummaryApi.js ✅
    └── combinedPdfApi.js ✅
```

**Pastikan semua menggunakan pattern:**

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

**Bukan hardcoded:**
```javascript
// ❌ SALAH - Jangan hardcode
const API_URL = 'http://localhost:8000';

// ✅ BENAR - Gunakan environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

### 3.4 File `vite.config.js`

**Lokasi**: `frontend/vite.config.js`

Pastikan konfigurasi build sudah benar:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemap untuk production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
});
```

---

## 4. Database Migration

### 4.1 Export Database dari Localhost

```bash
# Di laptop/local development
cd backend
php artisan db:seed --class=DatabaseSeeder  # Pastikan data seeder sudah lengkap

# Export database
mysqldump -u root -p strategix_local > strategix_backup.sql
```

### 4.2 Import Database ke Production

```bash
# Di server production (via SSH)
mysql -u your_db_username -p strategix_production < strategix_backup.sql
```

**Atau gunakan migration:**

```bash
# Di server production
cd /path/to/backend
php artisan migrate --force
php artisan db:seed --force  # Jika perlu seed data
```

---

## 5. File Storage & Upload

### 5.1 Symbolic Link untuk Storage

```bash
# Di server production
cd /path/to/backend
php artisan storage:link
```

Ini akan membuat symbolic link dari `storage/app/public` ke `public/storage`.

### 5.2 Permissions untuk Folder Storage

```bash
# Set permissions (di server production)
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
```

**Untuk CentOS/RHEL:**
```bash
chown -R nginx:nginx storage
chown -R nginx:nginx bootstrap/cache
```

### 5.3 Verifikasi Path Upload

**File-file yang menggunakan storage:**

1. **OperationalPlan.php** - Workflow diagram images
   ```php
   // Path: storage/app/public/workflow_diagrams/
   'workflow_image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
   ```

2. **BusinessBackground.php** - Logo perusahaan
   ```php
   // Path: storage/app/public/logos/
   'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
   ```

3. **ProductService.php** - Gambar produk
   ```php
   // Path: storage/app/public/products/
   'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
   ```

**⚠️ PENTING:**
- Pastikan folder `storage/app/public/` writable
- URL akses: `https://api.strategix.com/storage/workflow_diagrams/filename.png`
- Jika menggunakan CDN, update accessor di model untuk return CDN URL

---

## 6. CORS & Security

### 6.1 Security Headers (Nginx)

**Lokasi**: `/etc/nginx/sites-available/api.strategix.com`

```nginx
server {
    listen 443 ssl http2;
    server_name api.strategix.com;

    root /var/www/strategix/backend/public;
    index index.php;

    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # CORS Headers (jika diperlukan manual)
    add_header Access-Control-Allow-Origin "https://strategix.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept" always;
    add_header Access-Control-Allow-Credentials "true" always;

    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        return 204;
    }

    # PHP-FPM Configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### 6.2 Security Headers (Apache)

**Lokasi**: `backend/public/.htaccess`

Tambahkan di atas rules yang sudah ada:

```apache
# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "no-referrer-when-downgrade"

# CORS Headers
Header always set Access-Control-Allow-Origin "https://strategix.com"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Authorization, Content-Type, Accept"
Header always set Access-Control-Allow-Credentials "true"
```

---

## 7. Build & Deployment

### 7.1 Backend Deployment Steps

```bash
# 1. Upload files ke server (via FTP/Git/Rsync)
git clone https://github.com/pandustrr/SmartPlan-Web.git
cd SmartPlan-Web/backend

# 2. Install dependencies
composer install --no-dev --optimize-autoloader

# 3. Copy environment file
cp .env.example .env
nano .env  # Edit sesuai production settings

# 4. Generate application key
php artisan key:generate

# 5. Run migrations
php artisan migrate --force

# 6. Clear & cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Create storage link
php artisan storage:link

# 8. Set permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 7.2 Frontend Build & Deployment

```bash
# Di local machine
cd frontend

# 1. Install dependencies
npm install

# 2. Build untuk production
npm run build

# Output akan ada di folder: frontend/dist/

# 3. Upload folder dist/ ke server (via FTP/Rsync)
rsync -avz dist/ user@server:/var/www/strategix/frontend/

# Atau via Git (push ke repository, lalu pull di server)
git add .
git commit -m "Production build"
git push origin main

# Di server
cd /var/www/strategix/frontend
git pull origin main
npm install
npm run build
```

### 7.3 Nginx Configuration untuk Frontend

**Lokasi**: `/etc/nginx/sites-available/strategix.com`

```nginx
server {
    listen 443 ssl http2;
    server_name strategix.com www.strategix.com;

    root /var/www/strategix/frontend/dist;
    index index.html;

    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router - redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name strategix.com www.strategix.com;
    return 301 https://$server_name$request_uri;
}
```

### 7.4 Apache Configuration untuk Frontend

**Lokasi**: `/etc/apache2/sites-available/strategix.com.conf`

```apache
<VirtualHost *:443>
    ServerName strategix.com
    ServerAlias www.strategix.com
    DocumentRoot /var/www/strategix/frontend/dist

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/ssl/cert.pem
    SSLCertificateKeyFile /path/to/ssl/key.pem

    <Directory /var/www/strategix/frontend/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # React Router - redirect all requests to index.html
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
    </IfModule>

    # Cache static assets
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
    </IfModule>
</VirtualHost>

<VirtualHost *:80>
    ServerName strategix.com
    ServerAlias www.strategix.com
    Redirect permanent / https://strategix.com/
</VirtualHost>
```

---

## 8. Testing Production

### 8.1 Backend API Testing

```bash
# Test health check
curl https://api.strategix.com/api/health

# Test authentication endpoint
curl -X POST https://api.strategix.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test dengan authorization
curl https://api.strategix.com/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8.2 Frontend Testing

**Checklist:**
- ✅ Buka `https://strategix.com` - Halaman landing page muncul
- ✅ Login - Redirect ke dashboard setelah login berhasil
- ✅ API calls - Network tab di browser tidak ada error CORS
- ✅ Upload image - Workflow diagram / logo berhasil upload
- ✅ PDF export - Download PDF lengkap berhasil
- ✅ Dark mode - Toggle dark mode berfungsi
- ✅ Responsive - Tampilan di mobile/tablet baik

### 8.3 Common Issues

**Issue 1: CORS Error**
```
Access to XMLHttpRequest at 'https://api.strategix.com/api/login' from origin 'https://strategix.com' has been blocked by CORS policy
```
**Solution:**
- Cek `backend/config/cors.php` - pastikan `FRONTEND_URL` sudah benar
- Cek `backend/.env` - pastikan `FRONTEND_URL=https://strategix.com`
- Clear cache: `php artisan config:cache`

**Issue 2: 404 on React Routes**
```
Cannot GET /dashboard
```
**Solution:**
- Pastikan web server redirect semua request ke `index.html`
- Nginx: `try_files $uri $uri/ /index.html;`
- Apache: Enable `.htaccess` dengan `RewriteRule`

**Issue 3: Image Upload Tidak Muncul**
```
Storage symlink not found
```
**Solution:**
```bash
php artisan storage:link
chmod -R 775 storage
```

**Issue 4: PDF Download Gagal / Timeout**
```
Error: timeout of 120000ms exceeded
```
**Solution:**
- Cek logs: `tail -f storage/logs/laravel.log`
- Pastikan workflow images menggunakan data URL (bukan HTTP URL)
- Increase PHP max_execution_time di `php.ini`: `max_execution_time = 300`

---

## 9. Troubleshooting

### 9.1 Check Laravel Logs

```bash
# Di server production
cd /path/to/backend
tail -f storage/logs/laravel.log

# Cari error tertentu
grep "ERROR" storage/logs/laravel.log
grep "workflow" storage/logs/laravel.log
```

### 9.2 Clear All Cache

```bash
# Clear semua cache Laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 9.3 Check File Permissions

```bash
# Cek permissions
ls -la storage/
ls -la bootstrap/cache/

# Fix permissions jika perlu
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 9.4 Debug Mode (Temporary)

**Hanya untuk debugging, jangan permanent!**

```env
# backend/.env
APP_DEBUG=true
LOG_LEVEL=debug
```

Setelah selesai debug, kembalikan:
```env
APP_DEBUG=false
LOG_LEVEL=error
```

---

## 🔒 Checklist Keamanan Production

### Backend Security
- [ ] `APP_DEBUG=false` di `.env`
- [ ] `APP_ENV=production` di `.env`
- [ ] Generate `APP_KEY` baru dengan `php artisan key:generate`
- [ ] Database password menggunakan password yang kuat
- [ ] API rate limiting aktif
- [ ] HTTPS/SSL certificate terinstall
- [ ] File permissions sudah benar (775 untuk storage)
- [ ] `.env` file tidak ter-commit ke Git
- [ ] Backup database rutin (daily/weekly)

### Frontend Security
- [ ] Build production tanpa sourcemap (`sourcemap: false`)
- [ ] Remove console.log di production
- [ ] Environment variables tidak mengandung sensitive data
- [ ] HTTPS enforced (redirect HTTP ke HTTPS)
- [ ] Security headers sudah di-set (X-Frame-Options, CSP, dll)

### Monitoring
- [ ] Setup error monitoring (Sentry / Bugsnag)
- [ ] Setup uptime monitoring (UptimeRobot / Pingdom)
- [ ] Setup log rotation untuk Laravel logs
- [ ] Setup backup automation

---

## 📞 Support & Dokumentasi

**Dokumentasi Terkait:**
- [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - Struktur project lengkap
- [COMBINED_PDF_EXPORT.md](../COMBINED_PDF_EXPORT.md) - Dokumentasi PDF export
- [EXPORT_PDF_FINANCIAL_REPORT.md](../EXPORT_PDF_FINANCIAL_REPORT.md) - Financial report

**Laravel Deployment:**
- https://laravel.com/docs/11.x/deployment
- https://laravel.com/docs/11.x/configuration

**Vite Production Build:**
- https://vitejs.dev/guide/build.html
- https://vitejs.dev/guide/env-and-mode.html

---

## ✅ Checklist Deployment

### Pre-Deployment
- [ ] Backup database localhost
- [ ] Test semua fitur di localhost (login, upload, PDF export)
- [ ] Review `.env.production` untuk frontend
- [ ] Review `.env` untuk backend
- [ ] Update CORS settings

### Deployment
- [ ] Upload backend files ke server
- [ ] Install composer dependencies
- [ ] Setup `.env` di server
- [ ] Run migrations
- [ ] Create storage symlink
- [ ] Set file permissions
- [ ] Build frontend (`npm run build`)
- [ ] Upload frontend dist/ ke server
- [ ] Configure web server (Nginx/Apache)
- [ ] Setup SSL certificate

### Post-Deployment
- [ ] Test API endpoints
- [ ] Test frontend pages
- [ ] Test authentication flow
- [ ] Test file upload
- [ ] Test PDF export
- [ ] Check browser console for errors
- [ ] Monitor Laravel logs
- [ ] Setup monitoring & alerts

---

**Selamat! Aplikasi Anda sekarang berjalan di production! 🎉**

*Dokumentasi ini dibuat pada 17 Desember 2025*  
*Versi Aplikasi: v1.3*  
*Repository: SmartPlan-Web (branch-pandu)*
