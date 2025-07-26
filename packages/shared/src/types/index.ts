// packages/shared/src/types/index.ts
/**
 * Shared Types from Backend
 * @module @faninitiative/shared/types
 */

// Re-export all generated types
export * from "../generated/api-types";

// Type aliases for better naming
export type Member = import("../generated/api-types").MemberDetail;
export type MemberRole = import("../generated/api-types").RoleName;
