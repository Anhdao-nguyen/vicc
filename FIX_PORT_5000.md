# 🔧 FIX: Port 5000 Already In Use

## ❌ Lỗi

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Nguyên nhân:** Một process khác đang chiếm port 5000

---

## ✅ Giải pháp - 3 cách

### Cách 1: Dùng PowerShell Script (KHUYẾN NGHỊ)

```powershell
cd backend
.\kill-port-5000.ps1
```

Script sẽ:
1. Tìm process đang dùng port 5000
2. Hiển thị tên process và PID
3. Hỏi bạn có muốn kill không
4. Kill process nếu bạn chọn Yes

---

### Cách 2: Manual (Windows CMD)

#### Bước 1: Tìm PID của process đang dùng port 5000
```bash
netstat -ano | findstr :5000
```

Output:
```
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
```

Số **12345** là PID

#### Bước 2: Kill process
```bash
taskkill /PID 12345 /F
```

**Lưu ý:** Thay **12345** bằng PID thực tế từ bước 1

---

### Cách 3: Dùng PowerShell One-liner

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

---

## 🔍 Kiểm tra Port đã free chưa

```bash
netstat -ano | findstr :5000
```

**Không có output** = Port 5000 đã free! ✅

---

## 🚀 Sau khi kill process

### 1. Chạy backend lại
```bash
cd backend
npm run dev
```

### 2. Verify backend chạy thành công

**Expected output:**
```
✅ Database connection verified
🚀 Server running on port 5000
📍 Environment: development
```

### 3. Test backend
```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-19T...",
  "uptime": 0.123
}
```

---

## ⚠️ Lưu ý

### Process nào thường chiếm port 5000?

1. **Node.js cũ** - Backend chạy trước đó chưa stop hết
2. **Python Flask** - Mặc định dùng port 5000
3. **AirPlay Receiver** (macOS) - Có thể dùng port 5000
4. **Other dev servers** - React, Vue, Angular dev servers

### Nếu không thể kill process

**Option 1: Đổi port backend**

Edit `backend/.env`:
```env
PORT=5001  # Thay vì 5000
```

**Lưu ý:** Phải update frontend `.env` theo:
```env
VITE_API_URL=http://localhost:5001/api
```

**Option 2: Restart máy**

Đơn giản nhất nhưng mất thời gian nhất 😅

---

## 🔧 Troubleshooting

### "Access Denied" khi kill process

Chạy PowerShell/CMD **as Administrator**:
- Click phải PowerShell/CMD
- Chọn "Run as Administrator"
- Chạy lại lệnh kill

### Port vẫn bị chiếm sau khi kill

```bash
# Đợi 2-3 giây rồi check lại
timeout /t 3
netstat -ano | findstr :5000
```

### Không tìm thấy process nào dùng port 5000 nhưng vẫn lỗi EADDRINUSE

Backend có thể đang chạy nhiều instance:

```bash
# Tìm tất cả Node.js processes
tasklist | findstr node

# Kill tất cả Node.js
taskkill /IM node.exe /F
```

⚠️ **Cẩn thận:** Lệnh này sẽ kill TẤT CẢ Node.js processes!

---

## ✅ Checklist

Sau khi fix:

- [ ] Port 5000 đã free (check bằng netstat)
- [ ] Backend start thành công (`npm run dev`)
- [ ] Health check OK (`curl http://localhost:5000/health`)
- [ ] Frontend kết nối được backend
- [ ] Submit form hoạt động

---

**Quick Commands:**

```bash
# 1. Kill port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# 2. Verify port free
netstat -ano | findstr :5000

# 3. Start backend
cd backend
npm run dev

# 4. Test
curl http://localhost:5000/health
```

**Done! 🎉**
