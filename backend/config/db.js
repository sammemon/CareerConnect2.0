const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Samalimemon123',
  database: process.env.DB_NAME || 'careerconnect2',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    console.error('Please ensure MySQL is running and database credentials are correct in .env file');
    process.exit(1);
  }
};

module.exports = { pool, promisePool, testConnection };
