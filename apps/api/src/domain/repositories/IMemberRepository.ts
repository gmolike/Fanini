// apps/api/src/domain/repositories/IMemberRepository.ts
export interface IMemberRepository {
  findAll(filters?: {
    active?: boolean;
    search?: string;
    roleId?: string;
  }): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
