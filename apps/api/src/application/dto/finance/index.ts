// apps/api/src/application/dto/finance/index.ts

// Import Entity Types
import type { AusgabeKategorie, AusgabeStatus } from "@/domain/entities/Ausgabe";
import type { AuditLogEntryDTO } from "@/application/dto/audit";

// List DTOs
export type {
  PublicAusgabeListDTO,
  InternalAusgabeListDTO,
  AusgabePermissionsDTO,
} from "./AusgabeListDTO";

// Detail DTOs
export type {
  PublicAusgabeDetailDTO,
  InternalAusgabeDetailDTO,
  UserReferenceDTO,
  AusgabeMetadataDTO,
} from "./AusgabeDetailDTO";

// Create/Update DTOs
export type {
  CreateAusgabeDTO,
  UpdateAusgabeDTO,
  ApproveAusgabeDTO,
  RejectAusgabeDTO,
  FileUploadDTO,
} from "./CreateAusgabeDTO";

// Report DTOs
export type {
  FinancialReportDTO,
  BudgetOverviewDTO,
  FinancialExportDTO,
} from "./FinancialReportDTO";

// Stats DTOs
export type {
  AusgabenYearlyStats,
} from "./AusgabenStatsDTO";

// Approval DTOs
export type {
  ApprovalRequestDTO,
} from "./ApprovalRequestDTO";

// Re-export Entity Types
export type { AusgabeKategorie, AusgabeStatus };
