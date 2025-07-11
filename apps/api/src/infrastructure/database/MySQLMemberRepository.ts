import { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import { MySQLConnection } from "./MySQLConnection";

export class MySQLMemberRepository implements IMemberRepository {
  constructor(private db: MySQLConnection) {}

  async findAll(): Promise<any[]> {
    // TODO: Implement
    return [];
  }

  async findById(id: string): Promise<any | null> {
    // TODO: Implement
    return null;
  }

  async update(id: string, data: any): Promise<any> {
    // TODO: Implement
    return {};
  }
}
