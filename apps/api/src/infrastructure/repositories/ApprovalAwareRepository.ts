// apps/api/src/infrastructure/repositories/ApprovalAwareRepository.ts
import { BaseRepository } from "./BaseRepository";
import { IApprovalRepository } from "@/domain/repositories/IApprovalRepository";
import { MySQLConnection } from "./MySQLConnection";
import { ApprovalRequest } from "@/domain/entities/ApprovalRequest";

export abstract class ApprovalAwareRepository<T> extends BaseRepository<T> {
  constructor(
    protected readonly db: MySQLConnection,
    protected readonly tableName: string,
    protected readonly approvalRepo: IApprovalRepository,
    protected readonly approvalFields: string[] = []
  ) {
    super(db, tableName);
  }

  /**
   * Abstract method - muss von Subklassen implementiert werden
   */
  abstract findById(id: string): Promise<T | null>;

  /**
   * Update mit Approval-Check
   */
  async updateWithApproval(
    id: string,
    updates: Partial<T>,
    userId: string,
    userRole: string
  ): Promise<T | ApprovalRequest> {
    // Prüfe ob Approval benötigt wird
    const requiresApproval = this.checkApprovalRequired(updates, userRole);

    if (requiresApproval) {
      // Erstelle Approval Request statt direktem Update
      const entity = await this.findById(id);
      if (!entity) {
        throw new Error(`${this.tableName} with id ${id} not found`);
      }

      const approvalRequest = await this.approvalRepo.createRequest({
        requestType: 'member_edit', // TODO: Dynamisch basierend auf tableName
        resourceType: this.tableName,
        resourceId: id,
        requestedBy: userId,
        oldData: entity,
        newData: updates,
        changesSummary: this.generateChangeSummary(entity, updates),
        priority: 'medium'
      });

      return approvalRequest;
    }

    // Direktes Update wenn kein Approval nötig
    return this.performUpdate(id, updates, userId);
  }

  /**
   * Prüft ob Approval benötigt wird
   */
  protected checkApprovalRequired(
    updates: Partial<T>,
    userRole: string
  ): boolean {
    // Admin und Vorstand brauchen kein Approval
    if (['ADMIN', 'VORSTAND'].includes(userRole)) {
      return false;
    }

    // Prüfe ob sensitive Felder geändert werden
    const sensitiveFields = Object.keys(updates).filter(field =>
      this.approvalFields.includes(field)
    );

    return sensitiveFields.length > 0;
  }

  /**
   * Abstract method für das eigentliche Update
   */
  protected abstract performUpdate(
    id: string,
    updates: Partial<T>,
    userId: string
  ): Promise<T>;

  /**
   * Generiert eine Zusammenfassung der Änderungen
   */
  protected generateChangeSummary(
    oldData: T,
    newData: Partial<T>
  ): string {
    const changes: string[] = [];

    for (const [key, newValue] of Object.entries(newData)) {
      const oldValue = (oldData as any)[key];
      if (oldValue !== newValue) {
        changes.push(`${key}: ${oldValue} → ${newValue}`);
      }
    }

    return changes.join(', ');
  }
}
