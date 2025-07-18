// src/infrastructure/di/slices/memberSlice.ts
import { Container } from "../container";
import {
  createCreateLocalMemberUseCase,
  createGetMembersWithPermissionUseCase,
  createSetUserPasswordUseCase,
  GetMembersUseCase,
  UpdateMemberUseCase,
} from "@/application/use-cases/member";
import { MemberController } from "@/presentation/controllers";
import { MySQLMemberRepository } from "@/infrastructure/repositories/MySQLMemberRepository";
import { createMemberDataFilterService } from "@/application/services/MemberDataFilterService";
import { createUpdateMemberWithApprovalUseCase } from "@/application/use-cases/member/UpdateMemberWithApprovalUseCase";
import { createApprovalRepository } from "@/infrastructure/repositories/MySQLApprovalRepository";
import { ProtectedMemberController } from "@/presentation/controllers/member/ProtectedMemberController";
import { createPasswordService } from "@/domain/services/PasswordService";
import { createTransactionManager } from "@/infrastructure/database/TransactionManager";
import { LocalMemberController } from "@/presentation/controllers/member/LocalMemberController";

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
  container.register("TransactionManager", () => {
    const db = container.get("Database");
    return createTransactionManager(db);
  });

  container.register("PasswordService", () => {
    return createPasswordService();
  });

  container.register("CreateLocalMemberUseCase", () => {
    const authRepo = container.get("AuthRepository");
    const memberRepo = container.get("MemberRepository");
    const passwordService = container.get("PasswordService");
    const transactionManager = container.get("TransactionManager");

    return createCreateLocalMemberUseCase(
      authRepo,
      memberRepo,
      passwordService,
      transactionManager,
    );
  });

  container.register("SetUserPasswordUseCase", () => {
    const authRepo = container.get("AuthRepository");
    const passwordService = container.get("PasswordService");

    return createSetUserPasswordUseCase(authRepo, passwordService);
  });

  container.register("LocalMemberController", () => {
    const createLocalMember = container.get("CreateLocalMemberUseCase");
    const setUserPassword = container.get("SetUserPasswordUseCase");

    return new LocalMemberController(createLocalMember, setUserPassword);
  });
};
