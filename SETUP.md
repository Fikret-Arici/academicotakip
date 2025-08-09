# 🚀 Academico Kurulum Rehberi

## 📋 Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

## 🔧 Kurulum Adımları

### 1. Proje Bağımlılıklarını Yükle
```bash
npm install
```

### 2. JSON Server'ı Global Olarak Yükle
```bash
npm install -g json-server
```

### 3. Çoklu Kullanıcı Sistemi İçin İki Terminal Aç

**Terminal 1 - JSON Server (Veritabanı):**
```bash
npm run server
```
Bu komut `http://localhost:3001` adresinde JSON Server'ı başlatır.

**Terminal 2 - React Uygulaması:**
```bash
npm run dev
```
Bu komut `http://localhost:5173` adresinde React uygulamasını başlatır.

## 🌐 Çoklu Kullanıcı Testi

1. **JSON Server çalışıyor mu kontrol et:**
   - Tarayıcıda `http://localhost:3001/students` adresini aç
   - JSON verilerini görmelisiniz

2. **React uygulamasını test et:**
   - `http://localhost:5173` adresini aç
   - Öğrenci/Koç ekleme işlemlerini dene

3. **Çoklu tarayıcı testi:**
   - Farklı tarayıcılarda aynı adresi aç
   - Birinde eklediğin veri diğerinde de görünmeli
   - Sayfayı yenile veya F5 tuşuna bas

## 🔄 Nasıl Çalışır?

### LocalStorage (ESKİ) ❌
- Sadece o tarayıcıda çalışırdı
- Başka tarayıcıdan erişilemezdi

### JSON Server (YENİ) ✅
- `db.json` dosyası merkezi veritabanı
- REST API olarak çalışır
- Tüm tarayıcılar aynı veriyi görür
- Gerçek zamanlı güncelleme

## 📁 Dosya Yapısı

```
📦 ACADEMİCOTAKIP/
├── 📄 db.json                 # Merkezi veritabanı
├── 📁 src/
│   ├── 📁 services/
│   │   └── 📄 apiService.ts    # JSON Server API
│   └── 📁 context/
│       └── 📄 AppContext.tsx   # API entegrasyonu
└── 📄 package.json
```

## 🎯 Test Senaryosu

1. **İlk tarayıcıda (Chrome):**
   - Yeni öğrenci ekle: "Ahmet Yılmaz"

2. **İkinci tarayıcıda (Firefox):**
   - Sayfayı yenile (F5)
   - "Ahmet Yılmaz" görünmeli

3. **Üçüncü tarayıcıda (Edge):**
   - Aynı adresi aç
   - Tüm veriler görünmeli

## 🚨 Sorun Giderme

### "JSON Server çalışmıyor" Hatası
```bash
# Terminal 1'de JSON Server'ı başlat
npm run server
```

### Veriler Güncellenmiyor
1. JSON Server çalışıyor mu kontrol et: `http://localhost:3001/students`
2. React uygulamasını yenile: F5
3. Browser cache'i temizle: Ctrl+Shift+Delete

### Port Çakışması
```bash
# Farklı port kullan
json-server --watch db.json --port 3002
```

## 📊 API Endpoints

- `GET /students` - Tüm öğrenciler
- `POST /students` - Yeni öğrenci
- `PUT /students/:id` - Öğrenci güncelle
- `DELETE /students/:id` - Öğrenci sil
- `GET /coaches` - Tüm koçlar
- `POST /coaches` - Yeni koç

## 🎉 Başarı!

Artık sisteminiz:
✅ Çoklu tarayıcı destekli
✅ Gerçek zamanlı güncelleme
✅ Merkezi veritabanı
✅ REST API tabanlı

**Not:** Production ortamında JSON Server yerine gerçek bir veritabanı (PostgreSQL, MongoDB) kullanılmalıdır.
