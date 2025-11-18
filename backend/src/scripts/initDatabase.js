import { getPool, closePool } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const createTablesSQL = `
-- Create DC_Users table (prefix DC_ to avoid conflicts)
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

    PRINT 'Table DC_Users created successfully';
END
ELSE
BEGIN
    PRINT 'Table DC_Users already exists';
END
GO

-- Create DC_ShellingData table (for QC data)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DC_ShellingData')
BEGIN
    CREATE TABLE DC_ShellingData (
        id INT IDENTITY(1,1) PRIMARY KEY,
        recordDate DATE NOT NULL,
        shift NVARCHAR(20) NOT NULL,
        operatorName NVARCHAR(100) NOT NULL,
        machineId NVARCHAR(50),
        lotNumber NVARCHAR(50),
        rawMaterialBatch NVARCHAR(50),

        -- Quality metrics
        inputWeight DECIMAL(10,2),
        outputWeight DECIMAL(10,2),
        shellingRate DECIMAL(5,2),
        brokenRate DECIMAL(5,2),
        moistureContent DECIMAL(5,2),

        -- Grade classification
        gradeA DECIMAL(10,2),
        gradeB DECIMAL(10,2),
        gradeC DECIMAL(10,2),
        reject DECIMAL(10,2),

        -- Additional data
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

    PRINT 'Table DC_ShellingData created successfully';
END
ELSE
BEGIN
    PRINT 'Table DC_ShellingData already exists';
END
GO

-- Create DC_AuditLog table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DC_AuditLog')
BEGIN
    CREATE TABLE DC_AuditLog (
        logId INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL,
        action NVARCHAR(50) NOT NULL,
        tableName NVARCHAR(50),
        recordId INT,
        oldValue NVARCHAR(MAX),
        newValue NVARCHAR(MAX),
        ipAddress NVARCHAR(50),
        userAgent NVARCHAR(500),
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_DC_AuditLog_UserId FOREIGN KEY (userId) REFERENCES DC_Users(userId)
    );

    CREATE INDEX IDX_DC_AuditLog_UserId ON DC_AuditLog(userId);
    CREATE INDEX IDX_DC_AuditLog_Action ON DC_AuditLog(action);
    CREATE INDEX IDX_DC_AuditLog_TableName ON DC_AuditLog(tableName);
    CREATE INDEX IDX_DC_AuditLog_CreatedAt ON DC_AuditLog(createdAt);

    PRINT 'Table DC_AuditLog created successfully';
END
ELSE
BEGIN
    PRINT 'Table DC_AuditLog already exists';
END
GO
`;

async function initDatabase() {
  let pool;

  try {
    console.log('🔄 Connecting to SQL Server...');
    pool = await getPool();

    console.log('🔄 Creating database tables...');

    // Split by GO statements and execute each batch
    const batches = createTablesSQL
      .split(/^\s*GO\s*$/gim)
      .map(batch => batch.trim())
      .filter(batch => batch.length > 0);

    for (const batch of batches) {
      try {
        await pool.request().batch(batch);
      } catch (error) {
        console.error('Error executing batch:', error.message);
      }
    }

    console.log('✅ Database initialization completed successfully!');
    console.log('\n📋 Tables created:');
    console.log('  - DC_Users (with roles: admin, user, viewer)');
    console.log('  - DC_ShellingData (for QC data)');
    console.log('  - DC_AuditLog (for audit trail)');
    console.log('\n💡 Next steps:');
    console.log('  1. Create an admin user using the API');
    console.log('  2. Start the server with: npm start');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await closePool();
    console.log('\n✅ Database connection closed');
  }
}

// Run initialization
initDatabase();
