// apps/api/run-new-migration.ts
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runNewMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'fanini',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'fanini_db',
    multipleStatements: true
  });

  try {
    console.log('🔨 Running missing tables migration...\n');

    const migrationPath = path.join(__dirname, 'src/infrastructure/database/migrations/003_missing_tables_fix.sql');
    const sqlContent = await fs.readFile(migrationPath, 'utf-8');

    await connection.query(sqlContent);
    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runNewMigration();
