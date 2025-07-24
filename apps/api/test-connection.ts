// apps/api/test-connection.ts
import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    console.log('Testing connection...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'fanini',
      password: 'password',
      database: 'fanini_db'
    });
    
    console.log('✅ Connected!');
    
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log('Users in DB:', rows[0].count);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();