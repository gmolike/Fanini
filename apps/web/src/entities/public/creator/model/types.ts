// entities/public/creator/model/types.ts
import type {
  creatorDetailResponseSchema,
  creatorListItemSchema,
  creatorSchema,
  creatorsListResponseSchema,
  creatorWorkSchema,
  creatorWorksResponseSchema,
} from './schemas';
import type { z } from 'zod';

// Type Exports
export type Creator = z.infer<typeof creatorSchema>;
export type CreatorListItem = z.infer<typeof creatorListItemSchema>;
export type CreatorWork = z.infer<typeof creatorWorkSchema>;
export type CreatorsListResponse = z.infer<typeof creatorsListResponseSchema>;
export type CreatorDetailResponse = z.infer<typeof creatorDetailResponseSchema>;
export type CreatorWorksResponse = z.infer<typeof creatorWorksResponseSchema>;
export type CreatorType = 'grafik' | 'foto' | 'video' | 'musik' | 'other';

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
