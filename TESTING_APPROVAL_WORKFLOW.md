# HƯỚNG DẪN TEST APPROVAL WORKFLOW (KHÔNG CẦN LOGIN)

## 🎯 MỤC ĐÍCH
File này hướng dẫn test approval workflow **KHÔNG CẦN AUTHENTICATION** - dành cho testing nhanh.

---

## ⚠️ HIỆN TRẠNG

**Vấn đề:**
- App không có trang Login
- Không có JWT token
- Backend yêu cầu authentication cho `/api/pending-changes`

**Giải pháp tạm thời:**
- Đã tạo `pendingChanges.test.js` - routes không cần auth
- Server.js đang dùng test routes
- Có thể test toàn bộ flow mà không cần login

---

## 📋 FLOW LÀM VIỆC (CHI TIẾT)

### **BƯỚC 1: CHUẨN BỊ DATABASE**

Chạy SQL để tạo bảng `PT_QC_PendingChanges`:

```sql
CREATE TABLE PT_QC_PendingChanges (
    ChangeID INT AUTO_INCREMENT PRIMARY KEY,
    OriginalRecordID INT NOT NULL COMMENT 'ID của record trong PT_QC_ShellingSamples',
    ChangeType ENUM('UPDATE', 'DELETE') NOT NULL DEFAULT 'UPDATE',
    NewData JSON NOT NULL COMMENT 'Dữ liệu thay đổi dạng JSON',
    RequestedBy VARCHAR(100) NOT NULL COMMENT 'Username hoặc ID người request',
    RequestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ReviewedBy VARCHAR(100) NULL COMMENT 'Username hoặc ID người review',
    ReviewedAt DATETIME NULL,
    Status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    RejectReason VARCHAR(500) NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (Status),
    INDEX idx_original_record (OriginalRecordID),
    INDEX idx_requested_at (RequestedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Kiểm tra:**
```sql
SHOW TABLES LIKE 'PT_QC_%';
-- Phải thấy: PT_QC_ShellingSamples và PT_QC_PendingChanges
```

---

### **BƯỚC 2: KHỞI ĐỘNG SERVER**

```bash
cd backend
npm run dev
```

**Kiểm tra console log:**
```
✅ Database connection verified
🚀 Server running on port 5000
```

**Test health check:**
```bash
curl http://localhost:5000/health
# Response: {"status":"OK","timestamp":"...","uptime":...}
```

---

### **BƯỚC 3: TẠO DỮ LIỆU MẪU**

Trước tiên cần có data trong `PT_QC_ShellingSamples` để test:

```sql
-- Tạo 1 record mẫu
INSERT INTO PT_QC_ShellingSamples (
    Ngay, Ca, QC, Lot, NguonGoc, Line, Size, ThuTuMau, OutputValue,
    KhoiLuong, WholePct, BrokenBeGocPct, BeDoiVaManhPct, VetDaoPct,
    ShellPct, TotalBrokenPct, KetLuan, ChuThich
) VALUES (
    '2025-11-21', 'Ca 1', 'QC-User01', 'BATCH-001', 'Supplier A',
    'Line 1', 'Large', 1, 'Output-01',
    100.5, 85.2, 5.3, 4.1, 2.0,
    3.4, 11.4, 'Đạt', 'Sample test'
);

-- Lấy ID của record vừa tạo
SELECT ID, Lot, KhoiLuong, WholePct FROM PT_QC_ShellingSamples ORDER BY ID DESC LIMIT 1;
-- Ghi nhớ ID này (ví dụ: ID = 1)
```

---

### **BƯỚC 4: TEST API BẰNG CURL**

#### **A. Submit change for approval**

```bash
curl -X POST http://localhost:5000/api/pending-changes \
  -H "Content-Type: application/json" \
  -d '{
    "originalRecordId": 1,
    "changeType": "UPDATE",
    "newData": {
      "Lot": "BATCH-002-MODIFIED",
      "KhoiLuong": 125.75,
      "WholePct": 88.5
    }
  }'
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Change submitted for approval successfully",
  "data": {
    "ChangeID": 1,
    "OriginalRecordID": 1,
    "ChangeType": "UPDATE",
    "NewData": "{\"Lot\":\"BATCH-002-MODIFIED\",\"KhoiLuong\":125.75,\"WholePct\":88.5}",
    "Status": "PENDING",
    "RequestedBy": "unknown"
  }
}
```

#### **B. Xem danh sách pending changes**

```bash
curl http://localhost:5000/api/pending-changes
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "ChangeID": 1,
      "OriginalRecordID": 1,
      "ChangeType": "UPDATE",
      "NewData": "{...}",
      "Status": "PENDING",
      "Lot": "BATCH-001",
      "Line": "Line 1",
      ...
    }
  ]
}
```

#### **C. Approve change**

```bash
curl -X POST http://localhost:5000/api/pending-changes/1/approve \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Change approved and applied successfully",
  "data": {
    "ChangeID": 1,
    "Status": "APPROVED",
    "ReviewedBy": "unknown",
    "ReviewedAt": "2025-11-21 10:30:00"
  }
}
```

#### **D. Kiểm tra dữ liệu đã được cập nhật**

```sql
SELECT ID, Lot, KhoiLuong, WholePct FROM PT_QC_ShellingSamples WHERE ID = 1;
```

**Kết quả:**
```
ID | Lot                    | KhoiLuong | WholePct
1  | BATCH-002-MODIFIED     | 125.75    | 88.50
   ↑ ĐÃ THAY ĐỔI          ↑ ĐÃ THAY ĐỔI
```

---

### **BƯỚC 5: TEST TRÊN FRONTEND**

#### **A. Khởi động frontend**

```bash
cd datacore-factory
npm run dev
```

Mở browser: `http://localhost:5173`

#### **B. Vào trang Approvals**

1. Chọn **QC** module từ Home
2. Click menu **"✅ Duyệt thay đổi"** trong Sidebar
3. Hoặc truy cập trực tiếp: `http://localhost:5173/approvals`

#### **C. Kiểm tra trang hiển thị**

**Nếu thấy:**
```
✅ Statistics cards hiển thị (Tổng số, Chờ duyệt, etc.)
✅ Danh sách pending changes
✅ Filter tabs (ALL, PENDING, APPROVED, REJECTED)
```

**Nếu thấy lỗi:**
- Mở F12 Console → Kiểm tra lỗi
- Kiểm tra Network tab → Xem API call có thành công không

---

### **BƯỚC 6: TEST APPROVE/REJECT TRÊN UI**

#### **A. Xem chi tiết pending change**

1. Click **"Xem chi tiết"** trên 1 pending change
2. Modal hiển thị:
   - Before/After comparison (màu đỏ/xanh)
   - Thông tin người request
   - Buttons: Approve / Reject

#### **B. Approve**

1. Click **"✅ Approve"**
2. Confirm dialog → Click OK
3. Alert: "✅ Đã approve thay đổi thành công!"
4. Modal đóng
5. List refresh → Status = APPROVED

**Kiểm tra DB:**
```sql
SELECT * FROM PT_QC_PendingChanges WHERE ChangeID = 1;
-- Status = 'APPROVED'

SELECT Lot, KhoiLuong FROM PT_QC_ShellingSamples WHERE ID = 1;
-- Dữ liệu đã cập nhật
```

#### **C. Reject**

1. Click **"❌ Reject"**
2. Nhập lý do reject: "Dữ liệu không chính xác"
3. Click **"Xác nhận Reject"**
4. Alert: "✅ Đã reject thay đổi!"
5. Modal đóng
6. List refresh → Status = REJECTED

**Kiểm tra DB:**
```sql
SELECT * FROM PT_QC_PendingChanges WHERE ChangeID = 2;
-- Status = 'REJECTED'
-- RejectReason = 'Dữ liệu không chính xác'

SELECT Lot, KhoiLuong FROM PT_QC_ShellingSamples WHERE ID = 1;
-- Dữ liệu KHÔNG ĐỔI (vẫn là giá trị cũ)
```

---

## 🧪 TEST CASES ĐẦY ĐỦ

### **Test Case 1: Submit → Approve**

```bash
# 1. Submit change
curl -X POST http://localhost:5000/api/pending-changes \
  -H "Content-Type: application/json" \
  -d '{"originalRecordId": 1, "changeType": "UPDATE", "newData": {"Lot": "NEW-BATCH"}}'

# 2. Lấy ChangeID từ response (ví dụ: 3)

# 3. Approve
curl -X POST http://localhost:5000/api/pending-changes/3/approve
```

**Expected:**
- PT_QC_PendingChanges: Status = 'APPROVED'
- PT_QC_ShellingSamples: Lot = 'NEW-BATCH'

---

### **Test Case 2: Submit → Reject**

```bash
# 1. Submit change
curl -X POST http://localhost:5000/api/pending-changes \
  -H "Content-Type: application/json" \
  -d '{"originalRecordId": 1, "changeType": "UPDATE", "newData": {"KhoiLuong": 999.99}}'

# 2. Reject
curl -X POST http://localhost:5000/api/pending-changes/4/reject \
  -H "Content-Type: application/json" \
  -d '{"rejectReason": "Khối lượng không hợp lý"}'
```

**Expected:**
- PT_QC_PendingChanges: Status = 'REJECTED', RejectReason = 'Khối lượng không hợp lý'
- PT_QC_ShellingSamples: KhoiLuong = KHÔNG ĐỔI

---

### **Test Case 3: Multiple fields change**

```bash
curl -X POST http://localhost:5000/api/pending-changes \
  -H "Content-Type: application/json" \
  -d '{
    "originalRecordId": 1,
    "changeType": "UPDATE",
    "newData": {
      "Lot": "BATCH-MULTI-CHANGE",
      "KhoiLuong": 200.5,
      "WholePct": 90.0,
      "NguonGoc": "Supplier B"
    }
  }'
```

**Expected:**
- PendingChangeDiff hiển thị 4 fields thay đổi
- Sau approve: Tất cả 4 fields được cập nhật

---

## 🐛 TROUBLESHOOTING

### **Lỗi 1: "Table 'PT_QC_PendingChanges' doesn't exist"**

**Nguyên nhân:** Chưa chạy SQL tạo bảng

**Giải pháp:**
```sql
-- Chạy lại script tạo bảng ở BƯỚC 1
```

---

### **Lỗi 2: "Original record not found"**

**Nguyên nhân:** `originalRecordId` không tồn tại trong PT_QC_ShellingSamples

**Giải pháp:**
```sql
-- Kiểm tra ID có tồn tại không
SELECT ID FROM PT_QC_ShellingSamples LIMIT 10;

-- Dùng ID hợp lệ trong request
```

---

### **Lỗi 3: Frontend không hiển thị data**

**Nguyên nhân:** API call failed

**Giải pháp:**
1. Mở F12 Console
2. Xem tab Network
3. Kiểm tra request `/api/pending-changes`:
   - Status code: 200 OK?
   - Response có data?

4. Nếu CORS error:
   ```bash
   # Kiểm tra backend .env
   CORS_ORIGIN=http://localhost:5173
   ```

5. Nếu 401 Unauthorized:
   - Kiểm tra `server.js` đang dùng `pendingChanges.test.js` (không auth)
   - Restart backend server

---

### **Lỗi 4: Approve không cập nhật data**

**Nguyên nhân:** Model PendingChange.approve() có lỗi

**Giải pháp:**
```sql
-- Kiểm tra log backend console
-- Xem có error gì không

-- Kiểm tra Status có chuyển thành APPROVED không
SELECT * FROM PT_QC_PendingChanges WHERE ChangeID = X;

-- Nếu Status = APPROVED nhưng data không đổi:
-- Kiểm tra backend/src/models/PendingChange.js line ~150
```

---

## 📊 SQL QUERIES HỮU ÍCH

### **Xem tất cả pending changes**
```sql
SELECT
    pc.ChangeID,
    pc.OriginalRecordID,
    pc.ChangeType,
    pc.NewData,
    pc.Status,
    pc.RequestedBy,
    pc.RequestedAt,
    s.Lot AS CurrentLot,
    s.KhoiLuong AS CurrentKhoiLuong
FROM PT_QC_PendingChanges pc
LEFT JOIN PT_QC_ShellingSamples s ON pc.OriginalRecordID = s.ID
ORDER BY pc.RequestedAt DESC;
```

### **Xem statistics**
```sql
SELECT
    COUNT(*) AS Total,
    SUM(CASE WHEN Status = 'PENDING' THEN 1 ELSE 0 END) AS Pending,
    SUM(CASE WHEN Status = 'APPROVED' THEN 1 ELSE 0 END) AS Approved,
    SUM(CASE WHEN Status = 'REJECTED' THEN 1 ELSE 0 END) AS Rejected
FROM PT_QC_PendingChanges;
```

### **Xóa tất cả test data**
```sql
DELETE FROM PT_QC_PendingChanges;
-- Hoặc chỉ xóa test records
DELETE FROM PT_QC_PendingChanges WHERE RequestedBy = 'unknown';
```

---

## 🔄 FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│  APPROVAL WORKFLOW (Không Auth)                            │
└─────────────────────────────────────────────────────────────┘

1. USER SUBMIT CHANGE
   ├─ Frontend: Gọi pendingChangesAPI.create()
   ├─ Backend: POST /api/pending-changes
   ├─ Validation: Check originalRecordId exists
   └─ Database: INSERT PT_QC_PendingChanges (Status='PENDING')

2. LEADER XEM DANH SÁCH
   ├─ Frontend: GET /api/pending-changes
   ├─ Backend: PendingChange.findAll()
   └─ Display: PendingChangesList component

3. LEADER CLICK "XEM CHI TIẾT"
   ├─ Frontend: Hiển thị ApprovalModal
   ├─ Component: PendingChangeDiff (Before/After)
   └─ Actions: Approve / Reject buttons

4A. LEADER APPROVE
    ├─ Frontend: POST /api/pending-changes/:id/approve
    ├─ Backend: PendingChange.approve()
    ├─ Update: PT_QC_ShellingSamples (apply changes)
    └─ Update: PT_QC_PendingChanges (Status='APPROVED')

4B. LEADER REJECT
    ├─ Frontend: POST /api/pending-changes/:id/reject
    ├─ Backend: PendingChange.reject()
    └─ Update: PT_QC_PendingChanges (Status='REJECTED')
    └─ PT_QC_ShellingSamples: KHÔNG THAY ĐỔI
```

---

## ⏭️ BƯỚC TIẾP THEO: THÊM AUTHENTICATION

Khi muốn có hệ thống login đầy đủ, xem file: `ADDING_LOGIN_PAGE.md` (sẽ tạo riêng).

**Tóm tắt:**
1. Tạo trang Login
2. Lưu JWT token vào localStorage
3. Đổi lại dùng `pendingChanges.js` (có auth)
4. Phân quyền Leader/Admin

---

## ✅ CHECKLIST TEST

- [ ] Bảng PT_QC_PendingChanges đã tạo
- [ ] Backend server chạy (port 5000)
- [ ] Frontend chạy (port 5173)
- [ ] Test API bằng curl thành công
- [ ] Trang /approvals hiển thị OK
- [ ] Modal "Xem chi tiết" hoạt động
- [ ] PendingChangeDiff hiển thị Before/After
- [ ] Approve cập nhật database thành công
- [ ] Reject giữ nguyên dữ liệu gốc
- [ ] Statistics đúng (Pending/Approved/Rejected)

---

**Chúc bạn test thành công! 🎉**

Nếu gặp vấn đề, kiểm tra:
1. Backend console log
2. Frontend F12 Console
3. SQL queries để verify data
