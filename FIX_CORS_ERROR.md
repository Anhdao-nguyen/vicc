# SỬA LỖI CORS - "Access-Control-Allow-Origin header contains multiple values"

## VẤN ĐỀ

**Lỗi hiển thị:**
```
Access to fetch at 'http://localhost:5000/api/shelling-samples' from origin 'http://localhost:5173'
has been blocked by CORS policy: Response to preflight request doesn't pass access control check:
The 'Access-Control-Allow-Origin' header contains multiple values
'http://localhost:5173,http://localhost:5174', but only one is allowed.
```

**Nguyên nhân:**

Trong file `.env`:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

Backend server nhận chuỗi `'http://localhost:5173,http://localhost:5174'` như **MỘT origin duy nhất**, thay vì **array of origins**.

Kết quả: CORS middleware gửi header sai format.

## CÁCH SỬA

**File đã sửa:** `backend/src/server.js`

### TRƯỚC:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
```

### SAU:
```javascript
// Parse CORS_ORIGIN - support both single origin and multiple origins (comma-separated)
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : 'http://localhost:5173';

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));
```

**Giải thích:**
- `split(',')`: Tách chuỗi thành array bằng dấu phấy
- `.map(origin => origin.trim())`: Loại bỏ khoảng trắng thừa
- Kết quả: `['http://localhost:5173', 'http://localhost:5174']`

## CÁCH RESTART SERVER

**QUAN TRỌNG:** Phải restart backend server để áp dụng thay đổi!

### Option 1: Nếu đang chạy trong terminal
1. Nhấn `Ctrl+C` để dừng server
2. Chạy lại: `npm run dev`

### Option 2: Nếu đang chạy background
1. Tìm process: `tasklist | findstr node`
2. Kill process: `taskkill /F /PID <process_id>`
3. Chạy lại: `cd backend && npm run dev`

### Option 3: Restart từ VS Code
1. Vào terminal đang chạy backend
2. `Ctrl+C`
3. `npm run dev`

## XÁC NHẬN ĐÃ FIX

Sau khi restart server, kiểm tra console log khi server khởi động:

```bash
🚀 Server running on port 5000
📍 Environment: development
```

Thử lại frontend - lỗi CORS phải biến mất!

## TEST CORS HOẠT ĐỘNG

### Test với curl:
```bash
curl -X OPTIONS http://localhost:5000/api/shelling-samples \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

**Kết quả mong đợi:**
```
< Access-Control-Allow-Origin: http://localhost:5173
< Access-Control-Allow-Credentials: true
```

### Test với frontend:
1. Mở http://localhost:5173
2. Mở DevTools (F12) → Console tab
3. Không còn lỗi CORS
4. API calls thành công

## CÁCH THÊM ORIGIN MỚI

Nếu cần thêm origin khác, chỉnh file `.env`:

```env
# Thêm origin mới, cách nhau bằng dấu phấy
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

Restart server là xong!

## TÓM TẮT

### Files đã sửa:
- `backend/src/server.js` - Thêm logic parse CORS_ORIGIN từ chuỗi thành array

### File không đổi:
- `.env` - Vẫn giữ nguyên format: `CORS_ORIGIN=http://localhost:5173,http://localhost:5174`

### Bước tiếp theo:
1. **Restart backend server** (BẮT BUỘC!)
2. Refresh frontend
3. Test lại các API calls

---

**Ngày fix:** 2025-11-21
**Fixed by:** Claude Code
**Status:** RESOLVED ✅
