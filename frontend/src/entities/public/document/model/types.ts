// frontend/src/entities/public/document/model/types.ts
export type DocumentCategory = 'satzung' | 'protokolle' | 'formulare' | 'richtlinien' | 'guides';

export type DocumentStatus = 'current' | 'outdated' | 'draft';

export type Document = {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  version: string;
  status: DocumentStatus;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  downloads: number;
  tags?: string[];
  isFeatured?: boolean;
};

export type DocumentListItem = Pick<
  Document,
  'id' | 'title' | 'category' | 'fileType' | 'fileSize' | 'version' | 'publishedAt' | 'status'
> & {
  preview?: string;
};

export const DOCUMENT_CATEGORY_CONFIG = {
  satzung: {
    label: 'Satzung',
    icon: '📜',
    gradient: 'from-blue-500 to-purple-500',
    description: 'Vereinssatzung und Grundordnung',
  },
  protokolle: {
    label: 'Protokolle',
    icon: '📝',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Sitzungsprotokolle und Beschlüsse',
  },
  formulare: {
    label: 'Formulare',
    icon: '📋',
    gradient: 'from-green-500 to-teal-500',
    description: 'Anträge und Vorlagen',
  },
  richtlinien: {
    label: 'Richtlinien',
    icon: '📑',
    gradient: 'from-orange-500 to-red-500',
    description: 'Vereinsrichtlinien und Ordnungen',
  },
  guides: {
    label: 'Anleitungen',
    icon: '💡',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'How-To Guides und Tutorials',
  },
} as const;
