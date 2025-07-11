import mysql from 'mysql2/promise';

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

export class MySQLConnection {
  private pool: mysql.Pool;

  constructor(config: DatabaseConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  async query<T>(sql: string, params?: any[]): Promise<T> {
    const [results] = await this.pool.execute(sql, params);
    return results as T;
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async close() {
    await this.pool.end();
  }
}
