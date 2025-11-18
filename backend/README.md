# DataCore Backend API

Backend API server cho hệ thống quản lý QC dữ liệu nhà máy (Factory QC Data Management System).

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Microsoft SQL Server
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **ORM/Database Client:** mssql

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
# Server Configuration
PORT=5000
NODE_ENV=development

# SQL Server Configuration
DB_SERVER=localhost          # hoặc IP/hostname của SQL Server
DB_PORT=1433
DB_DATABASE=DataCoreDB
DB_USER=your_username        # SQL Server username
DB_PASSWORD=your_password    # SQL Server password
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Khởi tạo Database

Tạo database và tables:

```bash
npm run init-db
```

Script này sẽ tạo:
- Table `Users` (quản lý user với roles)
- Table `ShellingData` (dữ liệu QC)
- Table `AuditLog` (audit trail)

## Chạy Server

### Development mode (với auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

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
2. Kiểm tra firewall cho phép port 1433
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
