// entities/public/creator/model/types.ts
export type CreatorType = 'grafik' | 'foto' | 'video' | 'musik' | 'other';

export type Creator = {
  id: string;
  memberId: string;
  artistName: string;
  realName?: string;
  profileImage?: string;
  description: string;
  type: CreatorType[];
  portfolio: string;
  isActive: boolean;
  activeSince: string;
  deactivatedAt?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
  stats: {
    worksCount: number;
    viewsCount: number;
    likesCount: number;
  };
};

export type CreatorWork = {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'audio' | 'text';
  fileUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  publishedAt?: string;
  isPublic: boolean;
  order: number;
  tags: string[];
  stats: {
    views: number;
    likes: number;
  };
};

export type CreatorListItem = {
  id: string;
  artistName: string;
  profileImage?: string;
  type: CreatorType[];
  shortDescription: string;
  worksCount: number;
  isActive: boolean;
};

// Constants
export const CREATOR_TYPE_CONFIG: Record<
  CreatorType,
  {
    label: string;
    icon: string;
    gradient: string;
    color: string;
  }
> = {
  grafik: {
    label: 'Grafik Design',
    icon: '🎨',
    gradient: 'from-purple-500 to-purple-600',
    color: 'purple',
  },
  foto: {
    label: 'Fotografie',
    icon: '📸',
    gradient: 'from-amber-500 to-amber-600',
    color: 'amber',
  },
  video: {
    label: 'Video',
    icon: '🎬',
    gradient: 'from-red-500 to-red-600',
    color: 'red',
  },
  musik: {
    label: 'Musik',
    icon: '🎵',
    gradient: 'from-green-500 to-green-600',
    color: 'green',
  },
  other: {
    label: 'Sonstiges',
    icon: '✨',
    gradient: 'from-gray-500 to-gray-600',
    color: 'gray',
  },
};

export type CreatorsListResponse = {
  data: CreatorListItem[];
  meta?: {
    total: number;
    types: string[];
  };
};

export type CreatorDetailResponse = {
  data: Creator;
};

export type CreatorWorksResponse = {
  data: CreatorWork[];
  meta?: {
    total: number;
    hasMore: boolean;
  };
};
