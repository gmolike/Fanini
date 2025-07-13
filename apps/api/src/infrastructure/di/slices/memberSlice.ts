// src/infrastructure/di/slices/memberSlice.ts
import { Container } from "../container";
import { GetMembersUseCase, UpdateMemberUseCase } from "@/application/use-cases/member";
import { MemberController } from "@/presentation/controllers";
import { MySQLMemberRepository } from "@/infrastructure/repositories/MySQLMemberRepository";

export const registerMemberSlice = (container: Container) => {
  container.register("MemberRepository", () => {
    const db = container.get("Database");
    return new MySQLMemberRepository(db);
  });

  container.register("GetMembersUseCase", () => {
    const repo = container.get("MemberRepository");
    return new GetMembersUseCase(repo);
  });

  container.register("UpdateMemberUseCase", () => {
    const repo = container.get("MemberRepository");
    return new UpdateMemberUseCase(repo);
  });

  container.register("MemberController", () => {
    const getMembers = container.get("GetMembersUseCase");
    const updateMember = container.get("UpdateMemberUseCase");
    return new MemberController(getMembers, updateMember);
  });
};
