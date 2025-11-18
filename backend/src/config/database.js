import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

let pool = null;

/**
 * Get database connection pool
 * @returns {Promise<mysql.Pool>}
 */
export async function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool(config);

      // Test connection
      const connection = await pool.getConnection();
      console.log('✅ Connected to MySQL successfully');
      connection.release();

      // Handle pool errors
      pool.on('error', err => {
        console.error('❌ MySQL pool error:', err);
        pool = null;
      });
    } catch (error) {
      console.error('❌ Failed to connect to MySQL:', error.message);
      throw error;
    }
  }
  return pool;
}

/**
 * Close database connection
 */
export async function closePool() {
  if (pool) {
    try {
      await pool.end();
      pool = null;
      console.log('✅ MySQL connection closed');
    } catch (error) {
      console.error('❌ Error closing MySQL connection:', error);
      throw error;
    }
  }
}

/**
 * Execute a query with parameters
 * @param {string} query - SQL query
 * @param {Array|Object} params - Query parameters
 * @returns {Promise<Array>}
 */
export async function executeQuery(query, params = []) {
  try {
    const poolConnection = await getPool();
    const [rows] = await poolConnection.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

export { mysql };
