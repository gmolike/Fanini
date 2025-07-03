// frontend/src/testing/mocks/db/factories/newsletter.factory.ts
import { faker } from '@faker-js/faker/locale/de';

import type {
  ArticleCategory,
  Newsletter,
  NewsletterArticle,
  NewsletterListItem,
  NewsletterStatus,
} from '@/entities/public/newsletter';

export const createNewsletterArticle = (
  overrides?: Partial<NewsletterArticle>
): NewsletterArticle => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(3),
  excerpt: faker.lorem.paragraph(),
  author: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    role: faker.helpers.maybe(() => faker.person.jobTitle()),
    avatar: faker.helpers.maybe(() => faker.image.avatar()),
  },
  teamId: faker.helpers.maybe(() => faker.string.uuid()),
  teamName: faker.helpers.maybe(() => faker.company.name()),
  category: faker.helpers.arrayElement<ArticleCategory>([
    'team-update',
    'event-recap',
    'announcement',
    'community',
    'esports',
    'baller-league',
    'feature',
  ]),
  order: faker.number.int({ min: 0, max: 10 }),
  tags: faker.helpers.arrayElements(['news', 'update', 'team', 'event'], { min: 0, max: 3 }),
  readingTime: faker.number.int({ min: 2, max: 10 }),
  ...overrides,
});

export const createNewsletter = (overrides?: Partial<Newsletter>): Newsletter => {
  const articleCount = faker.number.int({ min: 3, max: 8 });
  const articles = Array.from({ length: articleCount }, (_, index) =>
    createNewsletterArticle({ order: index })
  );

  return {
    id: faker.string.uuid(),
    edition: faker.number.int({ min: 1, max: 100 }),
    title: faker.lorem.sentence(),
    subtitle: faker.helpers.maybe(() => faker.lorem.sentence()),
    publishedAt: faker.date.recent().toISOString(),
    author: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      role: faker.person.jobTitle(),
    },
    status: 'published' as NewsletterStatus,
    tags: faker.helpers.arrayElements(['news', 'update', 'team', 'event'], { min: 1, max: 4 }),
    headerImage: faker.helpers.maybe(() => faker.image.url()),
    introduction: faker.lorem.paragraph(),
    articles: articles.toSorted((a, b) => a.order - b.order),
    closingMessage: faker.helpers.maybe(() => faker.lorem.sentence()),
    nextEditionHint: faker.helpers.maybe(() => faker.lorem.sentence()),
    stats: {
      totalArticles: articles.length,
      estimatedReadTime: articles.reduce((sum, a) => sum + (a.readingTime ?? 5), 0),
      teams: [...new Set(articles.map(a => a.teamName).filter(Boolean) as string[])],
    },
    ...overrides,
  };
};

export const createNewsletterListItem = (
  overrides?: Partial<NewsletterListItem>
): NewsletterListItem => {
  const newsletter = createNewsletter();
  return {
    id: newsletter.id,
    edition: newsletter.edition,
    title: newsletter.title,
    subtitle: newsletter.subtitle,
    publishedAt: newsletter.publishedAt,
    tags: newsletter.tags,
    headerImage: newsletter.headerImage,
    preview: faker.lorem.paragraph(),
    articleCount: newsletter.articles.length,
    ...overrides,
  };
};

// Converter Funktionen für DB-Objekte
export const toNewsletterListItem = (dbNewsletter: Newsletter): NewsletterListItem => ({
  id: dbNewsletter.id,
  edition: dbNewsletter.edition,
  title: dbNewsletter.title,
  subtitle: dbNewsletter.subtitle,
  publishedAt: dbNewsletter.publishedAt,
  tags: dbNewsletter.tags,
  headerImage: dbNewsletter.headerImage,
  preview: `${dbNewsletter.introduction.slice(0, 200)}...`,
  articleCount: dbNewsletter.articles.length,
});

export const toNewsletterDetail = (dbNewsletter: Newsletter): Newsletter => dbNewsletter;
