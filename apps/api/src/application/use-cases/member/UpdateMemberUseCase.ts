import { IMemberRepository } from '@/domain/repositories/IMemberRepository';

export class UpdateMemberUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(params: { id: string; data: any }): Promise<any> {
    return await this.memberRepository.update(params.id, params.data);
  }
}
