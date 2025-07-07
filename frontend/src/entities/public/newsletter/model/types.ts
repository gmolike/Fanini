// frontend/src/entities/public/newsletter/model/types.ts
/* eslint-disable @typescript-eslint/naming-convention */
export type NewsletterStatus = 'draft' | 'published' | 'archived';

export type ArticleCategory =
  | 'team-update'
  | 'event-recap'
  | 'announcement'
  | 'community'
  | 'esports'
  | 'baller-league'
  | 'feature';

export type NewsletterAuthor = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
};

export type NewsletterImage = {
  url: string;
  caption?: string;
  position?: 'inline' | 'header' | 'gallery';
};

export type NewsletterArticle = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: NewsletterAuthor;
  teamId?: string;
  teamName?: string;
  category: ArticleCategory;
  images?: NewsletterImage[];
  order: number;
  tags?: string[];
  readingTime?: number;
};

export type Newsletter = {
  id: string;
  edition: number;
  title: string;
  subtitle?: string;
  publishedAt: string;
  author: NewsletterAuthor;
  status: NewsletterStatus;
  tags: string[];
  headerImage?: string;
  introduction: string;
  articles: NewsletterArticle[];
  closingMessage?: string;
  nextEditionHint?: string;
  stats?: {
    totalArticles: number;
    estimatedReadTime: number;
    teams: string[];
  };
};

export type NewsletterListItem = Pick<
  Newsletter,
  'id' | 'edition' | 'title' | 'subtitle' | 'publishedAt' | 'tags' | 'headerImage'
> & {
  preview: string;
  articleCount: number;
};

export type NewsletterListResponse = {
  data: NewsletterListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
};

export type NewsletterDetailResponse = {
  data: Newsletter;
};

export type NewsletterSubscription = {
  email: string;
  firstName: string;
  lastName?: string;
  acceptsMarketing: boolean;
};

export const ARTICLE_CATEGORY_CONFIG = {
  'team-update': {
    label: 'Team Update',
    icon: '👥',
    gradient: 'from-blue-500 to-purple-500',
  },
  'event-recap': {
    label: 'Event Rückblick',
    icon: '📸',
    gradient: 'from-purple-500 to-pink-500',
  },
  announcement: {
    label: 'Ankündigung',
    icon: '📢',
    gradient: 'from-red-500 to-orange-500',
  },
  community: {
    label: 'Community',
    icon: '🤝',
    gradient: 'from-green-500 to-teal-500',
  },
  esports: {
    label: 'E-Sports',
    icon: '🎮',
    gradient: 'from-indigo-500 to-purple-500',
  },
  'baller-league': {
    label: 'Baller League',
    icon: '⚽',
    gradient: 'from-orange-500 to-red-500',
  },
  feature: {
    label: 'Feature',
    icon: '✨',
    gradient: 'from-pink-500 to-purple-500',
  },
} as const;
