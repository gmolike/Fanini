// apps/api/src/application/use-cases/member/index.ts

// Bestehende Exports
export { GetMembersUseCase } from "./GetMembersUseCase";
export { UpdateMemberUseCase } from "./UpdateMemberUseCase";
export { createGetMembersWithPermissionUseCase } from "./GetMembersWithPermissionUseCase";
export { createCreateLocalMemberUseCase } from "./CreateLocalMemberUseCase";
export type {
  CreateLocalMemberParams,
  CreateLocalMemberUseCase,
  CreateLocalMemberResult,
} from "./CreateLocalMemberUseCase";
export { createUpdateMemberWithApprovalUseCase } from "./UpdateMemberWithApprovalUseCase";
export type { UpdateMemberWithApprovalUseCase } from "./UpdateMemberWithApprovalUseCase";
export { createSetUserPasswordUseCase } from "./SetUserPasswordUseCase";
export type {
  SetUserPasswordParams,
  SetUserPasswordResult,
  SetUserPasswordUseCase,
} from "./SetUserPasswordUseCase";

// Neue Exports
export { createGetPublicMembersUseCase } from "./GetPublicMembersUseCase";
export type {
  GetPublicMembersParams,
  GetPublicMembersResult,
  GetPublicMembersUseCase,
} from "./GetPublicMembersUseCase";

export { createGetInternalMembersUseCase } from "./GetInternalMembersUseCase";
export type {
  GetInternalMembersParams,
  GetInternalMembersResult,
  GetInternalMembersUseCase,
} from "./GetInternalMembersUseCase";

export { createUpdateOwnProfileUseCase } from "./UpdateOwnProfileUseCase";
export type {
  UpdateOwnProfileParams,
  UpdateOwnProfileResult,
  UpdateOwnProfileUseCase,
} from "./UpdateOwnProfileUseCase";

export { createGetMemberByIdUseCase } from "./GetMemberByIdUseCase";
export type {
  GetMemberByIdParams,
  GetMemberByIdResult,
  GetMemberByIdUseCase,
} from "./GetMemberByIdUseCase";
