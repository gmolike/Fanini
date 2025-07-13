// frontend/src/entities/public/faq/model/types.ts
export type FaqCategory = 'mitgliedschaft' | 'events' | 'verein' | 'technik' | 'sonstige';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  order: number;
  views: number;
  isPopular?: boolean;
  relatedFaqIds?: string[];
  tags?: string[];
  updatedAt: string;
};

export const FAQ_CATEGORY_CONFIG = {
  mitgliedschaft: {
    label: 'Mitgliedschaft',
    icon: '👤',
    gradient: 'from-blue-500 to-purple-500',
  },
  events: {
    label: 'Events',
    icon: '🎉',
    gradient: 'from-purple-500 to-pink-500',
  },
  verein: {
    label: 'Verein',
    icon: '🏛️',
    gradient: 'from-green-500 to-teal-500',
  },
  technik: {
    label: 'Technik',
    icon: '💻',
    gradient: 'from-orange-500 to-red-500',
  },
  sonstige: {
    label: 'Sonstige',
    icon: '❓',
    gradient: 'from-gray-500 to-gray-700',
  },
} as const;
