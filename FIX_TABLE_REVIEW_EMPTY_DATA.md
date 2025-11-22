# SỬA LỖI TABLE REVIEW HIỂN THỊ TOÀN DẤU "-"

## VẤN ĐỀ

**Triệu chứng:**
- Table Review hiển thị đúng số lượng bản ghi (7 bản ghi)
- Nhưng TẤT CẢ các cột đều hiển thị dấu "-" (giá trị rỗng)
- Dữ liệu trong database vẫn tồn tại và đầy đủ

**Hình ảnh lỗi:**
```
┌───────┬────┬────┬─────┬─────┬─────┬──────┬──────┬────────┬──────┬────────┐
│ Ngày  │ Ca │ QC │ Lot │ ... │ ... │ ...  │ ...  │ ...    │ ...  │ Thao tác│
├───────┼────┼────┼─────┼─────┼─────┼──────┼──────┼────────┼──────┼────────┤
│   -   │ -  │ -  │  -  │  -  │  -  │  -   │  -   │   -    │  -   │ 📝 🗑️ │
│   -   │ -  │ -  │  -  │  -  │  -  │  -   │  -   │   -    │  -   │ 📝 🗑️ │
│   -   │ -  │ -  │  -  │  -  │  -  │  -   │  -   │   -    │  -   │ 📝 🗑️ │
└───────┴────┴────┴─────┴─────┴─────┴──────┴──────┴────────┴──────┴────────┘
```

## NGUYÊN NHÂN

**DOUBLE MAPPING DATA!**

Dữ liệu đã bị map 2 lần:

### Lần 1: Trong `useShellingData` hook
```javascript
// File: src/hooks/useShellingData.js:29
const mappedData = mapDbArrayToFrontend(response.data);
setRecords(mappedData);
```

Dữ liệu từ database được convert:
- `Ngay` → `date`
- `Ca` → `shift`
- `QC` → `qcName`
- `Lot` → `lot`
- v.v.

### Lần 2: Trong `ShellingTable` component (LỖI Ở ĐÂY!)
```javascript
// File: src/components/shelling/ShellingTable.jsx:7 (TRƯỚC KHI SỬA)
const mappedData = data.map(record => mapDbToFrontend(record));
```

Khi map lần 2:
- Input: `{ date: '2025-11-21', shift: 'Ca 1', ... }`
- Tìm key `Ngay` (database field) → KHÔNG TỒN TẠI
- Tìm key `Ca` → KHÔNG TỒN TẠI
- Kết quả: Object rỗng `{ }`

→ Table nhận data rỗng → Hiển thị toàn dấu "-"

## CÁCH SỬA

**File đã sửa:** `datacore-factory/src/components/shelling/ShellingTable.jsx`

### TRƯỚC (SAI):
```javascript
import Table from '@/components/common/Table'
import { formatDate } from '@/utils/helpers'
import { mapDbToFrontend } from '@/utils/fieldMapping'

const ShellingTable = ({ data, onEdit, onDelete }) => {
  // ❌ DOUBLE MAPPING - SAI!
  const mappedData = data.map(record => mapDbToFrontend(record));

  const columns = [
    { key: 'date', label: 'Ngày', render: (val) => formatDate(val) },
    // ... other columns
  ]

  // ❌ Truyền mappedData (đã bị map 2 lần)
  return <Table columns={columns} data={mappedData} onEdit={handleEdit} onDelete={handleDelete} />
}
```

### SAU (ĐÚNG):
```javascript
import Table from '@/components/common/Table'
import { formatDate } from '@/utils/helpers'
// ✅ Xóa import không cần thiết

const ShellingTable = ({ data, onEdit, onDelete }) => {
  // ✅ Data đã được map sẵn trong useShellingData hook
  // Không cần map lại!

  // Debug: Log data to console
  console.log('ShellingTable - Data received:', data);

  const columns = [
    { key: 'date', label: 'Ngày', render: (val) => formatDate(val) },
    // ... other columns
  ]

  // ✅ Truyền data trực tiếp (đã được map 1 lần ở hook)
  return <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
}
```

## GIẢI THÍCH DATA FLOW

### Flow đúng:
```
1. Database
   ↓
   { Ngay: '2025-11-21', Ca: 'Ca 1', QC: 'John', Lot: '001', ... }
   ↓
2. API Response (backend/src/controllers/shellingSampleController.js)
   ↓
   response.data = [
     { Ngay: '2025-11-21', Ca: 'Ca 1', QC: 'John', Lot: '001', ... }
   ]
   ↓
3. useShellingData Hook (mapDbArrayToFrontend)
   ↓
   records = [
     { date: '2025-11-21', shift: 'Ca 1', qcName: 'John', lot: '001', ... }
   ]
   ↓
4. Shelling.jsx (pass data to ShellingTable)
   ↓
   <ShellingTable data={filteredRecords} />
   ↓
5. ShellingTable.jsx
   ✅ DÙNG data TRỰC TIẾP (đã mapped)
   ❌ KHÔNG map lại lần 2!
   ↓
6. Table.jsx
   ↓
   Hiển thị dữ liệu đúng!
```

### Flow sai (trước khi fix):
```
3. useShellingData Hook
   ↓
   records = [{ date: '...', shift: '...', ... }]  ✅ OK
   ↓
5. ShellingTable.jsx
   ↓
   mapDbToFrontend({ date: '...', shift: '...', ... })  ❌ SAI!
   ↓
   Tìm key 'Ngay' → undefined
   Tìm key 'Ca' → undefined
   ↓
   Result: {}  (object rỗng)
   ↓
6. Table hiển thị toàn dấu "-"
```

## KẾT QUẢ

Sau khi sửa:
- ✅ Table Review hiển thị đầy đủ dữ liệu
- ✅ Tất cả các cột hiển thị giá trị đúng
- ✅ Ngày, Ca, QC, Lot, Origin, Line, Size, etc. đều hiển thị OK
- ✅ Số liệu phần trăm hiển thị với 2 chữ số thập phân

## DEBUG TIPS

Nếu gặp vấn đề tương tự, kiểm tra:

### 1. Xem console log:
```javascript
console.log('ShellingTable - Data received:', data);
```

**Nếu thấy:**
```javascript
// ✅ ĐÚNG - Data đã mapped
[
  { date: '2025-11-21', shift: 'Ca 1', qcName: 'John', ... }
]

// ❌ SAI - Data chưa mapped
[
  { Ngay: '2025-11-21', Ca: 'Ca 1', QC: 'John', ... }
]
```

### 2. Kiểm tra data flow:
- Hook có map data không? → Có: Đừng map lại
- Component nhận data từ đâu? → Từ hook đã map sẵn
- Component có đang map lại không? → Nếu có: XÓA ĐI!

### 3. Rule of thumb:
**MAP MỘT LẦN DUY NHẤT - Ở nơi data vào hệ thống (Hook/API layer)**

- ✅ Map ở Hook khi fetch data
- ❌ Không map lại ở Component

## LƯU Ý

Nếu bạn tạo component mới (VD: `ShellingTableNew.jsx`):

**ĐÚNG:**
```javascript
const ShellingTableNew = ({ data }) => {
  // Nhận data đã mapped sẵn từ useShellingData
  return <Table columns={columns} data={data} />
}
```

**SAI:**
```javascript
const ShellingTableNew = ({ data }) => {
  // ❌ Không map lại!
  const mapped = data.map(r => mapDbToFrontend(r));
  return <Table columns={columns} data={mapped} />
}
```

## TÓM TẮT

### Vấn đề đã fix:
- ✅ Table Review hiển thị dữ liệu đầy đủ
- ✅ Xóa double mapping logic
- ✅ Tối ưu performance (không map 2 lần)

### Files đã sửa:
- `datacore-factory/src/components/shelling/ShellingTable.jsx`
  - Xóa import `mapDbToFrontend`
  - Xóa dòng mapping data
  - Truyền `data` trực tiếp thay vì `mappedData`

### Không cần thay đổi:
- `useShellingData` hook (vẫn map data 1 lần)
- `fieldMapping` utility (vẫn hoạt động tốt)
- Backend API (không ảnh hưởng)

---

**Ngày fix:** 2025-11-21
**Fixed by:** Claude Code
**Status:** RESOLVED ✅

**QUAN TRỌNG:** Sau khi pull code mới, làm mới trang (F5 hoặc Ctrl+R) để thấy dữ liệu hiển thị đầy đủ!
