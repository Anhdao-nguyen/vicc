# Hướng dẫn Kết nối Database PT_QC_ShellingSamples

## Tổng quan
Project này đã được cấu hình để kết nối table `PT_QC_ShellingSamples` trên SQL Server với frontend (React) và backend (Node.js + Express).

## Cấu trúc Project

```
datacore-factoryworkspace/
├── backend/                          # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Cấu hình kết nối SQL Server
│   │   ├── models/
│   │   │   ├── User.js              # Model User
│   │   │   └── ShellingSample.js    # ✨ Model PT_QC_ShellingSamples (MỚI)
│   │   ├── controllers/
│   │   │   └── shellingSampleController.js  # ✨ Controller xử lý logic (MỚI)
│   │   ├── routes/
│   │   │   └── shellingSampleRoutes.js      # ✨ API Routes (MỚI)
│   │   └── server.js                # Server chính
│   ├── .env                         # ⚙️ Cấu hình môi trường (CẦN TẠO)
│   └── .env.example                 # Template file .env
│
└── datacore-factory/                # Frontend (React + Vite)
    ├── src/
    │   ├── services/
    │   │   └── api.js               # ✨ API Service để gọi backend (MỚI)
    │   ├── hooks/
    │   │   └── useShellingData.js   # ✨ Hook đã cập nhật để dùng API (UPDATED)
    │   └── pages/
    │       └── Shelling.jsx         # Trang Shelling
    ├── .env                         # ⚙️ Cấu hình môi trường (CẦN TẠO)
    └── .env.example                 # Template file .env
```

## Các bước cài đặt

### 1. Cấu hình Backend

#### a. Tạo file `.env` trong folder `backend/`

```bash
cd backend
cp .env.example .env
```

#### b. Cập nhật thông tin database trong file `.env`:

```env
# Server Configuration
PORT=3306
NODE_ENV=development

# Database Configuration - ⚠️ QUAN TRỌNG: Thay đổi thông tin này
DB_SERVER=your-sql-server-address        # Ví dụ: localhost hoặc 192.168.1.100
DB_PORT=3306
DB_DATABASE=your-database-name           # Tên database chứa table PT_QC_ShellingSamples
DB_USER=your-database-username           # Username SQL Server
DB_PASSWORD=your-database-password       # Password SQL Server
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

#### c. Cài đặt dependencies và chạy backend:

```bash
npm install
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3306`

### 2. Cấu hình Frontend

#### a. Tạo file `.env` trong folder `datacore-factory/`

```bash
cd datacore-factory
cp .env.example .env
```

#### b. Cập nhật file `.env`:

```env
# Backend API URL
VITE_API_URL=http://localhost:3306/api
```

#### c. Cài đặt dependencies và chạy frontend:

```bash
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## API Endpoints

Backend cung cấp các API endpoints sau:

### Shelling Samples API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/shelling-samples` | Lấy tất cả samples (có thể filter) |
| GET | `/api/shelling-samples/:id` | Lấy sample theo ID |
| POST | `/api/shelling-samples` | Tạo sample mới |
| PUT | `/api/shelling-samples/:id` | Cập nhật sample |
| DELETE | `/api/shelling-samples/:id` | Xóa sample |
| GET | `/api/shelling-samples/statistics` | Lấy thống kê |
| GET | `/api/shelling-samples/batch/:batchNo` | Lấy samples theo batch |

### Query Parameters cho GET `/api/shelling-samples`

- `startDate`: Lọc từ ngày (YYYY-MM-DD)
- `endDate`: Lọc đến ngày (YYYY-MM-DD)
- `batchNo`: Lọc theo batch number
- `shiftNo`: Lọc theo ca (1, 2, 3)
- `machineNo`: Lọc theo máy

### Ví dụ Request

#### 1. Lấy tất cả samples:
```javascript
GET http://localhost:3306/api/shelling-samples
```

#### 2. Lọc theo ngày:
```javascript
GET http://localhost:3306/api/shelling-samples?startDate=2025-01-01&endDate=2025-01-31
```

#### 3. Tạo sample mới:
```javascript
POST http://localhost:3306/api/shelling-samples
Content-Type: application/json

{
  "sampleDate": "2025-01-18",
  "batchNo": "BATCH001",
  "shiftNo": 1,
  "machineNo": "M01",
  "supplier": "Supplier A",
  "rawMaterialCode": "RM001",
  "moisture": 5.5,
  "wholeKernel": 85.2,
  "brokenKernel": 10.5,
  "shellContent": 2.3,
  "foreignMatter": 1.0,
  "totalDefects": 13.8,
  "remarks": "Sample notes"
}
```

## Cấu trúc Database

Table `PT_QC_ShellingSamples` cần có các columns sau:

```sql
- SampleID (INT, PRIMARY KEY, IDENTITY)
- SampleDate (DATE)
- BatchNo (VARCHAR)
- ShiftNo (INT)
- MachineNo (VARCHAR)
- Supplier (VARCHAR)
- RawMaterialCode (VARCHAR)
- Moisture (DECIMAL)
- WholeKernel (DECIMAL)
- BrokenKernel (DECIMAL)
- ShellContent (DECIMAL)
- ForeignMatter (DECIMAL)
- TotalDefects (DECIMAL)
- Remarks (VARCHAR)
- CreatedBy (VARCHAR)
- CreatedAt (DATETIME)
- UpdatedBy (VARCHAR)
- UpdatedAt (DATETIME)
```

## Sử dụng trong Frontend

Trong React components, bạn có thể sử dụng hook `useShellingData`:

```javascript
import { useShellingData } from '@/hooks/useShellingData';

function MyComponent() {
  const {
    records,        // Danh sách samples
    loading,        // Trạng thái loading
    error,          // Lỗi nếu có
    addRecord,      // Thêm sample mới
    updateRecord,   // Cập nhật sample
    removeRecord,   // Xóa sample
    loadRecords,    // Load lại data với filters
    refresh         // Refresh data
  } = useShellingData();

  // Sử dụng...
}
```

Hoặc gọi API trực tiếp:

```javascript
import { shellingSamplesAPI } from '@/services/api';

// Lấy tất cả samples
const response = await shellingSamplesAPI.getAll();

// Lấy với filter
const filtered = await shellingSamplesAPI.getAll({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  batchNo: 'BATCH001'
});

// Tạo mới
const newSample = await shellingSamplesAPI.create({
  sampleDate: '2025-01-18',
  batchNo: 'BATCH001',
  // ...
});
```

## Kiểm tra kết nối

### 1. Kiểm tra Backend

Truy cập: `http://localhost:3306/health`

Kết quả mong đợi:
```json
{
  "status": "OK",
  "timestamp": "2025-01-18T...",
  "uptime": 123.45
}
```

### 2. Kiểm tra API

Truy cập: `http://localhost:3306/api/shelling-samples`

Kết quả mong đợi:
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra thông tin `DB_SERVER`, `DB_USER`, `DB_PASSWORD` trong file `.env`
- Đảm bảo SQL Server đang chạy và cho phép remote connections
- Kiểm tra firewall có block port 3306 không

### CORS Error
- Đảm bảo `CORS_ORIGIN` trong backend `.env` khớp với URL frontend
- Mặc định: `http://localhost:5173`

### API không hoạt động
- Kiểm tra backend đang chạy tại port 3306
- Kiểm tra `VITE_API_URL` trong frontend `.env` đúng

## Lưu ý quan trọng

1. **File .env không được commit lên Git** - Chỉ commit file `.env.example`
2. **Thay đổi JWT_SECRET trong production** - Dùng một chuỗi phức tạp và bảo mật
3. **Database credentials** - Bảo mật thông tin đăng nhập database
4. **CORS** - Trong production, chỉ cho phép origin từ domain chính thức

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console logs của backend (`npm run dev`)
2. Browser console của frontend (F12)
3. Network tab để xem API requests

---

**Tác giả:** DataCore Team
**Ngày cập nhật:** 2025-01-18
