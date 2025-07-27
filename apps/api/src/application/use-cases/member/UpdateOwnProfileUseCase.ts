// apps/api/src/application/use-cases/member/UpdateOwnProfileUseCase.ts

import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { IBenachrichtigungRepository } from "@/domain/repositories/IBenachrichtigungRepository";
import type { UpdateMemberDTO } from "@/application/dto/member";
import { createBenachrichtigung } from "@/domain/entities/Benachrichtigung";
import {
  createValidationError,
  createBusinessError,
  ERROR_CODES,
} from "@/application/dto/common";

/**
 * Update Own Profile Parameters
 */
export type UpdateOwnProfileParams = {
  /** User ID */
  readonly userId: string;
  /** Member ID */
  readonly memberId: string;
  /** Update Daten */
  readonly data: UpdateMemberDTO;
};

/**
 * Update Own Profile Result
 */
export type UpdateOwnProfileResult = {
  readonly success: boolean;
  readonly error?: any;
  readonly updatedFields?: string[];
  readonly notificationSent?: boolean;
};

/**
 * Update Own Profile Use Case
 * @description Erlaubt Mitgliedern ihr eigenes Profil zu aktualisieren
 */
export type UpdateOwnProfileUseCase = {
  execute: (params: UpdateOwnProfileParams) => Promise<UpdateOwnProfileResult>;
};

/**
 * Factory für UpdateOwnProfileUseCase
 */
export const createUpdateOwnProfileUseCase = (
  memberRepository: IMemberRepository,
  benachrichtigungRepository: IBenachrichtigungRepository
): UpdateOwnProfileUseCase => ({
  execute: async ({ userId, memberId, data }) => {
    try {
      // 1. Lade Mitglied
      const member = await memberRepository.findById(memberId);
      if (!member) {
        return {
          success: false,
          error: createBusinessError("Mitglied nicht gefunden"),
        };
      }

      // 2. Prüfe ob es das eigene Profil ist
      if (member.user_id !== userId) {
        return {
          success: false,
          error: createBusinessError("Nur eigenes Profil kann bearbeitet werden"),
        };
      }

      // 3. Validierung
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return {
            success: false,
            error: createValidationError("email", "Ungültige E-Mail-Adresse"),
          };
        }
      }

      // 4. Sensitive Felder identifizieren
      const sensitiveFields = ["email", "phone", "address", "birthdate"];
      const updatedSensitiveFields = Object.keys(data).filter(
        field => sensitiveFields.includes(field) && data[field as keyof UpdateMemberDTO] !== undefined
      );

      // 5. Update durchführen
      const updatedFields = Object.keys(data).filter(
        key => data[key as keyof UpdateMemberDTO] !== undefined
      );

      await memberRepository.update(memberId, {
        ...data,
        aktualisiert_am: new Date(),
      });

      // 6. Benachrichtigung an Beirat/Vorstand bei sensitiven Änderungen
      let notificationSent = false;
      if (updatedSensitiveFields.length > 0) {
        // Finde alle Beirat/Vorstand Mitglieder
        const leadershipMembers = await memberRepository.findAll({
          roleId: "BEIRAT,VORSTAND", // Pseudo-Filter
        });

        const changesSummary = updatedSensitiveFields
          .map(field => `${field}: ${member[field]} → ${data[field as keyof UpdateMemberDTO]}`)
          .join("\n");

        // Erstelle Benachrichtigungen
        for (const leader of leadershipMembers) {
          const benachrichtigung = createBenachrichtigung({
            empfaengerId: leader.user_id,
            typ: "system",
            titel: "Mitgliedsdaten geändert",
            nachricht: `${member.vorname} ${member.nachname} hat sensitive Daten geändert:\n${changesSummary}`,
            kontextTyp: "member",
            kontextId: memberId,
            prioritaet: "medium",
          });

          await benachrichtigungRepository.create(benachrichtigung);
        }
        notificationSent = true;
      }

      return {
        success: true,
        updatedFields,
        notificationSent,
      };

    } catch (error) {
      console.error("UpdateOwnProfileUseCase error:", error);
      return {
        success: false,
        error: createBusinessError(
          "Fehler beim Aktualisieren des Profils",
          ERROR_CODES.SYSTEM_INTERNAL_ERROR
        ),
      };
    }
  },
});
