# 🔧 Troubleshooting - Lỗi khi Submit Data

## ❌ Lỗi hiện tại (từ console)

### 1. CORS Error
```
Access to fetch at 'http://localhost:5000/api/shelling-samples' from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Nguyên nhân:**
- Frontend đang chạy ở port **5174** (không phải 5173!)
- Backend CORS chỉ cho phép port 5173

**✅ ĐÃ FIX:**
- Updated [backend/src/server.js](backend/src/server.js:25-48)
- Cho phép cả localhost:5173 VÀ localhost:5174

---

### 2. ERR_FAILED khi fetch API
```
Failed to load resource: net::ERR_FAILED
```

**Nguyên nhân:**
- Backend KHÔNG đang chạy!
- Hoặc backend đang chạy sai port

**✅ GIẢI PHÁP:**

#### Bước 1: Kiểm tra backend có chạy không
```bash
# Windows - Check if port 5000 is listening
netstat -ano | findstr :5000
```

Nếu KHÔNG có kết quả → Backend CHƯA chạy!

#### Bước 2: Start backend
```bash
cd backend
npm run dev
```

Bạn sẽ thấy:
```
✅ Database connection verified
🚀 Server running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
```

#### Bước 3: Test backend
Mở browser: http://localhost:5000/health

Kết quả mong đợi:
```json
{
  "status": "OK",
  "timestamp": "2025-01-19T...",
  "uptime": 123.45
}
```

---

### 3. TypeError: Failed to fetch
```javascript
API Error: TypeError: Failed to fetch
```

**Nguyên nhân:**
- Backend không running
- Network connection issue
- CORS blocking

**✅ CHECKLIST:**

- [ ] Backend đang chạy tại port 5000
- [ ] Test http://localhost:5000/health → Phải OK
- [ ] Test http://localhost:5000/api/shelling-samples → Phải trả về data
- [ ] Frontend .env có VITE_API_URL=http://localhost:5000/api
- [ ] CORS đã được fix (cho phép localhost:5174)

---

## 🚀 CÁCH KHẮC PHỤC ĐẦY ĐỦ

### Bước 1: Stop tất cả servers
```bash
# Ctrl+C ở tất cả terminal đang chạy backend/frontend
```

### Bước 2: Verify cấu hình

#### Backend `.env`
```env
PORT=5000
DB_HOST=vnicc-lxwb001vh.isrk.local
DB_PORT=3306
DB_DATABASE=tripsmgm-mydb002
DB_USER=tripsmgm-rndus2
DB_PASSWORD=wXKBvt0SRytjvER4e2Hp
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### Bước 3: Test database connection
```bash
cd backend
npm run test-db
```

Expected output:
```
✅✅✅ ALL TESTS PASSED! ✅✅✅
🎉 Your database is ready to use!
```

### Bước 4: Start backend
```bash
cd backend
npm run dev
```

**Chờ đến khi thấy:**
```
✅ Database connection verified
🚀 Server running on port 5000
```

### Bước 5: Test backend API
Mở browser hoặc Postman:
```
GET http://localhost:5000/health
GET http://localhost:5000/api/shelling-samples
```

Cả 2 phải trả về 200 OK!

### Bước 6: Start frontend (terminal mới)
```bash
cd datacore-factory
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5174 (hoặc 5173)

### Bước 7: Test trên browser
1. Mở: http://localhost:5174
2. F12 → Console tab
3. Kiểm tra không còn lỗi CORS
4. Submit data
5. Check Network tab → Status phải 200 hoặc 201

---

## 🔍 DEBUG CHECKLIST

### Backend Issues

#### ❌ "Cannot connect to database"
```bash
# Test connection
cd backend
npm run test-db
```

**Fix:**
- Check MySQL server đang chạy
- Check credentials trong .env
- Check network connectivity

#### ❌ "Port 5000 already in use"
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

#### ❌ "Module not found"
```bash
cd backend
npm install
```

---

### Frontend Issues

#### ❌ CORS blocked
**Đã fix!** Backend giờ cho phép cả port 5173 và 5174

#### ❌ "Failed to fetch"
- Kiểm tra backend đang chạy
- Kiểm tra VITE_API_URL đúng
- Test API trực tiếp qua browser

#### ❌ Wrong API URL
Check file: `datacore-factory/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

**Restart frontend sau khi đổi .env!**

---

## 📋 QUICK TEST SCRIPT

Copy paste vào terminal để test nhanh:

### Test Backend (PowerShell/CMD)
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/shelling-samples
```

### Test Database
```bash
cd backend
node test-connection.js
```

---

## ✅ EXPECTED BEHAVIOR

### 1. Backend Console Log
```
✅ Database connection verified
🚀 Server running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
🔐 Auth API: http://localhost:5000/api/auth
👤 Users API: http://localhost:5000/api/users

2025-01-19T10:30:00.000Z - GET /health
2025-01-19T10:30:05.000Z - GET /api/shelling-samples
2025-01-19T10:30:10.000Z - POST /api/shelling-samples
```

### 2. Frontend Console (NO ERRORS!)
```
✓ Connected to backend API
✓ Data loaded successfully
```

### 3. Network Tab
```
GET  /api/shelling-samples     200 OK    50ms
POST /api/shelling-samples     201 Created   100ms
```

---

## 🆘 VẪN BỊ LỖI?

### Kiểm tra từng bước:

1. **Backend có chạy không?**
   ```bash
   netstat -ano | findstr :5000
   ```
   Phải có kết quả! Nếu không → `cd backend && npm run dev`

2. **Database connect được không?**
   ```bash
   cd backend && npm run test-db
   ```
   Phải pass! Nếu không → Check MySQL server

3. **CORS vẫn bị block?**
   - Restart backend sau khi fix CORS
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh (Ctrl+F5)

4. **API URL đúng chưa?**
   - Check: `datacore-factory/.env`
   - Phải: `VITE_API_URL=http://localhost:5000/api`
   - Restart frontend sau khi đổi!

---

## 📞 LOG FILES

### Backend error log
Check terminal nơi chạy `npm run dev` (backend)

### Frontend error log
- Browser Console (F12)
- Network tab (F12)

### Database log
```bash
cd backend
npm run test-db
```

---

## 🎯 SUMMARY - MUST DO

1. ✅ Fix CORS trong server.js (cho phép port 5174)
2. ✅ Start backend: `cd backend && npm run dev`
3. ✅ Verify backend running: `curl http://localhost:5000/health`
4. ✅ Start frontend: `cd datacore-factory && npm run dev`
5. ✅ Test submit data
6. ✅ Check console - NO ERRORS!

**Files đã update:**
- [backend/src/server.js](backend/src/server.js) - CORS fix

**Next step:**
- Restart backend
- Test lại submit form
