/**
 * Database Setup Script
 * Run this to create the PT_QC_ShellingSamples table
 * Usage: node backend/database/setup-database.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  let connection;

  try {
    console.log('🔄 Connecting to MySQL database...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Database: ${process.env.DB_DATABASE}`);
    console.log(`   User: ${process.env.DB_USER}`);

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('✅ Connected to MySQL successfully\n');

    // Read SQL file
    const sqlFile = join(__dirname, 'create-shelling-table.sql');
    console.log('📄 Reading SQL file:', sqlFile);
    const sql = readFileSync(sqlFile, 'utf8');

    // Execute SQL
    console.log('🔄 Creating PT_QC_ShellingSamples table...');
    await connection.query(sql);
    console.log('✅ Table created successfully\n');

    // Verify table exists
    console.log('🔄 Verifying table structure...');
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'PT_QC_ShellingSamples'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_DATABASE]);

    console.log('✅ Table structure:');
    console.table(columns);

    // Check if table has data
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as count FROM PT_QC_ShellingSamples'
    );
    console.log(`\n📊 Current records in table: ${countResult[0].count}`);

    console.log('\n✅ Database setup completed successfully!');
    console.log('🚀 You can now start the backend server');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    console.error('   Full error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run setup
setupDatabase();
