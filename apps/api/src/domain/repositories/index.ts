// apps/api/src/domain/repositories/index.ts
export type {
  IDocumentRepository,
  DocumentFilters,
} from "./IDocumentRepository";

export type {
  IEventRepository,
  EventFilters,
  EventAuditLogEntry, // Explizit mit neuem Namen
} from "./IEventRepository";

export type {
  ITaskRepository,
  TaskFilters,
  TaskAuditLogEntry, // Explizit mit neuem Namen
} from "./ITaskRepository";

export type { IMemberRepository } from "./IMemberRepository";
export type { ISettingsRepository } from "./ISettingsRepository";
export type { IStatsRepository } from "./IStatsRepository";

// Alle anderen Repositories auch exportieren
export * from "./IApprovalRepository";
export * from "./IAusgabenRepository";
export * from "./IAuthRepository";
export * from "./IBenachrichtigungRepository";
export * from "./ICreatorRepository";
export * from "./IEmailVorlageRepository";
export * from "./IFAQRepository";
export * from "./IGremienRepository";
export * from "./IKommentarRepository";
export * from "./INewsletterRepository";
export * from "./IPermissionRepository";
export * from "./IProtokollRepository";
export * from "./ISocialMediaPostRepository";
