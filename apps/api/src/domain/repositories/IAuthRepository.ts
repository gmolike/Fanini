// apps/api/src/domain/repositories/IAuthRepository.ts
import type { User, UserRole } from '../entities/User';

export interface IAuthRepository {
  // User finden
  findUserByEmail(email: string): Promise<User | null>;
  findUserByEasyVereinId(easyVereinId: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  
  // User verwalten
  createUser(userData: Omit<User, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;
  
  // Rollen
  getUserRoles(userId: string): Promise<UserRole[]>;
  assignRole(userId: string, roleId: string, assignedBy?: string): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
}