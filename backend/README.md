# 🚀 DataCore Backend API

Backend API server cho hệ thống quản lý QC dữ liệu nhà máy.

## ⚠️ THÔNG BÁO QUAN TRỌNG

**ĐÃ FIX CÁC LỖI:**
- ✅ Port: Đã đổi từ 3306 → **5000** (3306 là MySQL port!)
- ✅ CORS: Đã fix lỗi 403 Forbidden
- ✅ API: Đã sửa lỗi 500 Internal Server Error

**Xem chi tiết:** [QUICK_FIX_SUMMARY.md](../QUICK_FIX_SUMMARY.md)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (tripsmgm-mydb002)
- **Table:** PT_QC_ShellingSamples
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Database Client:** mysql2

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication & authorization
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── scripts/         # Database initialization scripts
│   ├── utils/           # Utility functions (JWT, etc.)
│   └── server.js        # Main server file
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ template:

```bash
copy .env.example .env
```

Chỉnh sửa file `.env` với thông tin SQL Server của bạn:

```env
# ⚙️ Server Configuration
PORT=5000                    # ✨ CHANGED from 3306 to 5000
NODE_ENV=development

# 🗄️ MySQL Configuration
DB_HOST=vnicc-lxwb001vh.isrk.local
DB_PORT=3306                 # MySQL port (NOT backend port!)
DB_DATABASE=tripsmgm-mydb002
DB_USER=tripsmgm-rndus2
DB_PASSWORD=wXKBvt0SRytjvER4e2Hp

# 🔐 JWT Configuration
JWT_SECRET=datacore-secret-key-change-in-production-2024
JWT_EXPIRE=24h

# 🌐 CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Kiểm tra kết nối Database

**QUAN TRỌNG:** Table `PT_QC_ShellingSamples` đã tồn tại trên database!

Test kết nối:

```bash
npm run test-db
```

Script này sẽ kiểm tra:
- ✅ Kết nối MySQL
- ✅ Database tồn tại
- ✅ Table `PT_QC_ShellingSamples` tồn tại
- ✅ Cấu trúc table
- ✅ Số lượng records

## Chạy Server

### Development mode (với auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

✅ Server sẽ chạy tại: **`http://localhost:5000`**

Kiểm tra:
- Health check: `http://localhost:5000/health`
- API: `http://localhost:5000/api/shelling-samples`

## API Endpoints

### Authentication

#### Register (Đăng ký)
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe"
}
```

#### Login (Đăng nhập)
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile (Lấy thông tin profile)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile (Cập nhật profile)
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "fullName": "John Updated"
}
```

#### Change Password (Đổi mật khẩu)
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

### User Management (Admin only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <admin_token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <admin_token>
```

#### Create User (Admin)
```http
POST /api/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username": "new_user",
  "email": "user@example.com",
  "password": "Pass123",
  "fullName": "New User",
  "role": "user"
}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "updated@example.com",
  "role": "admin",
  "isActive": true
}
```

#### Delete User (Soft delete)
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

## User Roles

- **admin**: Toàn quyền (quản lý users, xem/sửa/xóa tất cả dữ liệu)
- **user**: Quyền cơ bản (xem và chỉnh sửa dữ liệu của mình)
- **viewer**: Chỉ xem (read-only)

## Security Features

- ✅ Password hashing với bcrypt
- ✅ JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Environment variables cho sensitive data

## Database Schema

### Users Table
```sql
- userId (INT, PK, IDENTITY)
- username (NVARCHAR, UNIQUE)
- email (NVARCHAR, UNIQUE)
- password (NVARCHAR, hashed)
- fullName (NVARCHAR)
- role (NVARCHAR: admin/user/viewer)
- isActive (BIT)
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

### ShellingData Table
```sql
- id (INT, PK, IDENTITY)
- date, shift, operator, machineId, lotNumber
- inputWeight, outputWeight, shellingRate, brokenRate
- moistureContent, remarks, status
- createdBy, createdAt, updatedBy, updatedAt (audit fields)
```

## Testing với Postman/Insomnia

1. Register một user mới
2. Login để lấy JWT token
3. Sử dụng token trong header: `Authorization: Bearer <token>`
4. Test các protected endpoints

## Troubleshooting

### Không kết nối được SQL Server

1. Kiểm tra SQL Server đang chạy
2. Kiểm tra firewall cho phép port 3306
3. Enable TCP/IP trong SQL Server Configuration Manager
4. Kiểm tra username/password trong `.env`

### JWT errors

- Kiểm tra `JWT_SECRET` trong `.env`
- Token có thể đã hết hạn (mặc định 24h)

## Next Steps

- [ ] Thêm routes cho ShellingData CRUD
- [ ] Implement audit logging
- [ ] Add data validation với express-validator
- [ ] Setup rate limiting
- [ ] Add unit tests
- [ ] Setup Docker container
