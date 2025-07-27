// apps/api/src/domain/entities/FAQ.ts
import { generateId } from "@faninitiative/shared";

export type FAQCategory =
  | "allgemein"
  | "mitgliedschaft"
  | "events"
  | "technik"
  | "finanzen";

/**
 * FAQ Entity
 * @description Häufig gestellte Fragen
 */
export type FAQ = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category: FAQCategory;
  readonly orderPosition: number;
  readonly views: number;
  readonly isPopular: boolean;
  readonly updatedAt: Date;
  readonly createdAt: Date;
};

/**
 * Erstellt eine neue FAQ
 */
export const createFAQ = (params: {
  question: string;
  answer: string;
  category: FAQCategory;
  orderPosition?: number;
}): Omit<FAQ, "id" | "createdAt" | "updatedAt" | "views"> => ({
  question: params.question,
  answer: params.answer,
  category: params.category,
  orderPosition: params.orderPosition || 999,
  isPopular: false
});
