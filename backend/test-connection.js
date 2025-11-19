/**
 * Database Connection Test Script
 * Run this to verify MySQL connection and table existence
 */

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Password: ${'*'.repeat(config.password?.length || 0)}\n`);

  let connection;

  try {
    // Test 1: Connect to MySQL
    console.log('📡 Step 1: Connecting to MySQL server...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully!\n');

    // Test 2: Check database
    console.log('📂 Step 2: Checking database...');
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [config.database]);
    if (databases.length === 0) {
      console.log(`❌ Database "${config.database}" not found!`);
      return;
    }
    console.log(`✅ Database "${config.database}" exists!\n`);

    // Test 3: Check table PT_QC_ShellingSamples
    console.log('📊 Step 3: Checking table PT_QC_ShellingSamples...');
    const [tables] = await connection.query('SHOW TABLES LIKE ?', ['PT_QC_ShellingSamples']);

    if (tables.length === 0) {
      console.log('❌ Table "PT_QC_ShellingSamples" not found!');
      console.log('💡 You need to create this table first.\n');
      return;
    }
    console.log('✅ Table "PT_QC_ShellingSamples" exists!\n');

    // Test 4: Get table structure
    console.log('🔧 Step 4: Table structure:');
    const [columns] = await connection.query('DESCRIBE PT_QC_ShellingSamples');
    console.log('Columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Key === 'PRI' ? '[PRIMARY KEY]' : ''}`);
    });
    console.log('');

    // Test 5: Count records
    console.log('📈 Step 5: Checking data...');
    const [countResult] = await connection.query('SELECT COUNT(*) as count FROM PT_QC_ShellingSamples');
    const recordCount = countResult[0].count;
    console.log(`✅ Total records: ${recordCount}\n`);

    // Test 6: Get sample data
    if (recordCount > 0) {
      console.log('📝 Step 6: Sample data (latest 3 records):');
      const [samples] = await connection.query(
        'SELECT * FROM PT_QC_ShellingSamples ORDER BY CreatedAt DESC LIMIT 3'
      );
      console.table(samples);
    } else {
      console.log('⚠️  No data in table yet.\n');
    }

    // Test 7: Test indexes
    console.log('🔍 Step 7: Checking indexes...');
    const [indexes] = await connection.query('SHOW INDEX FROM PT_QC_ShellingSamples');
    const indexNames = [...new Set(indexes.map(idx => idx.Key_name))];
    console.log('Indexes:', indexNames.join(', '));
    console.log('');

    console.log('✅✅✅ ALL TESTS PASSED! ✅✅✅');
    console.log('\n🎉 Your database is ready to use!\n');
    console.log('Next steps:');
    console.log('  1. Start backend: cd backend && npm run dev');
    console.log('  2. Start frontend: cd datacore-factory && npm run dev');
    console.log('  3. Open browser: http://localhost:5173\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('  1. Check if MySQL server is running');
    console.error('  2. Verify credentials in backend/.env');
    console.error('  3. Check firewall settings');
    console.error('  4. Ensure database and table exist\n');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connection closed.');
    }
  }
}

// Run the test
testConnection();
