// frontend/src/testing/mocks/db/schemas/newsletter.schema.ts
import { nullable, primaryKey } from '@mswjs/data';

export const newsletterAuthor = {
  id: primaryKey(String),
  name: String,
  role: nullable(String),
  avatar: nullable(String),
};

export const newsletterImage = {
  id: primaryKey(String),
  url: String,
  caption: nullable(String),
  position: nullable(String),
};

export const newsletterArticle = {
  id: primaryKey(String),
  newsletterId: String,
  title: String,
  content: String,
  authorId: String,
  teamId: nullable(String),
  teamName: nullable(String),
  category: String,
  order: Number,
  tags: Array,
};

export const newsletter = {
  id: primaryKey(String),
  edition: Number,
  title: String,
  subtitle: nullable(String),
  publishedAt: String,
  authorId: String,
  status: String,
  tags: Array,
  headerImage: nullable(String),
  introduction: String,
  closingMessage: nullable(String),
  nextEditionHint: nullable(String),
};

export const newsletterSubscription = {
  id: primaryKey(String),
  email: String,
  firstName: String,
  lastName: nullable(String),
  acceptsMarketing: Boolean,
  subscribedAt: String,
  confirmed: Boolean,
  confirmationToken: nullable(String),
};
