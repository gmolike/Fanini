// apps/api/src/domain/repositories/INewsletterRepository.ts
import type { Newsletter, NewsletterSubscription } from "@/domain/entities/Newsletter";

export type NewsletterFilters = {
  status?: "draft" | "scheduled" | "published";
  year?: number;
};

/**
 * Newsletter Repository Interface
 * @description Definiert Methoden für Newsletter-Datenzugriff
 */
export type INewsletterRepository = {
  // Public Methods
  findAllPublic(filters?: NewsletterFilters): Promise<Newsletter[]>;
  findByIdPublic(id: string): Promise<Newsletter | null>;

  // Internal Methods
  findAllInternal(filters?: NewsletterFilters, userId?: string): Promise<Newsletter[]>;
  create(data: Omit<Newsletter, "id" | "createdAt">, userId: string): Promise<Newsletter>;
  update(id: string, data: Partial<Newsletter>, userId: string): Promise<Newsletter>;
  delete(id: string, userId: string): Promise<void>;

  // Subscription Methods
  subscribe(email: string, data: Omit<NewsletterSubscription, "id" | "createdAt">): Promise<NewsletterSubscription>;
  confirmSubscription(email: string): Promise<void>;
  unsubscribe(email: string): Promise<void>;
  getActiveSubscribers(): Promise<NewsletterSubscription[]>;
};
