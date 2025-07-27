// apps/api/src/domain/entities/Newsletter.ts
import { generateId } from "@faninitiative/shared";

export type NewsletterStatus = "draft" | "scheduled" | "published";

export type NewsletterSection = {
  readonly title: string;
  readonly content: string;
  readonly image?: string;
  readonly link?: string;
  readonly orderPosition: number;
};

/**
 * Newsletter Entity
 * @description Repräsentiert einen Newsletter
 */
export type Newsletter = {
  readonly id: string;
  readonly edition: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly publishedAt?: Date;
  readonly status: NewsletterStatus;
  readonly headerImage?: string;
  readonly introduction: string;
  readonly sections: NewsletterSection[];
  readonly closingMessage?: string;
  readonly nextEditionHint?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

/**
 * Newsletter Subscription
 * @description Newsletter-Abonnement
 */
export type NewsletterSubscription = {
  readonly id: string;
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly acceptsMarketing: boolean;
  readonly confirmedAt?: Date;
  readonly unsubscribedAt?: Date;
  readonly createdAt: Date;
};

/**
 * Erstellt einen neuen Newsletter
 */
export const createNewsletter = (params: {
  edition: string;
  title: string;
  subtitle?: string;
  introduction: string;
}): Omit<Newsletter, "id" | "createdAt" | "updatedAt"> => ({
  edition: params.edition,
  title: params.title,
  subtitle: params.subtitle,
  status: "draft",
  headerImage: undefined,
  introduction: params.introduction,
  sections: [],
  closingMessage: undefined,
  nextEditionHint: undefined,
  publishedAt: undefined,
});

/**
 * Erstellt eine Newsletter-Subscription
 */
export const createNewsletterSubscription = (params: {
  email: string;
  firstName?: string;
  lastName?: string;
}): Omit<NewsletterSubscription, "id" | "createdAt"> => ({
  email: params.email,
  firstName: params.firstName,
  lastName: params.lastName,
  acceptsMarketing: true,
  confirmedAt: undefined,
  unsubscribedAt: undefined,
});
