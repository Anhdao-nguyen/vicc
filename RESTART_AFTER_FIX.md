# 🔄 RESTART SERVICES - Sau khi fix CORS

## ⚠️ QUAN TRỌNG!

Sau khi fix code, bạn **PHẢI RESTART** cả backend và frontend!

---

## 🛑 Bước 1: Stop tất cả services

### Stop Backend
- Mở terminal đang chạy backend
- Nhấn `Ctrl + C`
- Chờ cho đến khi process stop hoàn toàn

### Stop Frontend
- Mở terminal đang chạy frontend
- Nhấn `Ctrl + C`
- Chờ cho đến khi process stop hoàn toàn

---

## ✅ Bước 2: Verify các fix đã được apply

### Check Backend CORS fix
Mở file: `backend/src/server.js`

Tìm dòng này (khoảng line 25-30):
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',  // ← Phải có dòng này!
  process.env.CORS_ORIGIN
].filter(Boolean);
```

**✅ Nếu thấy cả localhost:5173 và 5174 → OK!**

**❌ Nếu chỉ có 5173 → File chưa được save, cần pull lại code!**

---

## 🚀 Bước 3: Start Backend

```bash
cd backend
npm run dev
```

### Expected Output:
```
✅ Database connection verified
🚀 Server running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
🔐 Auth API: http://localhost:5000/api/auth
👤 Users API: http://localhost:5000/api/users
```

### ✅ Verify Backend Running
Mở browser hoặc chạy:
```bash
curl http://localhost:5000/health
```

Kết quả phải:
```json
{
  "status": "OK",
  "timestamp": "2025-01-19T...",
  "uptime": 0.123
}
```

**❌ Nếu lỗi "Cannot connect to database":**
```bash
npm run test-db
```

---

## 🎨 Bước 4: Start Frontend (Terminal mới)

```bash
cd datacore-factory
npm run dev
```

### Expected Output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Lưu ý:** Port có thể là 5173 hoặc 5174 (cả 2 đều OK!)

---

## 🧪 Bước 5: Test Submit Data

### 1. Mở browser
```
http://localhost:5173  (hoặc 5174)
```

### 2. Mở Developer Tools
- Nhấn `F12`
- Chọn tab **Console**
- Chọn tab **Network**

### 3. Clear Console & Network logs
- Console: Click nút "Clear console" (🚫)
- Network: Click nút "Clear" (🗑️)

### 4. Submit form
- Điền đầy đủ thông tin
- Click "Submit" hoặc "Lưu"

### 5. Kiểm tra kết quả

#### ✅ THÀNH CÔNG nếu thấy:

**Console Tab:**
- Không có lỗi màu đỏ
- Có thể thấy log: "Record added successfully" hoặc tương tự

**Network Tab:**
- Request: `POST http://localhost:5000/api/shelling-samples`
- Status: **201 Created** (hoặc 200 OK)
- Response có `"success": true`

#### ❌ VẪN LỖI nếu thấy:

**Console Tab:**
```
❌ Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:5174' has been blocked by CORS
```

**Network Tab:**
- Status: **(failed)** hoặc **CORS error**

**→ Nguyên nhân:** Backend chưa restart hoặc code chưa được update

**→ Giải pháp:**
1. Stop backend (Ctrl+C)
2. Verify file `backend/src/server.js` đã có fix CORS
3. Start lại: `npm run dev`
4. Hard refresh browser: `Ctrl + Shift + R`

---

## 🔍 Debug Checklist

### Backend
- [ ] Backend đang chạy tại port 5000
- [ ] Test: `curl http://localhost:5000/health` → OK
- [ ] File `server.js` có allowedOrigins với cả 5173 và 5174
- [ ] Console log không có error

### Frontend
- [ ] Frontend đang chạy (port 5173 hoặc 5174)
- [ ] File `.env` có `VITE_API_URL=http://localhost:5000/api`
- [ ] Browser console không có CORS error
- [ ] Network tab show request thành công

### Database
- [ ] MySQL server đang chạy
- [ ] Test: `cd backend && npm run test-db` → PASS

---

## 🎯 Quick Commands

### Test Backend
```bash
# Health check
curl http://localhost:5000/health

# Get data
curl http://localhost:5000/api/shelling-samples

# Database test
cd backend && npm run test-db
```

### Check Port Usage (Windows)
```bash
# Check backend port
netstat -ano | findstr :5000

# Check frontend port
netstat -ano | findstr :5173
netstat -ano | findstr :5174
```

### Hard Refresh Browser
- Windows: `Ctrl + Shift + R` hoặc `Ctrl + F5`
- Mac: `Cmd + Shift + R`

---

## 📝 Summary

### Files đã fix:
1. ✅ `backend/src/server.js` - CORS cho phép port 5174

### Must Do:
1. ✅ Stop backend & frontend
2. ✅ Verify fix đã có trong code
3. ✅ Start backend → Check http://localhost:5000/health
4. ✅ Start frontend → Chạy port 5173 hoặc 5174
5. ✅ Test submit form
6. ✅ Check console & network tab → Không lỗi!

---

## ✅ Expected Behavior

### Backend Console:
```
✅ Database connection verified
🚀 Server running on port 5000

2025-01-19T10:30:00.000Z - OPTIONS /api/shelling-samples
2025-01-19T10:30:00.000Z - POST /api/shelling-samples
```

### Frontend Console:
```
✓ No errors
```

### Network Tab:
```
POST /api/shelling-samples
Status: 201 Created
Response: {"success": true, "data": {...}}
```

---

## 🆘 Still Not Working?

### 1. Clear Everything
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd datacore-factory
rm -rf node_modules
npm install
```

### 2. Clear Browser Cache
- Chrome/Edge: `Ctrl + Shift + Delete`
- Check "Cached images and files"
- Click "Clear data"

### 3. Check Firewall
- Windows Firewall có block port 5000 không?
- Antivirus có block không?

### 4. Try Different Browser
- Chrome → Edge
- Edge → Firefox

### 5. Check Logs
- Backend: Terminal nơi chạy `npm run dev`
- Frontend: Browser console (F12)

---

**Good luck! 🚀**

Nếu vẫn lỗi → Xem [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
