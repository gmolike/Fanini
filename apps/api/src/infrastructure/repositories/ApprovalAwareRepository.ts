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

  async update(
    id: string,
    updates: Partial<T>,
    userId: string,
    userRole: string
  ): Promise<T | ApprovalRequest> {
    // Prüfe ob Approval benötigt wird
    const requiresApproval = await this.checkApprovalRequired(updates, userRole);

    if (requiresApproval) {
      // Erstelle Approval Request statt direktem Update
      const entity = await this.findById(id);
      const approvalRequest = await this.approvalRepo.createRequest({
        requestType: 'update',
        resourceType: this.tableName,
        resourceId: id,
        requestedBy: userId,
        oldData: entity,
        newData: updates,
        changesSummary: this.generateChangeSummary(entity, updates),
        priority: 'medium'
      });

      // Benachrichtige Beirat/Vorstand
      await this.notifyApprovers(approvalRequest);

      return approvalRequest;
    }

    // Direktes Update wenn kein Approval nötig
    return super.update(id, updates, userId);
  }

  private async checkApprovalRequired(
    updates: Partial<T>,
    userRole: string
  ): Promise<boolean> {
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
}
