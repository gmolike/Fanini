// src/infrastructure/di/slices/memberSlice.ts
import { Container } from "../container";
import {
  createGetMembersWithPermissionUseCase,
  GetMembersUseCase,
  UpdateMemberUseCase,
} from "@/application/use-cases/member";
import { MemberController } from "@/presentation/controllers";
import { MySQLMemberRepository } from "@/infrastructure/repositories/MySQLMemberRepository";
import { createMemberDataFilterService } from "@/application/services/MemberDataFilterService";
import { createUpdateMemberWithApprovalUseCase } from "@/application/use-cases/member/UpdateMemberWithApprovalUseCase";
import { createApprovalRepository } from "@/infrastructure/repositories/MySQLApprovalRepository";
import { ProtectedMemberController } from "@/presentation/controllers/member/ProtectedMemberController";

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

  container.register("ApprovalRepository", () => {
    const db = container.get("Database");
    return createApprovalRepository(db);
  });

  container.register("MemberDataFilterService", () => {
    const permissionService = container.get("PermissionService");
    return createMemberDataFilterService(permissionService);
  });

  container.register("GetMembersWithPermissionUseCase", () => {
    const memberRepo = container.get("MemberRepository");
    const filterService = container.get("MemberDataFilterService");
    return createGetMembersWithPermissionUseCase(memberRepo, filterService);
  });

  container.register("UpdateMemberWithApprovalUseCase", () => {
    const memberRepo = container.get("MemberRepository");
    const approvalRepo = container.get("ApprovalRepository");
    const permissionService = container.get("PermissionService");
    return createUpdateMemberWithApprovalUseCase(
      memberRepo,
      approvalRepo,
      permissionService,
    );
  });

  container.register("ProtectedMemberController", () => {
    const getMembersWithPermission = container.get(
      "GetMembersWithPermissionUseCase",
    );
    const updateMemberWithApproval = container.get(
      "UpdateMemberWithApprovalUseCase",
    );
    return new ProtectedMemberController(
      getMembersWithPermission,
      updateMemberWithApproval,
    );
  });
};
