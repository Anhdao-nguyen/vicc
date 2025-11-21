# 🔧 Hướng Dẫn Setup - Chức Năng Edit Shelling

## 📋 Tổng Quan

Đã thêm chức năng **Edit** cho trang Shelling và sửa lỗi hiển thị dữ liệu trong bảng.

### Vấn đề đã sửa:
- ❌ **Trước**: Table hiển thị "7 bản ghi" nhưng tất cả dữ liệu đều là "-"
- ✅ **Sau**: Dữ liệu hiển thị đầy đủ

### Nguyên nhân:
- Code sử dụng tên columns sai: `Date`, `Shift`, `QCName`
- Database thực tế có tên columns: `Ngay`, `Ca`, `QC`
- Field mapping không khớp → dữ liệu không hiển thị

---

## 🚀 CÁC BƯỚC CẦN THỰC HIỆN

### ⚠️ QUAN TRỌNG: Database đã có sẵn các columns!

Database của bạn đã có các columns:
- ✅ `Ngay` (DATE) - Ngày
- ✅ `Ca` (NVARCHAR) - Ca làm việc
- ✅ `QC` (NVARCHAR) - Tên QC

**KHÔNG CẦN CHẠY MIGRATION!** Code đã được sửa để sử dụng đúng tên columns.

---

### **Bước 1: Pull Code Mới**

```bash
git pull origin claude/add-shelling-edit-button-01XYQt84zgSfoc7D1axJvjUa
```

---

### **Bước 2: Restart Backend Server**

```bash
# Trong terminal backend:
# Ctrl + C để stop
npm start
```

---

### **Bước 3: Kiểm Tra Frontend** ✅

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
1. **`backend/src/models/ShellingSample.js`** *(MODIFIED)*
   - SELECT query: Sử dụng Ngay, Ca, QC (tên columns đúng)
   - INSERT query: Sử dụng Ngay, Ca, QC
   - UPDATE query: Sử dụng Ngay, Ca, QC

### **Frontend:**
1. **`datacore-factory/src/utils/fieldMapping.js`** *(MODIFIED)*
   - `dbToFrontend`: Map Ngay→date, Ca→shift, QC→qcName
   - `frontendToDb`: Map ngược lại
   - Sử dụng đúng tên columns từ database

2. **`datacore-factory/src/components/shelling/ShellingEditModal.jsx`** *(NEW)*
   - Modal component để edit record

3. **`datacore-factory/src/pages/Shelling.jsx`** *(MODIFIED)*
   - Thêm edit handlers
   - Thêm edit modal

4. **`datacore-factory/src/components/shelling/ShellingTable.jsx`** *(MODIFIED)*
   - Thêm onEdit callback

---

## 🔍 KIỂM TRA DATABASE

Database của bạn có các columns:

```sql
-- Xem dữ liệu mẫu
SELECT TOP 5
    ID, Ngay, Ca, QC, Lot, Line, Size
FROM PT_QC_ShellingSamples
ORDER BY ID DESC;
```

Các columns trong database:
- ✅ `Ngay` (DATE) - Ngày
- ✅ `Ca` (NVARCHAR) - Ca làm việc
- ✅ `QC` (NVARCHAR) - Tên QC

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Không cần chạy migration**
   - Database đã có sẵn columns Ngay, Ca, QC
   - Code đã được sửa để khớp với database

2. **Dữ liệu hiện tại**
   - Dữ liệu trong database đã đúng format
   - Chỉ cần restart backend để áp dụng code mới

---

## 📝 GHI CHÚ

- Database sử dụng columns: `Ngay`, `Ca`, `QC` (tiếng Việt không dấu)
- Frontend sử dụng: `date`, `shift`, `qcName` (tiếng Anh)
- fieldMapping.js xử lý việc convert giữa 2 bên
- Field `ChuThich` chỉ dùng để lưu **notes**
- Edit functionality đã hoạt động đầy đủ

---

## 🆘 TROUBLESHOOTING

### Vấn đề: Table vẫn hiển thị "-"
**Giải pháp:**
1. Kiểm tra đã pull code mới chưa
2. Restart backend server
3. Clear browser cache (Ctrl + Shift + R)
4. Check Network tab trong DevTools để xem API response
5. Verify backend trả về data với fields: Ngay, Ca, QC

### Vấn đề: Edit không hoạt động
**Giải pháp:**
1. Check backend API endpoint: `PUT /api/shelling-samples/:id`
2. Check console logs trong browser
3. Verify updateRecord function được gọi
4. Kiểm tra data mapping trong fieldMapping.js

### Vấn đề: "connect ECONNREFUSED"
**Giải pháp:** Database chưa chạy. Check file `.env` và start database.

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Backend logs: `npm start` trong terminal
2. Browser console: F12 > Console tab
3. Network requests: F12 > Network tab

---

**Chúc may mắn! 🎉**
