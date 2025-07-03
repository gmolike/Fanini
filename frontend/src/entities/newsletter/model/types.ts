/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/entities/public/newsletter/model/types.ts
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

export type NewsletterArticle = {
  id: string;
  title: string;
  content: string;
  author: NewsletterAuthor;
  teamId?: string;
  teamName?: string;
  category: ArticleCategory;
  images?: {
    url: string;
    caption?: string;
    position?: 'inline' | 'header' | 'gallery';
  }[];
  order: number;
  tags?: string[];
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
};

export type NewsletterListItem = Pick<
  Newsletter,
  'id' | 'edition' | 'title' | 'subtitle' | 'publishedAt' | 'tags' | 'headerImage'
>;

export const ARTICLE_CATEGORY_CONFIG = {
  'team-update': {
    label: 'Team Update',
    icon: '👥',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  'event-recap': {
    label: 'Event Rückblick',
    icon: '📸',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  announcement: {
    label: 'Ankündigung',
    icon: '📢',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  community: {
    label: 'Community',
    icon: '🤝',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  esports: {
    label: 'E-Sports',
    icon: '🎮',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  'baller-league': {
    label: 'Baller League',
    icon: '⚽',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  feature: {
    label: 'Feature',
    icon: '✨',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
} as const;
