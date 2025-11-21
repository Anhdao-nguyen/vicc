# HƯỚNG DẪN TÍCH HỢP APPROVAL WORKFLOW

Tài liệu này hướng dẫn cách tích hợp workflow **"Edit → Submit for Approval → Leader Approve/Reject"** vào ứng dụng VICC.

---

## 📋 TỔNG QUAN

### Đã hoàn thành:

✅ **Backend:**
- Model: `PendingChange.js`
- Controller: `pendingChangesController.js`
- Routes: `/api/pending-changes`
- Database: Bảng `PT_QC_PendingChanges`

✅ **Frontend:**
- API Service: `pendingChangesAPI`
- Components: `PendingChangesList`, `ApprovalModal`, `PendingChangeDiff`
- Page: `PendingApprovals` (route: `/approvals`)
- Sidebar: Đã thêm menu "Duyệt thay đổi"

### Cần tích hợp thêm:

⚠️ **Chức năng Edit trong ShellingTable** - Hiện tại chỉ có Delete

---

## 🗄️ 1. DATABASE

### Tạo bảng PT_QC_PendingChanges:

```sql
CREATE TABLE PT_QC_PendingChanges (
    ChangeID INT AUTO_INCREMENT PRIMARY KEY,
    OriginalRecordID INT NOT NULL COMMENT 'ID của record trong PT_QC_ShellingSamples',
    ChangeType ENUM('UPDATE', 'DELETE') NOT NULL DEFAULT 'UPDATE',

    -- Dữ liệu mới (JSON string)
    NewData JSON NOT NULL COMMENT 'Dữ liệu thay đổi dạng JSON',

    -- Thông tin người request (lưu ID hoặc username)
    RequestedBy VARCHAR(100) NOT NULL COMMENT 'Username hoặc ID người request',
    RequestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Thông tin người review
    ReviewedBy VARCHAR(100) NULL COMMENT 'Username hoặc ID người review',
    ReviewedAt DATETIME NULL,

    -- Trạng thái
    Status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    RejectReason VARCHAR(500) NULL,

    -- Timestamps
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_status (Status),
    INDEX idx_original_record (OriginalRecordID),
    INDEX idx_requested_at (RequestedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chạy SQL này trong MySQL trước khi test!**

---

## 🔌 2. API ENDPOINTS

### Backend API đã sẵn sàng:

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/pending-changes` | Lấy tất cả pending changes | ✅ JWT |
| GET | `/api/pending-changes/:id` | Lấy chi tiết 1 pending change | ✅ JWT |
| POST | `/api/pending-changes` | Submit change for approval | ✅ JWT |
| POST | `/api/pending-changes/:id/approve` | Approve change | ✅ JWT + Leader/Admin |
| POST | `/api/pending-changes/:id/reject` | Reject change | ✅ JWT + Leader/Admin |
| DELETE | `/api/pending-changes/:id` | Xóa pending change (chỉ PENDING) | ✅ JWT |
| GET | `/api/pending-changes/statistics` | Thống kê | ✅ JWT |

### Frontend API Service:

```javascript
import { pendingChangesAPI } from '@/services/api';

// Submit change for approval
const response = await pendingChangesAPI.create({
  originalRecordId: 123,
  changeType: 'UPDATE',
  newData: {
    Lot: 'NEW-BATCH-001',
    KhoiLuong: 150.5,
    WholePct: 85.2
  }
});

// Approve (Leader only)
await pendingChangesAPI.approve(changeId);

// Reject (Leader only)
await pendingChangesAPI.reject(changeId, 'Dữ liệu không chính xác');
```

---

## 🎨 3. TÍCH HỢP VÀO SHELLING FORM

### Option 1: Thêm chức năng Edit vào ShellingTable

**File:** `datacore-factory/src/components/shelling/ShellingTable.jsx`

```jsx
const ShellingTable = ({ data, onDelete, onEdit }) => {
  // ... existing code ...

  const handleEdit = (row) => {
    // Gọi callback onEdit từ parent component
    onEdit(row);
  }

  return (
    <Table
      columns={columns}
      data={mappedData}
      onDelete={handleDelete}
      onEdit={handleEdit}  // ← Thêm prop này
    />
  )
}
```

### Option 2: Tạo Edit Modal component

**File mới:** `datacore-factory/src/components/shelling/ShellingEditModal.jsx`

```jsx
import { useState } from 'react';
import { pendingChangesAPI } from '@/services/api';

const ShellingEditModal = ({ record, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    Lot: record.Lot,
    KhoiLuong: record.KhoiLuong,
    WholePct: record.WholePct,
    // ... other fields
  });

  const handleSubmitForApproval = async () => {
    try {
      await pendingChangesAPI.create({
        originalRecordId: record.ID,
        changeType: 'UPDATE',
        newData: formData
      });
      alert('✅ Đã gửi yêu cầu thay đổi!');
      onSuccess();
      onClose();
    } catch (error) {
      alert('❌ Lỗi: ' + error.message);
    }
  };

  return (
    <div className="modal">
      {/* Form fields */}
      <button onClick={handleSubmitForApproval}>
        📤 Gửi yêu cầu duyệt
      </button>
    </div>
  );
};
```

### Option 3: Modify ShellingForm để hỗ trợ Edit Mode

**File:** `datacore-factory/src/components/shelling/ShellingForm.jsx`

```jsx
const ShellingForm = ({ onSubmit, editingRecord = null, submitForApproval = false }) => {
  // Khởi tạo với editingRecord nếu có
  const [formData, setFormData] = useState(
    editingRecord || {
      date: getTodayDate(),
      shift: '',
      // ... other fields
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitForApproval && editingRecord) {
      // Submit for approval instead of direct update
      try {
        await pendingChangesAPI.create({
          originalRecordId: editingRecord.id,
          changeType: 'UPDATE',
          newData: mapFrontendToDb(formData) // Convert to DB format
        });
        alert('✅ Đã gửi yêu cầu duyệt!');
      } catch (error) {
        alert('❌ Lỗi: ' + error.message);
      }
    } else {
      // Normal submit
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... existing fields ... */}
      <button type="submit">
        {submitForApproval ? '📤 Gửi yêu cầu duyệt' : '✅ Lưu'}
      </button>
    </form>
  );
};
```

---

## 👥 4. PHÂN QUYỀN

### Backend đã xử lý:

- **Approve/Reject:** Chỉ role `admin` hoặc `leader` mới được phép
- **Submit change:** Tất cả authenticated users
- **View pending changes:** Tất cả authenticated users

### Frontend - Ẩn/hiện buttons dựa trên role:

```jsx
import { useState, useEffect } from 'react';

const MyComponent = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Lấy role từ localStorage hoặc API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
  }, []);

  const isLeader = userRole === 'admin' || userRole === 'leader';

  return (
    <div>
      {isLeader && (
        <Link to="/approvals">
          ✅ Duyệt thay đổi ({pendingCount})
        </Link>
      )}
    </div>
  );
};
```

---

## 🚀 5. WORKFLOW HOÀN CHỈNH

### Luồng làm việc:

```
1. User nhập/edit dữ liệu trong ShellingForm
   ↓
2. Thay vì lưu trực tiếp, click "Gửi yêu cầu duyệt"
   ↓
3. Frontend call API: POST /api/pending-changes
   {
     originalRecordId: 123,
     changeType: 'UPDATE',
     newData: {...}
   }
   ↓
4. Backend lưu vào PT_QC_PendingChanges với Status='PENDING'
   ↓
5. Leader vào trang /approvals
   ↓
6. Leader xem danh sách pending changes
   ↓
7. Leader click "Xem chi tiết" → Hiển thị ApprovalModal
   ↓
8. Leader xem diff (so sánh cũ/mới) trong PendingChangeDiff
   ↓
9A. Leader APPROVE:
    - Frontend call: POST /api/pending-changes/:id/approve
    - Backend UPDATE PT_QC_ShellingSamples với dữ liệu mới
    - Backend UPDATE PT_QC_PendingChanges SET Status='APPROVED'

9B. Leader REJECT:
    - Frontend call: POST /api/pending-changes/:id/reject
    - Backend UPDATE PT_QC_PendingChanges SET Status='REJECTED'
    - Dữ liệu gốc KHÔNG thay đổi
```

---

## 🧪 6. TESTING

### Test Backend API với cURL:

```bash
# 1. Login để lấy token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'

# Response: { "token": "eyJhbGc..." }

# 2. Submit change for approval
curl -X POST http://localhost:5000/api/pending-changes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "originalRecordId": 1,
    "changeType": "UPDATE",
    "newData": {
      "Lot": "TEST-BATCH-001",
      "KhoiLuong": 100.5
    }
  }'

# 3. Get all pending changes
curl -X GET http://localhost:5000/api/pending-changes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Approve change
curl -X POST http://localhost:5000/api/pending-changes/1/approve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 5. Reject change
curl -X POST http://localhost:5000/api/pending-changes/2/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"rejectReason": "Dữ liệu không chính xác"}'
```

### Test Frontend:

1. **Chạy backend:** `cd backend && npm run dev`
2. **Chạy frontend:** `cd datacore-factory && npm run dev`
3. **Truy cập:** http://localhost:5173
4. **Login** với tài khoản có role `admin` hoặc `leader`
5. **Vào trang:** http://localhost:5173/approvals
6. **Kiểm tra:**
   - Danh sách pending changes hiển thị đúng
   - Filter tabs hoạt động
   - Click "Xem chi tiết" mở modal
   - Diff hiển thị đúng
   - Approve/Reject thành công

---

## 📝 7. VÍ DỤ DATA FLOW

### Ví dụ 1: User edit Lot và KhoiLuong

**Original Data (PT_QC_ShellingSamples):**
```json
{
  "ID": 123,
  "Lot": "BATCH-001",
  "KhoiLuong": 100.5,
  "WholePct": 85.2,
  ...
}
```

**User muốn thay đổi:**
```json
{
  "Lot": "BATCH-002",      // Changed
  "KhoiLuong": 120.75      // Changed
}
```

**Submit for approval - NewData (JSON):**
```json
{
  "Lot": "BATCH-002",
  "KhoiLuong": 120.75
}
```

**Pending Change Record:**
```json
{
  "ChangeID": 1,
  "OriginalRecordID": 123,
  "ChangeType": "UPDATE",
  "NewData": "{\"Lot\":\"BATCH-002\",\"KhoiLuong\":120.75}",
  "Status": "PENDING",
  "RequestedBy": "user01",
  "RequestedAt": "2025-11-21 10:30:00"
}
```

**Sau khi Leader APPROVE:**
- PT_QC_ShellingSamples (ID=123) được UPDATE:
  ```json
  {
    "ID": 123,
    "Lot": "BATCH-002",     // ← Updated
    "KhoiLuong": 120.75,    // ← Updated
    "WholePct": 85.2,       // ← Không đổi
    ...
  }
  ```
- PT_QC_PendingChanges (ChangeID=1):
  ```json
  {
    "Status": "APPROVED",
    "ReviewedBy": "admin",
    "ReviewedAt": "2025-11-21 11:00:00"
  }
  ```

**Sau khi Leader REJECT:**
- PT_QC_ShellingSamples (ID=123): **KHÔNG thay đổi**
- PT_QC_PendingChanges (ChangeID=1):
  ```json
  {
    "Status": "REJECTED",
    "ReviewedBy": "admin",
    "ReviewedAt": "2025-11-21 11:00:00",
    "RejectReason": "Lot number không hợp lệ"
  }
  ```

---

## ⚙️ 8. CUSTOMIZATION

### Thêm fields vào NewData:

Nếu muốn track thêm field nào, chỉ cần thêm vào object `newData`:

```javascript
await pendingChangesAPI.create({
  originalRecordId: 123,
  changeType: 'UPDATE',
  newData: {
    Lot: 'NEW-001',
    NguonGoc: 'Supplier A',
    Line: 'Line 1',
    Size: 'Large',
    KhoiLuong: 150.5,
    WholePct: 85.2,
    // Thêm bao nhiêu field cũng được
  }
});
```

### Thay đổi màu sắc/UI:

**PendingChangeDiff.jsx:** Màu so sánh cũ/mới
```jsx
// Old value - Đỏ
<div className="bg-red-50 border border-red-200">

// New value - Xanh lá
<div className="bg-green-50 border border-green-200">
```

**ApprovalModal.jsx:** Button colors
```jsx
// Approve button
<Button variant="success">✅ Approve</Button>

// Reject button
<Button variant="danger">❌ Reject</Button>
```

---

## 🔧 9. TROUBLESHOOTING

### Lỗi thường gặp:

**1. "User not found" khi approve/reject**
- **Nguyên nhân:** Chưa login hoặc token hết hạn
- **Giải pháp:** Login lại và lưu token vào localStorage

**2. "Access denied. Required roles: admin, leader"**
- **Nguyên nhân:** User không có quyền
- **Giải pháp:** Đảm bảo role trong DB là `admin` hoặc `leader`

**3. "Original record not found"**
- **Nguyên nhân:** ID record không tồn tại
- **Giải pháp:** Kiểm tra `originalRecordId` có đúng không

**4. "This change has already been reviewed"**
- **Nguyên nhân:** Pending change đã được approve/reject rồi
- **Giải pháp:** Chỉ có thể approve/reject khi Status='PENDING'

**5. CORS error**
- **Nguyên nhân:** Backend không cho phép origin của frontend
- **Giải pháp:** Cập nhật `.env`:
  ```
  CORS_ORIGIN=http://localhost:5173
  ```

---

## 📚 10. TÀI LIỆU THAM KHẢO

### Files đã tạo:

**Backend:**
- `backend/src/models/PendingChange.js`
- `backend/src/controllers/pendingChangesController.js`
- `backend/src/routes/pendingChanges.js`
- `backend/src/server.js` (đã cập nhật)

**Frontend:**
- `datacore-factory/src/services/api.js` (đã cập nhật)
- `datacore-factory/src/components/approvals/PendingChangeDiff.jsx`
- `datacore-factory/src/components/approvals/ApprovalModal.jsx`
- `datacore-factory/src/components/approvals/PendingChangesList.jsx`
- `datacore-factory/src/pages/PendingApprovals.jsx`
- `datacore-factory/src/App.jsx` (đã cập nhật)
- `datacore-factory/src/components/layout/Sidebar.jsx` (đã cập nhật)

### Routes:

- Frontend: `/approvals` → PendingApprovals page
- Backend: `/api/pending-changes` → API endpoints

---

## ✅ CHECKLIST

Trước khi đưa vào production:

- [ ] Chạy SQL tạo bảng `PT_QC_PendingChanges`
- [ ] Test backend API với Postman/cURL
- [ ] Tạo user với role `leader` để test approval
- [ ] Test toàn bộ workflow: Submit → View → Approve/Reject
- [ ] Kiểm tra dữ liệu sau approve có đúng không
- [ ] Kiểm tra dữ liệu sau reject có giữ nguyên không
- [ ] Test phân quyền (user thường không được approve)
- [ ] Test UI trên mobile/tablet
- [ ] Backup database trước khi deploy

---

## 🎯 NEXT STEPS

Các tính năng có thể mở rộng:

1. **Email notification:** Gửi email cho Leader khi có pending change mới
2. **Comment system:** Cho phép Leader comment khi reject
3. **Audit log:** Log tất cả actions (approve/reject) vào bảng riêng
4. **Batch approval:** Approve nhiều changes cùng lúc
5. **Auto-reject:** Tự động reject sau X ngày nếu không được review
6. **Conflict detection:** Cảnh báo nếu có 2 người edit cùng record
7. **Version history:** Xem lịch sử tất cả changes của 1 record

---

**Chúc bạn tích hợp thành công! 🚀**

Nếu có vấn đề, kiểm tra console log (F12) và server logs để debug.
