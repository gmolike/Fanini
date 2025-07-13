// frontend/src/testing/mocks/db/schemas/creator.schema.ts
import { nullable, primaryKey } from '@mswjs/data';

export const creator = {
  id: primaryKey(String),
  memberId: String,
  artistName: String,
  realName: nullable(String),
  profileImage: nullable(String),
  description: String,
  type: Array, // ['grafik', 'foto', 'video', 'musik', 'other']
  portfolio: String,
  isActive: Boolean,
  activeSince: String,
  deactivatedAt: nullable(String),
  instagram: nullable(String),
  twitter: nullable(String),
  facebook: nullable(String),
  youtube: nullable(String),
  tiktok: nullable(String),
  website: nullable(String),
  worksCount: Number,
  viewsCount: Number,
  likesCount: Number,
};

export const creatorWork = {
  id: primaryKey(String),
  creatorId: String,
  title: String,
  description: nullable(String),
  type: String, // 'image' | 'video' | 'audio' | 'text'
  fileUrl: String,
  thumbnailUrl: nullable(String),
  createdAt: String,
  publishedAt: nullable(String),
  isPublic: Boolean,
  order: Number,
  tags: Array,
  views: Number,
  likes: Number,
};
