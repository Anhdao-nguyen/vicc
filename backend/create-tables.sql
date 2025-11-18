-- =============================================
-- DataCore Factory QC System - Database Tables
-- Database: tripsmgm-mydb002
-- =============================================

USE [tripsmgm-mydb002]
GO

-- =============================================
-- 1. Users Table - Quản lý người dùng
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DC_Users')
BEGIN
    CREATE TABLE DC_Users (
        userId INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        fullName NVARCHAR(100) NOT NULL,
        role NVARCHAR(20) NOT NULL DEFAULT 'user',
        isActive BIT NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT CHK_DC_Users_Role CHECK (role IN ('admin', 'user', 'viewer'))
    );

    CREATE INDEX IDX_DC_Users_Username ON DC_Users(username);
    CREATE INDEX IDX_DC_Users_Email ON DC_Users(email);
    CREATE INDEX IDX_DC_Users_Role ON DC_Users(role);

    PRINT '✓ Table DC_Users created successfully';
END
ELSE
BEGIN
    PRINT '! Table DC_Users already exists';
END
GO

-- =============================================
-- 2. ShellingData Table - Dữ liệu QC Shelling
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DC_ShellingData')
BEGIN
    CREATE TABLE DC_ShellingData (
        id INT IDENTITY(1,1) PRIMARY KEY,

        -- Thông tin cơ bản
        recordDate DATE NOT NULL,
        shift NVARCHAR(20) NOT NULL,
        operatorName NVARCHAR(100) NOT NULL,
        machineId NVARCHAR(50),
        lotNumber NVARCHAR(50),
        rawMaterialBatch NVARCHAR(50),

        -- Số liệu QC
        inputWeight DECIMAL(10,2),              -- Trọng lượng đầu vào (kg)
        outputWeight DECIMAL(10,2),             -- Trọng lượng đầu ra (kg)
        shellingRate DECIMAL(5,2),              -- Tỷ lệ bóc vỏ (%)
        brokenRate DECIMAL(5,2),                -- Tỷ lệ vỡ (%)
        moistureContent DECIMAL(5,2),           -- Độ ẩm (%)

        -- Phân loại chất lượng
        gradeA DECIMAL(10,2),                   -- Hạt loại A (kg)
        gradeB DECIMAL(10,2),                   -- Hạt loại B (kg)
        gradeC DECIMAL(10,2),                   -- Hạt loại C (kg)
        reject DECIMAL(10,2),                   -- Hạt loại bỏ (kg)

        -- Ghi chú & trạng thái
        remarks NVARCHAR(500),
        status NVARCHAR(20) DEFAULT 'active',

        -- Audit fields
        createdBy INT,
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedBy INT,
        updatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_DC_ShellingData_CreatedBy FOREIGN KEY (createdBy) REFERENCES DC_Users(userId),
        CONSTRAINT FK_DC_ShellingData_UpdatedBy FOREIGN KEY (updatedBy) REFERENCES DC_Users(userId)
    );

    CREATE INDEX IDX_DC_ShellingData_Date ON DC_ShellingData(recordDate);
    CREATE INDEX IDX_DC_ShellingData_Shift ON DC_ShellingData(shift);
    CREATE INDEX IDX_DC_ShellingData_LotNumber ON DC_ShellingData(lotNumber);
    CREATE INDEX IDX_DC_ShellingData_Status ON DC_ShellingData(status);

    PRINT '✓ Table DC_ShellingData created successfully';
END
ELSE
BEGIN
    PRINT '! Table DC_ShellingData already exists';
END
GO

-- =============================================
-- 3. AuditLog Table - Lịch sử thay đổi
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DC_AuditLog')
BEGIN
    CREATE TABLE DC_AuditLog (
        logId INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL,
        action NVARCHAR(50) NOT NULL,           -- INSERT, UPDATE, DELETE, LOGIN
        tableName NVARCHAR(50),
        recordId INT,
        oldValue NVARCHAR(MAX),                 -- JSON data
        newValue NVARCHAR(MAX),                 -- JSON data
        ipAddress NVARCHAR(50),
        userAgent NVARCHAR(500),
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_DC_AuditLog_UserId FOREIGN KEY (userId) REFERENCES DC_Users(userId)
    );

    CREATE INDEX IDX_DC_AuditLog_UserId ON DC_AuditLog(userId);
    CREATE INDEX IDX_DC_AuditLog_Action ON DC_AuditLog(action);
    CREATE INDEX IDX_DC_AuditLog_TableName ON DC_AuditLog(tableName);
    CREATE INDEX IDX_DC_AuditLog_CreatedAt ON DC_AuditLog(createdAt);

    PRINT '✓ Table DC_AuditLog created successfully';
END
ELSE
BEGIN
    PRINT '! Table DC_AuditLog already exists';
END
GO

-- =============================================
-- 4. Tạo Admin User mặc định (nếu chưa có)
-- =============================================
-- Password: Admin@123 (đã hash bằng bcrypt)
IF NOT EXISTS (SELECT * FROM DC_Users WHERE username = 'admin')
BEGIN
    INSERT INTO DC_Users (username, email, password, fullName, role, isActive)
    VALUES (
        'admin',
        'admin@datacore.local',
        '$2a$10$xJYVz7X8vF7rF1F8vF7F1O9W8F7F1F8vF7F1F8vF7F1F8vF7F1F8vF',  -- Placeholder, sẽ set qua API
        'System Administrator',
        'admin',
        1
    );
    PRINT '✓ Default admin user created (username: admin)';
END
ELSE
BEGIN
    PRINT '! Admin user already exists';
END
GO

-- =============================================
-- Verify tables created
-- =============================================
SELECT
    TABLE_NAME as 'Table Name',
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = t.TABLE_NAME) as 'Column Count'
FROM INFORMATION_SCHEMA.TABLES t
WHERE TABLE_NAME LIKE 'DC_%'
ORDER BY TABLE_NAME;

PRINT '==============================================';
PRINT 'Database tables created successfully!';
PRINT 'Tables: DC_Users, DC_ShellingData, DC_AuditLog';
PRINT '==============================================';
