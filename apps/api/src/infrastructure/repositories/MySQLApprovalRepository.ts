// apps/api/src/infrastructure/repositories/MySQLApprovalRepository.ts
import type { IApprovalRepository } from "@/domain/repositories/IApprovalRepository";
import type { ApprovalRequest } from "@/domain/entities/ApprovalRequest";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

/**
 * MySQL Implementation des Approval Repository
 * @description Verwaltet Genehmigungsanfragen in der MySQL Datenbank
 */
export class MySQLApprovalRepository implements IApprovalRepository {
  constructor(private readonly db: MySQLConnection) {}

  /**
   * Erstellt einen neuen Approval Request
   */
  async createRequest(
    params: Omit<ApprovalRequest, "id" | "requestedAt" | "status">,
  ): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      ...params,
      id: generateId(),
      requestedAt: new Date(),
      status: "pending",
    };

    await this.db.query(
      `INSERT INTO approval_requests
       (id, request_type, resource_type, resource_id, requested_by,
        status, old_data, new_data, changes_summary, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request.id,
        request.requestType,
        request.resourceType,
        request.resourceId,
        request.requestedBy,
        request.status,
        request.oldData ? JSON.stringify(request.oldData) : null,
        request.newData ? JSON.stringify(request.newData) : null,
        request.changesSummary,
        request.priority,
        request.dueDate,
      ],
    );

    // Benachrichtigungen für Approver erstellen
    await this.createNotificationsForApprovers(request);

    return request;
  }

  /**
   * Lädt einen Approval Request anhand der ID
   */
  async findRequestById(id: string): Promise<ApprovalRequest | null> {
    const [row] = await this.db.query<any[]>(
      `SELECT ar.*,
              u.vorname as requester_vorname,
              u.nachname as requester_nachname,
              u.email as requester_email
       FROM approval_requests ar
       JOIN users u ON ar.requested_by = u.id
       WHERE ar.id = ?`,
      [id],
    );

    if (!row) return null;

    return this.mapRowToApprovalRequest(row);
  }

  /**
   * Lädt alle offenen Requests für einen Approver
   */
  async findPendingRequestsForApprover(
    userId: string,
  ): Promise<ApprovalRequest[]> {
    // Lade Rollen des Users
    const roleRows = await this.db.query<any[]>(
      `SELECT role_id FROM user_roles WHERE user_id = ?`,
      [userId],
    );

    if (roleRows.length === 0) return [];

    const roleIds = roleRows.map((r) => r.role_id);
    const placeholders = roleIds.map(() => "?").join(",");

    // Lade Requests die diese Rollen genehmigen können
    const rows = await this.db.query<any[]>(
      `SELECT DISTINCT ar.*,
              u.vorname as requester_vorname,
              u.nachname as requester_nachname,
              u.email as requester_email,
              rule.min_approvers,
              (SELECT COUNT(*) FROM approval_actions aa
               WHERE aa.request_id = ar.id
               AND aa.action = 'approved') as current_approvals
       FROM approval_requests ar
       JOIN users u ON ar.requested_by = u.id
       JOIN approval_rules rule ON
            ar.resource_type = rule.resource_type
            AND (ar.request_type = rule.action OR rule.action IS NULL)
       WHERE ar.status = 'pending'
       AND rule.required_role_id IN (${placeholders})
       ORDER BY
         FIELD(ar.priority, 'critical', 'high', 'medium', 'low'),
         ar.requested_at ASC`,
      roleIds,
    );

    return rows.map((row) => this.mapRowToApprovalRequest(row));
  }

  /**
   * Aktualisiert den Status eines Requests
   */
  async updateRequestStatus(
    requestId: string,
    status: ApprovalRequest["status"],
    approvedBy: string,
    comment?: string,
  ): Promise<void> {
    const connection = await this.db.getConnection();
    await connection.beginTransaction();

    try {
      // Update Request Status
      await connection.query(
        `UPDATE approval_requests
         SET status = ?
         WHERE id = ?`,
        [status, requestId],
      );

      // Log Action
      const actionId = generateId();
      await connection.query(
        `INSERT INTO approval_actions
         (id, request_id, action, performed_by, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [
          actionId,
          requestId,
          status === "approved"
            ? "approved"
            : status === "rejected"
              ? "rejected"
              : "commented",
          approvedBy,
          comment,
        ],
      );

      // Prüfe ob genug Approvals vorhanden sind
      if (status === "approved") {
        await this.checkAndFinalizeApproval(requestId, connection);
      }

      // Benachrichtigungen versenden
      await this.createStatusChangeNotification(
        requestId,
        status,
        approvedBy,
        connection,
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Wendet genehmigte Änderungen an
   */
  async applyApprovedChanges(requestId: string): Promise<void> {
    const request = await this.findRequestById(requestId);
    if (!request || request.status !== "approved") {
      throw new Error("Request not approved or not found");
    }

    const connection = await this.db.getConnection();
    await connection.beginTransaction();

    try {
      switch (request.requestType) {
        case "member_edit":
          await this.applyMemberEdit(request, connection);
          break;

        case "role_assignment":
          await this.applyRoleAssignment(request, connection);
          break;

        case "event_creation":
          await this.applyEventCreation(request, connection);
          break;

        case "finance_expense":
          await this.applyFinanceExpense(request, connection);
          break;

        default:
          throw new Error(`Unknown request type: ${request.requestType}`);
      }

      // Request als angewendet markieren
      await connection.query(
        `UPDATE approval_requests
         SET status = 'applied', applied_at = NOW()
         WHERE id = ?`,
        [requestId],
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Private Helper: Erstellt Benachrichtigungen für Approver
   */
  private async createNotificationsForApprovers(
    request: ApprovalRequest,
  ): Promise<void> {
    // Finde alle User die genehmigen können
    const approverRows = await this.db.query<any[]>(
      `SELECT DISTINCT u.id
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN approval_rules rule ON ur.role_id = rule.required_role_id
       WHERE rule.resource_type = ?
       AND (rule.action = ? OR rule.action IS NULL)
       AND u.ist_aktiv = 1`,
      [request.resourceType, request.requestType],
    );

    // Erstelle Benachrichtigungen
    const notifications = approverRows.map((row) => [
      generateId(),
      request.id,
      row.id,
      "new_request",
    ]);

    if (notifications.length > 0) {
      await this.db.query(
        `INSERT INTO approval_notifications
         (id, request_id, notified_user_id, notification_type)
         VALUES ?`,
        [notifications],
      );
    }
  }

  /**
   * Private Helper: Prüft ob genug Approvals vorhanden sind
   */
  private async checkAndFinalizeApproval(
    requestId: string,
    connection: any,
  ): Promise<void> {
    const [result] = await connection.query(
      `SELECT
         ar.resource_type,
         ar.request_type,
         rule.min_approvers,
         COUNT(DISTINCT aa.performed_by) as approval_count
       FROM approval_requests ar
       JOIN approval_rules rule ON
            ar.resource_type = rule.resource_type
            AND (ar.request_type = rule.action OR rule.action IS NULL)
       LEFT JOIN approval_actions aa ON
            ar.id = aa.request_id
            AND aa.action = 'approved'
       WHERE ar.id = ?
       GROUP BY ar.id, rule.min_approvers`,
      [requestId],
    );

    if (result && result.approval_count >= result.min_approvers) {
      // Automatisch anwenden wenn genug Approvals
      await this.applyApprovedChanges(requestId);
    }
  }

  /**
   * Private Helper: Erstellt Statusänderungs-Benachrichtigung
   */
  private async createStatusChangeNotification(
    requestId: string,
    status: string,
    performedBy: string,
    connection: any,
  ): Promise<void> {
    // Benachrichtige den Antragsteller
    const [request] = await connection.query(
      `SELECT requested_by FROM approval_requests WHERE id = ?`,
      [requestId],
    );

    if (request) {
      await connection.query(
        `INSERT INTO approval_notifications
         (id, request_id, notified_user_id, notification_type)
         VALUES (?, ?, ?, 'status_change')`,
        [generateId(), requestId, request.requested_by],
      );
    }
  }

  /**
   * Private Helper: Wendet Mitglieder-Änderungen an
   */
  private async applyMemberEdit(
    request: ApprovalRequest,
    connection: any,
  ): Promise<void> {
    const updates = request.newData;
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(request.resourceId);

    await connection.query(
      `UPDATE mitglieder SET ${setClause} WHERE id = ?`,
      values,
    );
  }

  /**
   * Private Helper: Wendet Rollenzuweisung an
   */
  private async applyRoleAssignment(
    request: ApprovalRequest,
    connection: any,
  ): Promise<void> {
    await connection.query(
      `INSERT INTO user_roles (user_id, role_id, zugewiesen_von)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         zugewiesen_am = NOW(),
         zugewiesen_von = VALUES(zugewiesen_von)`,
      [request.resourceId, request.newData.roleId, request.requestedBy],
    );
  }

  /**
   * Private Helper: Wendet Event-Erstellung an
   */
  private async applyEventCreation(
    request: ApprovalRequest,
    connection: any,
  ): Promise<void> {
    const eventData = request.newData;
    await connection.query(
      `UPDATE events
       SET status = 'genehmigt',
           genehmigt_am = NOW(),
           genehmigt_von = ?
       WHERE id = ?`,
      [request.requestedBy, request.resourceId],
    );
  }

  /**
   * Private Helper: Wendet Finanz-Ausgabe an
   */
  private async applyFinanceExpense(
    request: ApprovalRequest,
    connection: any,
  ): Promise<void> {
    await connection.query(
      `UPDATE ausgaben
       SET status = 'genehmigt',
           genehmigt_von = ?,
           genehmigt_am = NOW()
       WHERE id = ?`,
      [request.requestedBy, request.resourceId],
    );
  }

  /**
   * Private Helper: Mapped Datenbank-Row zu ApprovalRequest
   */
  private mapRowToApprovalRequest(row: any): ApprovalRequest {
    return {
      id: row.id,
      requestType: row.request_type,
      resourceType: row.resource_type,
      resourceId: row.resource_id,
      requestedBy: row.requested_by,
      requestedAt: new Date(row.requested_at),
      status: row.status,
      oldData: row.old_data ? JSON.parse(row.old_data) : undefined,
      newData: row.new_data ? JSON.parse(row.new_data) : undefined,
      changesSummary: row.changes_summary,
      priority: row.priority,
      dueDate: row.due_date ? new Date(row.due_date) : undefined,
    };
  }
}

export const createApprovalRepository = (
  db: MySQLConnection,
): IApprovalRepository => {
  return new MySQLApprovalRepository(db);
};
