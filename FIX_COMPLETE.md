# ✅ ĐÃ SỬA XONG TẤT CẢ LỖI 500

## 📋 DANH SÁCH LỖI ĐÃ PHÁT HIỆN VÀ SỬA

### ❌ LỖI 1: API_BASE_URL SAI PORT
**File:** `datacore-factory/src/services/api.js:2`

**Vấn đề:**
- Đang dùng port **3306** (MySQL port) thay vì **5000** (Backend API port)
- `const API_BASE_URL = 'http://localhost:3306/api'`

**Đã sửa:**
```javascript
const API_BASE_URL = 'http://localhost:5000/api'
```

---

### ❌ LỖI 2: DATABASE SCHEMA KHÔNG KHỚP
**Files:**
- `backend/src/models/ShellingSample.js`
- `datacore-factory/src/utils/fieldMapping.js`

**Vấn đề:**
- Code đang dùng fields: `STT`, nhưng database có: `Ngay`, `Ca`, `QC`
- Field mapping không đúng với cấu trúc bảng thực tế

**Database schema thực tế:**
```
PT_QC_ShellingSamples:
- ID (int, auto_increment)
- Ngay (date) - Ngày
- Ca (varchar) - Ca làm việc
- QC (varchar) - Tên QC
- Lot (varchar)
- NguonGoc (varchar)
- Line (varchar)
- Size (varchar)
- ThuTuMau (int)
- OutputValue (varchar)
- KhoiLuong (decimal)
- WholePct (decimal)
- BrokenBeGocPct (decimal)
- BeDoiVaManhPct (decimal)
- VetDaoPct (decimal)
- ShellPct (decimal)
- TotalBrokenPct (decimal)
- KetLuan (varchar)
- ChuThich (varchar)
- CreatedAt (datetime)
- UpdatedAt (datetime)
```

**Đã sửa:**
1. ✅ Model `findAll()` - thêm fields Ngay, Ca, QC
2. ✅ Model `create()` - thêm fields Ngay, Ca, QC vào INSERT
3. ✅ Model `update()` - thêm fields Ngay, Ca, QC vào UPDATE
4. ✅ Field mapping - cập nhật:
   - `Ngay` → `date`
   - `Ca` → `shift`
   - `QC` → `qcName`

---

## 🚀 CÁCH CHẠY SAU KHI FIX

### Bước 1: Restart Backend
```bash
cd backend
npm start
```

Kiểm tra backend đã chạy thành công:
- ✅ Thấy message: "Server running on port 5000"
- ✅ Thấy message: "Database connection verified"

### Bước 2: Restart Frontend
```bash
cd datacore-factory
npm run dev
```

Kiểm tra frontend:
- ✅ Mở browser: http://localhost:5173
- ✅ Không còn lỗi 500 trong Console

### Bước 3: Test chức năng
1. Nhập dữ liệu vào form
2. Ấn Submit
3. Kiểm tra:
   - ✅ Không có lỗi 500
   - ✅ Data được lưu vào database
   - ✅ Table Review hiển thị dữ liệu mới

---

## 🔍 KIỂM TRA DATABASE

Chạy query để xem data:
```sql
SELECT * FROM PT_QC_ShellingSamples ORDER BY ID DESC LIMIT 10;
```

---

## 📝 FILES ĐÃ THAY ĐỔI

1. ✅ `datacore-factory/src/services/api.js` - Sửa port từ 3306 → 5000
2. ✅ `backend/src/models/ShellingSample.js` - Thêm Ngay, Ca, QC vào queries
3. ✅ `datacore-factory/src/utils/fieldMapping.js` - Cập nhật field mapping
4. 📄 `backend/database/create-shelling-table.sql` - SQL tạo bảng (reference)
5. 📄 `backend/database/setup-database.js` - Script setup database (đã chạy)

---

## ✅ KẾT QUẢ

- ✅ API port đã đúng: **5000**
- ✅ Database schema đã khớp với code
- ✅ Field mapping đã chính xác
- ✅ Bảng `PT_QC_ShellingSamples` đã tồn tại với đầy đủ cột

**Bây giờ có thể chạy app bình thường!** 🎉
