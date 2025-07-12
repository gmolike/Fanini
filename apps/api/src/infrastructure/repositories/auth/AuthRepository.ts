// src/infrastructure/repositories/auth/AuthRepository.ts
import { MySQLConnection } from "../MySQLConnection";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  updateRefreshToken(userId: string, token: string): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  constructor(private db: MySQLConnection) {}

  async findUserByEmail(email: string): Promise<any> {
    const rows = await this.db.query<any[]>(
      "SELECT * FROM mitglieder WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  }

  async createUser(userData: any): Promise<any> {
    // Implementation
    return userData;
  }

  async updateRefreshToken(userId: string, token: string): Promise<void> {
    // Implementation
  }
}
