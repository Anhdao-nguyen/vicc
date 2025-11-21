# 🔧 Hướng Dẫn Migration - Thêm Chức Năng Edit Shelling

## 📋 Tổng Quan

Đã thêm chức năng **Edit** cho trang Shelling và sửa lỗi hiển thị dữ liệu trong bảng.

### Vấn đề đã sửa:
- ❌ **Trước**: Table hiển thị "7 bản ghi" nhưng tất cả dữ liệu đều là "-"
- ✅ **Sau**: Dữ liệu hiển thị đầy đủ với các column Date, Shift, QCName riêng biệt

### Nguyên nhân:
- Database không có các column riêng biệt cho Date, Shift, QCName
- Dữ liệu được lưu vào field `ChuThich` theo format: `"date - shift - qcName - notes"`
- Khi mapping dữ liệu, các field này không được extract đúng cách

---

## 🚀 CÁC BƯỚC CẦN THỰC HIỆN

### **Bước 1: Chạy Migration Script**

Migration script sẽ:
- Thêm 3 columns mới: `Date`, `Shift`, `QCName` vào bảng `PT_QC_ShellingSamples`
- Tạo indexes cho performance
- Tự động migrate dữ liệu cũ từ field `ChuThich` sang các column mới

```bash
# Đảm bảo database đang chạy
# Chạy migration:
cd backend
node src/scripts/addDateShiftQCColumns.js
```

**Kết quả mong đợi:**
```
🔄 Connecting to SQL Server...
🔄 Running migration to add Date, Shift, QCName columns...
✓ Column Date added
✓ Column Shift added
✓ Column QCName added
✓ Index on Date created
✓ Index on Shift created
✓ Index on QCName created
✓ Existing data migrated from ChuThich
✅ Migration completed successfully!
```

---

### **Bước 2: Restart Backend Server**

Sau khi chạy migration thành công:

```bash
# Dừng backend server (nếu đang chạy)
# Ctrl + C

# Khởi động lại
cd backend
npm start
```

---

### **Bước 3: Kiểm Tra Frontend**

1. Mở trình duyệt và truy cập trang Shelling
2. Kiểm tra bảng dữ liệu - các cột bây giờ phải hiển thị đầy đủ:
   - ✅ Ngày (Date)
   - ✅ Ca (Shift)
   - ✅ QC (QCName)
   - ✅ Lot, Origin, Line, Size...
   - ✅ Các % measurements

3. Test chức năng **Edit**:
   - Click nút 📝 (Edit) trên bất kỳ dòng nào
   - Modal xuất hiện với dữ liệu đã được fill sẵn
   - Chỉnh sửa và click "💾 Lưu thay đổi"
   - Kiểm tra dữ liệu đã được cập nhật

---

## 📁 CÁC FILE ĐÃ THAY ĐỔI

### **Backend:**
1. **`backend/src/scripts/addDateShiftQCColumns.js`** *(NEW)*
   - Migration script để thêm columns

2. **`backend/src/models/ShellingSample.js`** *(MODIFIED)*
   - SELECT query: Thêm Date, Shift, QCName
   - INSERT query: Thêm 3 parameters mới
   - UPDATE query: Thêm 3 fields mới

### **Frontend:**
1. **`datacore-factory/src/utils/fieldMapping.js`** *(MODIFIED)*
   - `dbToFrontend`: Map Date, Shift, QCName từ database
   - `frontendToDb`: Map ngược lại
   - Loại bỏ logic combine vào ChuThich

2. **`datacore-factory/src/components/shelling/ShellingEditModal.jsx`** *(NEW)*
   - Modal component để edit record

3. **`datacore-factory/src/pages/Shelling.jsx`** *(MODIFIED)*
   - Thêm edit handlers
   - Thêm edit modal

4. **`datacore-factory/src/components/shelling/ShellingTable.jsx`** *(MODIFIED)*
   - Thêm onEdit callback

---

## 🔍 KIỂM TRA DATABASE

Nếu muốn verify thủ công xem migration đã chạy thành công chưa:

```sql
-- Kiểm tra cấu trúc bảng
SELECT COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'PT_QC_ShellingSamples'
ORDER BY ORDINAL_POSITION;

-- Xem dữ liệu mẫu
SELECT TOP 5
    ID, [Date], [Shift], QCName, Lot, Line, Size
FROM PT_QC_ShellingSamples
ORDER BY ID DESC;
```

Bạn phải thấy các columns:
- ✅ `Date` (DATE)
- ✅ `Shift` (NVARCHAR(20))
- ✅ `QCName` (NVARCHAR(100))

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Backup Database Trước Khi Chạy Migration**
   ```bash
   # Khuyến nghị backup bảng PT_QC_ShellingSamples
   ```

2. **Dữ Liệu Cũ**
   - Migration sẽ tự động migrate dữ liệu từ ChuThich
   - Format trong ChuThich: `"2024-01-15 - Ca 1 - Nguyen Van A - note"`
   - Các record không đúng format sẽ có NULL trong các column mới

3. **Rollback** (Nếu cần)
   ```sql
   -- Xóa các columns nếu có vấn đề
   ALTER TABLE PT_QC_ShellingSamples DROP COLUMN [Date];
   ALTER TABLE PT_QC_ShellingSamples DROP COLUMN [Shift];
   ALTER TABLE PT_QC_ShellingSamples DROP COLUMN QCName;
   ```

---

## 📝 GHI CHÚ

- Các record **MỚI** sẽ tự động lưu Date, Shift, QCName vào các column riêng biệt
- Field `ChuThich` bây giờ chỉ dùng để lưu **notes** thôi
- Edit functionality đã hoạt động đầy đủ sau khi migration

---

## 🆘 TROUBLESHOOTING

### Vấn đề: "connect ECONNREFUSED"
**Giải pháp:** Database chưa chạy. Check file `.env` và start database.

### Vấn đề: Table vẫn hiển thị "-"
**Giải pháp:**
1. Verify migration đã chạy thành công
2. Check backend logs
3. Refresh browser (Ctrl + Shift + R)
4. Check Network tab trong DevTools để xem API response

### Vấn đề: Edit không hoạt động
**Giải pháp:**
1. Check backend API endpoint: `PUT /api/shelling-samples/:id`
2. Check console logs trong browser
3. Verify updateRecord function được gọi

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Backend logs: `npm start` trong terminal
2. Browser console: F12 > Console tab
3. Network requests: F12 > Network tab

---

**Chúc may mắn! 🎉**
