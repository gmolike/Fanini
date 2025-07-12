import { IMemberRepository } from '@/domain/repositories/IMemberRepository';

export class GetMembersUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(): Promise<any[]> {
    return await this.memberRepository.findAll();
  }
}
