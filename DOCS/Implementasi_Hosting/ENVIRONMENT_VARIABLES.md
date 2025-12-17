# 🔧 Environment Variables - Frontend

## 📁 File Environment

Project ini menggunakan 2 file environment berbeda untuk development dan production:

### 1. `.env.development` (Localhost)
Digunakan otomatis saat menjalankan `npm run dev`

```env
VITE_API_URL=http://localhost:8000
VITE_APP_URL=http://localhost:3000
VITE_ENABLE_DEBUG=true
```

### 2. `.env.production` (Hosting)
Digunakan otomatis saat menjalankan `npm run build`

```env
VITE_API_URL=https://api.strategix.com
VITE_APP_URL=https://strategix.com
VITE_ENABLE_DEBUG=false
```

---

## 🚀 Cara Penggunaan

### Development (Localhost)
```bash
npm run dev
# Otomatis menggunakan .env.development
# API calls akan ke: http://localhost:8000/api
```

### Production Build
```bash
npm run build
# Otomatis menggunakan .env.production
# API calls akan ke: https://api.strategix.com/api
```

### Preview Production Build
```bash
npm run preview
# Preview hasil build production di localhost
```

---

## 📝 Environment Variables Tersedia

| Variable | Development | Production | Deskripsi |
|----------|-------------|------------|-----------|
| `VITE_API_URL` | `http://localhost:8000` | `https://api.strategix.com` | URL Backend API |
| `VITE_APP_URL` | `http://localhost:3000` | `https://strategix.com` | URL Frontend |
| `VITE_APP_NAME` | `"Grapadi Strategix"` | `"Grapadi Strategix"` | Nama Aplikasi |
| `VITE_APP_VERSION` | `"1.3"` | `"1.3"` | Versi Aplikasi |
| `VITE_ENABLE_ANALYTICS` | `false` | `true` | Enable Analytics |
| `VITE_ENABLE_DEBUG` | `true` | `false` | Enable Debug Mode |

---

## 🔍 Cara Mengakses di Code

### JavaScript/JSX
```javascript
// Mengakses environment variable
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
const isDebug = import.meta.env.VITE_ENABLE_DEBUG;

console.log('API URL:', apiUrl);
```

### Dalam API Service
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## ⚠️ Penting!

1. **Prefix `VITE_`** - Semua environment variable HARUS dimulai dengan `VITE_` agar bisa diakses di frontend
2. **Tidak perlu restart** - Perubahan file `.env` membutuhkan restart dev server
3. **Git Ignore** - File `.env.local` sudah ada di `.gitignore`, tidak akan ter-commit
4. **Custom Environment** - Buat file `.env.local` untuk override setting personal

---

## 📂 File-file yang Sudah Menggunakan Environment Variable

### ✅ API Services (Sudah Dikonfigurasi)

1. **authApi.js** 
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
   ```

2. **financialSimulationApi.js**
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   const API_BASE_URL = `${API_URL}/api/management-financial/simulations`;
   ```

3. **forecastApi.js**
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   const API_BASE_URL = `${API_URL}/api/management-financial/forecast`;
   ```

4. **affiliateAPI.js**
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
   ```

5. **publicAffiliateApi.js**
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
   ```

### ✅ Business Plan APIs (Menggunakan authApi)
- backgroundApi.js ✅
- marketAnalysisApi.js ✅
- financialPlanApi.js ✅
- marketingStrategiesApi.js ✅
- operationalPlanApi.js ✅
- productServiceApi.js ✅
- teamStructureApi.js ✅
- pdfBusinessPlanApi.js ✅

### ✅ Management Financial APIs (Menggunakan authApi)
- combinedPdfApi.js ✅
- financialProjectionApi.js ✅
- managementFinancialApi.js ✅
- monthlyReportApi.js ✅

### ✅ User API (Menggunakan authApi)
- userApi.js ✅

**Total: 20+ file API sudah dikonfigurasi dengan environment variable! ✅**

---

## 🧪 Testing Environment

### Cek Environment Variable Aktif
Tambahkan di component untuk debug:

```javascript
useEffect(() => {
  console.log('Environment:', import.meta.env.MODE); // 'development' atau 'production'
  console.log('API URL:', import.meta.env.VITE_API_URL);
}, []);
```

### Test API Connection
```javascript
// Test di browser console
fetch(import.meta.env.VITE_API_URL + '/api/health')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

---

## 🔄 Migration dari Hardcoded ke Environment Variable

### ❌ Sebelum (Hardcoded)
```javascript
const API_BASE_URL = "http://localhost:8000/api";
```

### ✅ Sesudah (Environment Variable)
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

---

## 📚 Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Environment Variables](https://vitejs.dev/guide/env-and-mode.html#env-files)
- [Deployment Documentation](../Implementasi_Hosting/DEPLOYMENT_PRODUCTION.md)

---

**Last Updated:** December 17, 2025  
**Version:** 1.3
