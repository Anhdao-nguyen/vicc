# 🎯 DataCore Factory - Tóm tắt các lỗi đã sửa

## ❌ CÁC VẤN ĐỀ PHÁT HIỆN

### 1. **Port Configuration - SAI NGHIÊM TRỌNG**
```
❌ Backend: PORT=3306 (MySQL port - KHÔNG THỂ CHẠY!)
❌ Frontend: API_URL=http://localhost:3306/api
❌ Kết quả: Backend không thể start vì port 3306 đã bị MySQL chiếm
```

### 2. **CORS & 403 Forbidden Error**
```
❌ Helmet CSP chặn requests từ frontend
❌ CORS config chưa đầy đủ (thiếu methods, headers)
```

### 3. **500 Internal Server Error**
```
❌ Controller gọi: ShellingSample.findByBatch()
❌ Model có: ShellingSample.findByLot()
❌ Kết quả: API /api/shelling-samples/batch/:batchNo bị lỗi
```

---

## ✅ CÁC FIX ĐÃ THỰC HIỆN

### 1. **Fix Port Configuration**

#### File: `backend/.env`
```diff
- PORT=3306
+ PORT=5000
```

#### File: `backend/.env.example`
```diff
- PORT=3306
+ PORT=5000
```

#### File: `backend/src/server.js`
```diff
- const PORT = process.env.PORT || 3306;
+ const PORT = process.env.PORT || 5000;
```

#### File: `datacore-factory/.env.example`
```diff
- VITE_API_URL=http://localhost:3306/api
+ VITE_API_URL=http://localhost:5000/api
```

### 2. **Fix CORS & Helmet Configuration**

#### File: `backend/src/server.js`
```javascript
// ✅ ĐÃ FIX
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP để tránh 403 trong dev
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));
```

### 3. **Fix API Method Mismatch**

#### File: `backend/src/controllers/shellingSampleController.js`
```diff
export const getSamplesByBatch = async (req, res) => {
  try {
    const { batchNo } = req.params;
-   const samples = await ShellingSample.findByBatch(batchNo);
+   const samples = await ShellingSample.findByLot(batchNo);

    res.json({
      success: true,
      count: samples.length,
      data: samples,
    });
  } catch (error) {
    // ...
  }
};
```

---

## 🎯 CẤU HÌNH CHÍNH XÁC

### Backend Configuration

**File:** `backend/.env`
```env
# ⚙️ Server Configuration
PORT=5000                                 # Web server port
NODE_ENV=development

# 🗄️ MySQL Database Configuration
DB_HOST=vnicc-lxwb001vh.isrk.local       # MySQL server
DB_PORT=3306                              # MySQL port (KHÔNG phải backend port!)
DB_DATABASE=tripsmgm-mydb002
DB_USER=tripsmgm-rndus2
DB_PASSWORD=wXKBvt0SRytjvER4e2Hp

# 🔐 JWT Configuration
JWT_SECRET=datacore-secret-key-change-in-production-2024
JWT_EXPIRE=24h

# 🌐 CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration

**File:** `datacore-factory/.env`
```env
# 🔗 Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────────────────────────────────────┐
│                    DATACORE FACTORY                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   FRONTEND       │         │    BACKEND       │         │   MYSQL DB       │
│   (React)        │◄───────►│   (Node.js)      │◄───────►│                  │
│                  │         │                  │         │                  │
│ localhost:5173   │         │ localhost:5000   │         │ :3306            │
│                  │         │                  │         │                  │
│ VITE_API_URL     │   HTTP  │ /api/shelling-   │  MySQL  │ PT_QC_Shelling   │
│ =localhost:5000  │   CORS  │  samples         │  Pool   │  Samples         │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

### Port Mapping

| Component | Port | Protocol | Description |
|-----------|------|----------|-------------|
| Frontend | 5173 | HTTP | Vite dev server |
| Backend API | 5000 | HTTP | Express server |
| MySQL Database | 3306 | TCP | MySQL connection |

---

## 🚀 CÁCH CHẠY

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

✅ Backend chạy tại: `http://localhost:5000`
✅ Health check: `http://localhost:5000/health`

### 2. Start Frontend
```bash
cd datacore-factory
npm install
npm run dev
```

✅ Frontend chạy tại: `http://localhost:5173`

---

## 🧪 TESTING

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-19T...",
  "uptime": 123.45
}
```

### 2. Test API Endpoint
```bash
curl http://localhost:5000/api/shelling-samples
```

Expected response:
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### 3. Test Frontend
- Mở browser: `http://localhost:5173`
- Kiểm tra console (F12) - KHÔNG CÒN LỖI CORS
- Kiểm tra Network tab - Status 200 OK

---

## 📝 API ENDPOINTS

### Shelling Samples API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shelling-samples` | Lấy tất cả samples |
| GET | `/api/shelling-samples/:id` | Lấy sample theo ID |
| POST | `/api/shelling-samples` | Tạo sample mới |
| PUT | `/api/shelling-samples/:id` | Cập nhật sample |
| DELETE | `/api/shelling-samples/:id` | Xóa sample |
| GET | `/api/shelling-samples/statistics` | Lấy thống kê |
| GET | `/api/shelling-samples/batch/:batchNo` | Lấy theo batch/lot |

### Query Parameters
- `lot`: Filter by lot number
- `nguonGoc`: Filter by origin
- `line`: Filter by production line
- `size`: Filter by size

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Port Confusion
```
❌ SAI: Backend port = 3306 (đây là MySQL port!)
✅ ĐÚNG: Backend port = 5000, MySQL port = 3306
```

### 2. Environment Files
```
✅ .env - Chứa config thực tế (KHÔNG commit)
✅ .env.example - Template (commit lên Git)
```

### 3. CORS trong Production
```javascript
// Development
CORS_ORIGIN=http://localhost:5173

// Production
CORS_ORIGIN=https://your-production-domain.com
```

### 4. Database Table Mapping

**Backend Model Fields** ➜ **Database Columns**
- `findByLot()` ➜ `Lot` column
- `findAll()` ➜ `PT_QC_ShellingSamples` table
- Filters: lot, nguonGoc, line, size

---

## 🔍 TROUBLESHOOTING

### Lỗi: "EADDRINUSE :::3306"
```
❌ Nguyên nhân: Port 3306 đã bị MySQL chiếm
✅ Giải pháp: Đổi backend PORT=5000
```

### Lỗi: "CORS policy blocked"
```
❌ Nguyên nhân: Helmet CSP hoặc CORS config sai
✅ Giải pháp: Đã fix trong server.js
```

### Lỗi: "500 Internal Server Error"
```
❌ Nguyên nhân: findByBatch() không tồn tại
✅ Giải pháp: Đã fix thành findByLot()
```

### Lỗi: "Cannot connect to database"
```
❌ Nguyên nhân: DB credentials sai hoặc MySQL server down
✅ Giải pháp: Kiểm tra .env và MySQL server status
```

---

## ✅ CHECKLIST

- [x] Backend port đổi từ 3306 → 5000
- [x] Frontend API URL cập nhật → localhost:5000
- [x] CORS configuration đã fix
- [x] Helmet CSP disabled cho development
- [x] API method mismatch đã sửa (findByBatch → findByLot)
- [x] .env files đã cập nhật
- [x] Database connection config đúng

---

**Ngày fix:** 2025-01-19
**Status:** ✅ Tất cả lỗi đã được sửa
**Next steps:** Test trên production environment
