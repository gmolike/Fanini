// apps/api/src/domain/repositories/IBenachrichtigungRepository.ts
import type { Benachrichtigung } from "@/domain/entities/Benachrichtigung";

export type BenachrichtigungFilters = {
  empfaengerId?: string;
  unreadOnly?: boolean;
  typ?: string;
  limit?: number;
}

export type IBenachrichtigungRepository = {
  findByEmpfaenger(empfaengerId: string, filters?: BenachrichtigungFilters): Promise<Benachrichtigung[]>;
  create(data: Omit<Benachrichtigung, 'id' | 'versendetAm'>): Promise<Benachrichtigung>;
  markAsRead(id: string, userId: string): Promise<void>;
  markAllAsRead(empfaengerId: string): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
  getUnreadCount(empfaengerId: string): Promise<number>;
}
