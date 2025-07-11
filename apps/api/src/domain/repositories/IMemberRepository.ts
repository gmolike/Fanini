export interface IMemberRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
