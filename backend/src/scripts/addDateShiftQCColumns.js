import { getPool, closePool } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const migrationSQL = `
-- Add new columns for Date, Shift, and QCName to PT_QC_ShellingSamples table
-- This migration separates these fields from ChuThich for better data management

-- Check if columns already exist before adding
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_NAME = 'PT_QC_ShellingSamples' AND COLUMN_NAME = 'Date')
BEGIN
    ALTER TABLE PT_QC_ShellingSamples
    ADD [Date] DATE NULL;
    PRINT '✓ Column Date added';
END
ELSE
BEGIN
    PRINT '! Column Date already exists';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_NAME = 'PT_QC_ShellingSamples' AND COLUMN_NAME = 'Shift')
BEGIN
    ALTER TABLE PT_QC_ShellingSamples
    ADD [Shift] NVARCHAR(20) NULL;
    PRINT '✓ Column Shift added';
END
ELSE
BEGIN
    PRINT '! Column Shift already exists';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_NAME = 'PT_QC_ShellingSamples' AND COLUMN_NAME = 'QCName')
BEGIN
    ALTER TABLE PT_QC_ShellingSamples
    ADD [QCName] NVARCHAR(100) NULL;
    PRINT '✓ Column QCName added';
END
ELSE
BEGIN
    PRINT '! Column QCName already exists';
END

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_PT_QC_ShellingSamples_Date')
BEGIN
    CREATE INDEX IDX_PT_QC_ShellingSamples_Date ON PT_QC_ShellingSamples([Date]);
    PRINT '✓ Index on Date created';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_PT_QC_ShellingSamples_Shift')
BEGIN
    CREATE INDEX IDX_PT_QC_ShellingSamples_Shift ON PT_QC_ShellingSamples([Shift]);
    PRINT '✓ Index on Shift created';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_PT_QC_ShellingSamples_QCName')
BEGIN
    CREATE INDEX IDX_PT_QC_ShellingSamples_QCName ON PT_QC_ShellingSamples([QCName]);
    PRINT '✓ Index on QCName created';
END

-- Migrate existing data from ChuThich to new columns
-- Format in ChuThich is: "date - shift - qcName - notes"
UPDATE PT_QC_ShellingSamples
SET
    [Date] = TRY_CAST(
        CASE
            WHEN CHARINDEX(' - ', ChuThich) > 0
            THEN LEFT(ChuThich, CHARINDEX(' - ', ChuThich) - 1)
            ELSE NULL
        END AS DATE
    ),
    [Shift] =
        CASE
            WHEN CHARINDEX(' - ', ChuThich) > 0 AND
                 CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich) + 3) > 0
            THEN LTRIM(RTRIM(SUBSTRING(
                ChuThich,
                CHARINDEX(' - ', ChuThich) + 3,
                CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich) + 3) - CHARINDEX(' - ', ChuThich) - 3
            )))
            ELSE NULL
        END,
    [QCName] =
        CASE
            WHEN CHARINDEX(' - ', ChuThich) > 0 AND
                 CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich) + 3) > 0
            THEN LTRIM(RTRIM(SUBSTRING(
                ChuThich,
                CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich) + 3) + 3,
                CASE
                    WHEN CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich) + 3) + 3) > 0
                    THEN CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich) + 3) + 3) - CHARINDEX(' - ', ChuThich, CHARINDEX(' - ', ChuThich) + 3) - 3
                    ELSE LEN(ChuThich)
                END
            )))
            ELSE NULL
        END
WHERE ChuThich IS NOT NULL
  AND [Date] IS NULL
  AND [Shift] IS NULL
  AND [QCName] IS NULL;

PRINT '✓ Existing data migrated from ChuThich';
PRINT '==============================================';
PRINT 'Migration completed successfully!';
PRINT 'New columns added: Date, Shift, QCName';
PRINT '==============================================';
`;

async function runMigration() {
  let pool;

  try {
    console.log('🔄 Connecting to SQL Server...');
    pool = await getPool();

    console.log('🔄 Running migration to add Date, Shift, QCName columns...');

    // Execute the migration SQL
    const result = await pool.request().batch(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('\n📋 Changes applied:');
    console.log('  - Column "Date" added to PT_QC_ShellingSamples');
    console.log('  - Column "Shift" added to PT_QC_ShellingSamples');
    console.log('  - Column "QCName" added to PT_QC_ShellingSamples');
    console.log('  - Indexes created for better performance');
    console.log('  - Existing data migrated from ChuThich field');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await closePool();
    console.log('\n✅ Database connection closed');
  }
}

// Run migration
runMigration();
