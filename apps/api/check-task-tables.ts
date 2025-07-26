// apps/api/check-task-tables.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkTaskTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'fanini',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'fanini_db'
  });

  try {
    // Check if tasks table exists
    const [taskTable] = await connection.execute(
      "SHOW TABLES LIKE 'tasks'"
    );
    console.log('tasks table exists:', (taskTable as any[]).length > 0);

    // Check if aufgaben table exists
    const [aufgabenTable] = await connection.execute(
      "SHOW TABLES LIKE 'aufgaben'"
    );
    console.log('aufgaben table exists:', (aufgabenTable as any[]).length > 0);

    // Check data in both tables
    const [tasksData] = await connection.execute('SELECT COUNT(*) as count FROM tasks');
    console.log('Data in tasks:', (tasksData as any[])[0].count);

    const [aufgabenData] = await connection.execute('SELECT COUNT(*) as count FROM aufgaben');
    console.log('Data in aufgaben:', (aufgabenData as any[])[0].count);

    // Check kommentare foreign key
    const [fkInfo] = await connection.execute(`
      SELECT
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_NAME = 'kommentare'
      AND TABLE_SCHEMA = 'fanini_db'
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

    console.log('\nForeign keys in kommentare:');
    console.table(fkInfo);

  } finally {
    await connection.end();
  }
}

checkTaskTables();
