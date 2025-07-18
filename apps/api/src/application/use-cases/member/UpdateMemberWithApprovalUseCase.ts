// apps/api/src/application/use-cases/member/UpdateMemberWithApprovalUseCase.ts
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { IApprovalRepository } from "@/domain/repositories/IApprovalRepository";
import type { PermissionService } from "@/domain/services/PermissionService";
import { memberSensitiveFields } from "@/domain/value-objects/SensitiveField";

/**
 * Update Member with Approval Use Case
 * @description Aktualisiert Mitgliederdaten, erstellt Approval Request wenn nötig
 */
export type UpdateMemberWithApprovalUseCase = {
  execute: (params: {
    memberId: string;
    updates: Record<string, any>;
    userId: string;
    userRole: string;
  }) => Promise<{
    success: boolean;
    requiresApproval: boolean;
    approvalRequestId?: string;
    updatedFields?: string[];
  }>;
};

// EXPORT ALS FACTORY FUNCTION!
export const createUpdateMemberWithApprovalUseCase = (
  memberRepository: IMemberRepository,
  approvalRepository: IApprovalRepository,
  permissionService: PermissionService,
): UpdateMemberWithApprovalUseCase => ({
  execute: async ({ memberId, updates, userId, userRole }) => {
    // Lade aktuelles Mitglied
    const member = await memberRepository.findById(memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    // Prüfe welche Felder Approval benötigen
    const fieldsNeedingApproval: string[] = [];
    const directUpdateFields: string[] = [];

    for (const [field, value] of Object.entries(updates)) {
      if (permissionService.needsApproval(userRole, "edit", field)) {
        fieldsNeedingApproval.push(field);
      } else {
        directUpdateFields.push(field);
      }
    }

    // Direkte Updates durchführen (keine Approval nötig)
    if (directUpdateFields.length > 0) {
      const directUpdates = Object.fromEntries(
        directUpdateFields.map((f) => [f, updates[f]]),
      );
      await memberRepository.update(memberId, directUpdates);
    }

    // Approval Request erstellen wenn nötig
    let approvalRequestId: string | undefined;
    if (fieldsNeedingApproval.length > 0) {
      const approvalUpdates = Object.fromEntries(
        fieldsNeedingApproval.map((f) => [f, updates[f]]),
      );

      const oldData = Object.fromEntries(
        fieldsNeedingApproval.map((f) => [f, member[f]]),
      );

      const changesSummary = fieldsNeedingApproval
        .map((f) => {
          const fieldMeta = memberSensitiveFields[f];
          const label = fieldMeta?.description || f;
          return `${label}: ${member[f]} → ${updates[f]}`;
        })
        .join("\n");

      const request = await approvalRepository.createRequest({
        requestType: "member_edit",
        resourceType: "member",
        resourceId: memberId,
        requestedBy: userId,
        oldData,
        newData: approvalUpdates,
        changesSummary,
        priority: "medium",
      });

      approvalRequestId = request.id;
    }

    return {
      success: true,
      requiresApproval: fieldsNeedingApproval.length > 0,
      approvalRequestId,
      updatedFields: directUpdateFields,
    };
  },
});
