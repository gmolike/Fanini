// frontend/src/testing/mocks/db/factories/newsletter.factory.ts
import type { Newsletter, NewsletterListItem } from '@/entities/public/newsletter';

import { db } from '../index';

type DbNewsletter = ReturnType<typeof db.newsletter.create>;
type DbNewsletterArticle = ReturnType<typeof db.newsletterArticle.create>;
type DbNewsletterAuthor = ReturnType<typeof db.newsletterAuthor.create>;

// Helper für Author-Konvertierung
const toNewsletterAuthor = (dbAuthor: NonNullable<DbNewsletterAuthor>) => ({
  id: dbAuthor.id,
  name: dbAuthor.name,
  role: dbAuthor.role ?? undefined,
  avatar: dbAuthor.avatar ?? undefined,
});

// Helper für Article-Konvertierung
const toNewsletterArticle = (
  dbArticle: NonNullable<DbNewsletterArticle>,
  author: NonNullable<DbNewsletterAuthor>
) => ({
  id: dbArticle.id,
  title: dbArticle.title,
  content: dbArticle.content,
  author: toNewsletterAuthor(author),
  teamId: dbArticle.teamId ?? undefined,
  teamName: dbArticle.teamName ?? undefined,
  category: dbArticle.category as Newsletter['articles'][0]['category'],
  order: dbArticle.order,
  tags: dbArticle.tags as string[],
});

// Type-safe converter für Newsletter Detail
export const toNewsletterDetail = (
  dbNewsletter: NonNullable<DbNewsletter>,
  dbAuthor: NonNullable<DbNewsletterAuthor>,
  dbArticles: DbNewsletterArticle[]
): Newsletter => {
  // Für jeden Artikel den Author holen
  const articlesWithAuthors = dbArticles.map(article => {
    const articleAuthor = db.newsletterAuthor.findFirst({
      where: { id: { equals: article.authorId } },
    });
    return toNewsletterArticle(article, articleAuthor!);
  });

  return {
    id: dbNewsletter.id,
    edition: dbNewsletter.edition,
    title: dbNewsletter.title,
    subtitle: dbNewsletter.subtitle ?? undefined,
    publishedAt: dbNewsletter.publishedAt,
    author: toNewsletterAuthor(dbAuthor),
    status: dbNewsletter.status as Newsletter['status'],
    tags: dbNewsletter.tags as string[],
    headerImage: dbNewsletter.headerImage ?? undefined,
    introduction: dbNewsletter.introduction,
    articles: articlesWithAuthors.toSorted((a, b) => a.order - b.order),
    closingMessage: dbNewsletter.closingMessage ?? undefined,
    nextEditionHint: dbNewsletter.nextEditionHint ?? undefined,
  };
};

// Type-safe converter für Newsletter List Item
export const toNewsletterListItem = (
  dbNewsletter: NonNullable<DbNewsletter>
): NewsletterListItem => ({
  id: dbNewsletter.id,
  edition: dbNewsletter.edition,
  title: dbNewsletter.title,
  subtitle: dbNewsletter.subtitle ?? undefined,
  publishedAt: dbNewsletter.publishedAt,
  tags: dbNewsletter.tags as string[],
  headerImage: dbNewsletter.headerImage ?? undefined,
});
