# 🚨 FIX NGAY - 2 Lỗi Nghiêm Trọng

## ❌ Lỗi 1: MySQL Port SAI
```
Error: connect ECONNREFUSED ::1:3066
```

**Nguyên nhân:** `DB_PORT=3066` thay vì `3306`

**✅ ĐÃ FIX:** File `backend/.env` đã được sửa
- Từ: `DB_PORT=3066`
- Thành: `DB_PORT=3306`

---

## ❌ Lỗi 2: Port 5000 Bị Chiếm
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Nguyên nhân:** Một process khác đang dùng port 5000

---

## 🎯 CÁCH FIX - 3 BƯỚC

### Bước 1: Kill Process Đang Chiếm Port 5000

**Chọn 1 trong 3 cách:**

#### Cách A: Dùng PowerShell Script (NHANH NHẤT)
```powershell
cd backend
.\kill-port-5000.ps1
```

#### Cách B: One-liner PowerShell
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

#### Cách C: Manual
```bash
# 1. Tìm PID
netstat -ano | findstr :5000

# 2. Kill (thay 12345 bằng PID thực tế)
taskkill /PID 12345 /F
```

---

### Bước 2: Verify Port Đã Free

```bash
netstat -ano | findstr :5000
```

**Không có output** = Port free! ✅

---

### Bước 3: Start Backend

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Database connection verified
🚀 Server running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
```

**❌ Nếu vẫn lỗi database:** Xem mục Troubleshooting bên dưới

---

## ✅ Verify Backend OK

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

**Expected:**
```json
{"status": "OK", "timestamp": "...", "uptime": 0.123}
```

### Test 2: Database Connection
```bash
npm run test-db
```

**Expected:**
```
✅✅✅ ALL TESTS PASSED! ✅✅✅
🎉 Your database is ready to use!
```

### Test 3: API Endpoint
```bash
curl http://localhost:5000/api/shelling-samples
```

**Expected:**
```json
{"success": true, "count": ..., "data": [...]}
```

---

## 🆘 Troubleshooting

### ❌ Vẫn lỗi "ECONNREFUSED" sau khi fix port

**Kiểm tra `.env` file:**

```bash
cd backend
type .env
```

**Phải thấy:**
```env
DB_HOST=vnicc-lxwb001vh.isrk.local
DB_PORT=3306  ← PHẢI LÀ 3306, KHÔNG PHẢI 3066!
```

**Nếu vẫn là 3066:**
1. Stop backend (Ctrl+C)
2. Edit file `.env` thủ công
3. Đổi `DB_PORT=3066` → `DB_PORT=3306`
4. Save file
5. Start lại: `npm run dev`

---

### ❌ "Access Denied" khi kill process

**Chạy PowerShell as Administrator:**
1. Click phải PowerShell
2. "Run as Administrator"
3. Chạy lại lệnh kill

---

### ❌ Port 5000 vẫn bị chiếm

**Kill TẤT CẢ Node.js processes:**

```bash
taskkill /IM node.exe /F
```

⚠️ Lệnh này kill tất cả Node.js! Đảm bảo không có app quan trọng đang chạy.

---

### ❌ MySQL server không chạy

**Test connection:**
```bash
npm run test-db
```

**Nếu lỗi:** MySQL server có thể down. Contact IT support.

---

## 📋 Quick Checklist

- [ ] Đã kill process chiếm port 5000
- [ ] Port 5000 đã free (`netstat -ano | findstr :5000` = no output)
- [ ] File `.env` có `DB_PORT=3306` (KHÔNG phải 3066)
- [ ] Backend start thành công
- [ ] Health check OK
- [ ] Database test PASS
- [ ] API endpoint trả về data

---

## 🚀 Các Lệnh Cần Thiết

**1. Kill port 5000 (PowerShell):**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

**2. Check port free:**
```bash
netstat -ano | findstr :5000
```

**3. Verify .env:**
```bash
cd backend
type .env | findstr DB_PORT
# Phải thấy: DB_PORT=3306
```

**4. Start backend:**
```bash
npm run dev
```

**5. Test:**
```bash
curl http://localhost:5000/health
npm run test-db
```

---

## 🎯 TÓM TẮT

### Đã fix:
1. ✅ MySQL port: 3066 → **3306**
2. ✅ Tạo script kill port 5000

### Cần làm:
1. ⚠️ **Kill process đang chiếm port 5000**
2. ⚠️ **Restart backend**
3. ⚠️ **Test lại**

---

## 📁 Files Đã Tạo

- ✅ `backend/.env` - Fixed DB_PORT
- ✅ `backend/kill-port-5000.ps1` - Script kill port
- ✅ `FIX_PORT_5000.md` - Hướng dẫn chi tiết
- ✅ `FIX_NOW.md` - File này

---

**🎉 Sau khi fix xong, chạy lại frontend và test submit form!**

Xem: [START_HERE.md](START_HERE.md) để biết các bước tiếp theo.
