import { getPool, closePool } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  let pool;

  try {
    console.log('🔄 Connecting to MySQL...');
    pool = await getPool();

    console.log('🔄 Creating database tables...');

    // Create DC_Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS DC_Users (
        userId INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(100) NOT NULL,
        role ENUM('admin', 'user', 'viewer') NOT NULL DEFAULT 'user',
        isActive BOOLEAN NOT NULL DEFAULT TRUE,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX IDX_DC_Users_Username (username),
        INDEX IDX_DC_Users_Email (email),
        INDEX IDX_DC_Users_Role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table DC_Users created/verified');

    // Create PT_QC_ShellingSamples table (matching your MySQL schema)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS PT_QC_ShellingSamples (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        Ngay DATE,
        Ca VARCHAR(20),
        QC VARCHAR(50),
        Lot VARCHAR(50),
        NguonGoc VARCHAR(100),
        Line VARCHAR(50),
        Size VARCHAR(20),
        ThuTuMau INT,
        OutputValue VARCHAR(100),
        KhoiLuong DECIMAL(10,2),
        WholePct DECIMAL(5,2),
        BrokenBeGocPct DECIMAL(5,2),
        BeDoiVaManhPct DECIMAL(5,2),
        VetDaoPct DECIMAL(5,2),
        ShellPct DECIMAL(5,2),
        TotalBrokenPct DECIMAL(5,2),
        KetLuan VARCHAR(255),
        ChuThich VARCHAR(500),
        
        -- Audit fields (thêm để tracking)
        CreatedBy INT,
        UpdatedBy INT,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes for better performance
        INDEX IDX_ShellingSamples_Ngay (Ngay),
        INDEX IDX_ShellingSamples_Ca (Ca),
        INDEX IDX_ShellingSamples_Lot (Lot),
        INDEX IDX_ShellingSamples_Line (Line),
        INDEX IDX_ShellingSamples_QC (QC),
        
        -- Foreign keys
        CONSTRAINT FK_ShellingSamples_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES DC_Users(userId) ON DELETE SET NULL,
        CONSTRAINT FK_ShellingSamples_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES DC_Users(userId) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table PT_QC_ShellingSamples created/verified');

    // Create DC_AuditLog table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS DC_AuditLog (
        logId INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        tableName VARCHAR(50),
        recordId INT,
        oldValue JSON,
        newValue JSON,
        ipAddress VARCHAR(50),
        userAgent VARCHAR(500),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        INDEX IDX_DC_AuditLog_UserId (userId),
        INDEX IDX_DC_AuditLog_Action (action),
        INDEX IDX_DC_AuditLog_TableName (tableName),
        INDEX IDX_DC_AuditLog_CreatedAt (createdAt),
        
        CONSTRAINT FK_DC_AuditLog_UserId FOREIGN KEY (userId) REFERENCES DC_Users(userId) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Table DC_AuditLog created/verified');

    // Create default admin user if not exists
    const [existingAdmin] = await pool.execute(
      'SELECT userId FROM DC_Users WHERE username = ?',
      ['admin']
    );

    if (existingAdmin.length === 0) {
      // Note: In production, use bcrypt to hash this password
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.execute(`
        INSERT INTO DC_Users (username, email, password, fullName, role)
        VALUES (?, ?, ?, ?, ?)
      `, ['admin', 'admin@datacore.local', hashedPassword, 'System Administrator', 'admin']);
      
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\n📋 Tables created:');
    console.log('  - DC_Users (with roles: admin, user, viewer)');
    console.log('  - PT_QC_ShellingSamples (for QC Shelling data)');
    console.log('  - DC_AuditLog (for audit trail)');
    console.log('\n📊 PT_QC_ShellingSamples columns:');
    console.log('  - Ngay, Ca, QC, Lot, NguonGoc, Line, Size');
    console.log('  - ThuTuMau, OutputValue, KhoiLuong');
    console.log('  - WholePct, BrokenBeGocPct, BeDoiVaManhPct');
    console.log('  - VetDaoPct, ShellPct, TotalBrokenPct');
    console.log('  - KetLuan, ChuThich');
    console.log('\n💡 Next steps:');
    console.log('  1. Login with admin/admin123');
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