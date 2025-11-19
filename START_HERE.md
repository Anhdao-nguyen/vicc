# 🚀 DataCore Factory - START HERE

## ✅ Tất cả lỗi đã được sửa! (Updated 2025-01-19)

### Các lỗi đã fix:
1. ✅ **Port sai** (3306 → 5000)
2. ✅ **CORS Error** (403 Forbidden)
3. ✅ **500 Internal Server Error**
4. ✅ **CORS cho port 5174** (Vite chạy ở port khác)
5. ✅ **Frontend submit data bị block**

**⚠️ Gặp lỗi submit?** → Xem [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🎯 Chạy Project trong 3 bước

### Bước 1: Kiểm tra database
```bash
cd backend
npm run test-db
```

Nếu thành công, bạn sẽ thấy:
```
✅✅✅ ALL TESTS PASSED! ✅✅✅
🎉 Your database is ready to use!
```

### Bước 2: Start Backend
```bash
cd backend
npm run dev
```

**Chờ cho đến khi thấy:**
```
✅ Database connection verified
🚀 Server running on port 5000
```

Backend chạy tại: `http://localhost:5000`

**❌ Nếu lỗi:** Xem [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Bước 3: Start Frontend (terminal mới)
```bash
cd datacore-factory
npm run dev
```

Frontend có thể chạy tại:
- `http://localhost:5173` HOẶC
- `http://localhost:5174` (nếu 5173 đã dùng)

**Cả 2 đều OK!** Backend đã được cấu hình chấp nhận cả 2 ports.

---

## 🔍 Kiểm tra

### Backend Health Check
Mở browser: http://localhost:5000/health

Kết quả mong đợi:
```json
{
  "status": "OK",
  "timestamp": "2025-01-19T...",
  "uptime": 123.45
}
```

### Frontend
Mở browser: http://localhost:5173 hoặc http://localhost:5174

**Kiểm tra (F12 → Console):**
- ✅ Không còn lỗi CORS
- ✅ API calls thành công (Status 200/201)
- ✅ Dữ liệu hiển thị từ database
- ✅ Submit form thành công

**❌ Vẫn có lỗi?**
1. Check backend đang chạy: `curl http://localhost:5000/health`
2. Xem hướng dẫn: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📁 Cấu hình quan trọng

### Backend (.env)
```env
PORT=5000                              # Backend port
DB_HOST=vnicc-lxwb001vh.isrk.local     # MySQL server
DB_PORT=3306                           # MySQL port
DB_DATABASE=tripsmgm-mydb002
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🆘 Nếu gặp lỗi

### ❌ "Cannot connect to database"
```bash
cd backend
npm run test-db
```
→ Kiểm tra MySQL server có đang chạy không

### ❌ "Port already in use"
```bash
# Windows - Check port 5000
netstat -ano | findstr :5000
```
→ Đảm bảo backend dùng port 5000 (KHÔNG phải 3306!)

### ❌ "CORS error" hoặc "Failed to fetch"
**Đã fix CORS cho cả port 5173 và 5174!**

Nếu vẫn lỗi:
1. Backend có đang chạy? → `curl http://localhost:5000/health`
2. Restart backend sau khi fix CORS
3. Hard refresh browser (Ctrl+F5)
4. Xem chi tiết: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### ❌ Submit data không được lưu
1. Check Network tab (F12) → Status phải 200/201
2. Check Console (F12) → Không có lỗi
3. Backend log có error? → Check terminal
4. Xem: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📚 Tài liệu chi tiết

- [QUICK_FIX_SUMMARY.md](QUICK_FIX_SUMMARY.md) - Tóm tắt các fix
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Hướng dẫn chi tiết
- [backend/README.md](backend/README.md) - Backend API docs

---

## 🎉 Bắt đầu thôi!

1. Test database: `cd backend && npm run test-db`
2. Start backend: `npm run dev` (cùng folder backend)
3. Start frontend: `cd datacore-factory && npm run dev`
4. Mở browser: http://localhost:5173

**Chúc may mắn! 🚀**
