// frontend/src/testing/mocks/db/seeds/creator.seed.ts
import type {
  Creator,
  CreatorListItem,
  CreatorWork,
  CreatorWorksResponse,
} from '@/entities/public/creator';

// Creator Daten
export const CREATORS_DATA: Creator[] = [
  {
    id: 'creator-1',
    memberId: 'member-123',
    artistName: 'SpandauPixel',
    realName: 'Max Mustermann',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpandauPixel',
    description:
      'Digitaler Künstler mit Fokus auf Eintracht Spandau Fan-Art. Spezialisiert auf Pixel-Art und moderne Grafiken.',
    type: ['grafik', 'foto'],
    portfolio: 'https://behance.net/spandaupixel',
    isActive: true,
    activeSince: '2024-01-15',
    instagram: '@spandaupixel',
    twitter: '@spandaupixel',
    website: 'https://spandaupixel.de',
    stats: {
      worksCount: 24,
      viewsCount: 1250,
      likesCount: 342,
    },
  },
  {
    id: 'creator-2',
    memberId: 'member-456',
    artistName: 'BeatsByFanini',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BeatsByFanini',
    description: 'Producer und DJ - Erstelle Fan-Hymnen und Remixes für die Spandauer Legenden!',
    type: ['musik'],
    portfolio: 'https://soundcloud.com/beatsbyfanini',
    isActive: true,
    activeSince: '2024-03-20',
    instagram: '@beatsbyfanini',
    youtube: '@BeatsByFanini',
    stats: {
      worksCount: 12,
      viewsCount: 3420,
      likesCount: 567,
    },
  },
  {
    id: 'creator-3',
    memberId: 'member-789',
    artistName: 'SpandauFilms',
    realName: 'Sarah Schmidt',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpandauFilms',
    description:
      'Videografin für alle Eintracht Events. Von Highlight-Reels bis zu emotionalen Fan-Dokumentationen.',
    type: ['video', 'foto'],
    portfolio: 'https://vimeo.com/spandaufilms',
    isActive: true,
    activeSince: '2023-11-10',
    instagram: '@spandaufilms',
    twitter: '@spandaufilms',
    tiktok: '@spandaufilms',
    website: 'https://spandaufilms.de',
    stats: {
      worksCount: 18,
      viewsCount: 8920,
      likesCount: 1203,
    },
  },
  {
    id: 'creator-4',
    memberId: 'member-321',
    artistName: 'FaniniDesigns',
    description: 'Grafikdesign für Merchandising und Social Media Content.',
    type: ['grafik'],
    portfolio: 'https://dribbble.com/faninidesigns',
    isActive: false,
    activeSince: '2023-06-01',
    deactivatedAt: '2024-12-01',
    stats: {
      worksCount: 35,
      viewsCount: 2100,
      likesCount: 445,
    },
  },
];

// Creator Works
export const CREATOR_WORKS_DATA: CreatorWork[] = [
  // SpandauPixel Works
  {
    id: 'work-1',
    creatorId: 'creator-1',
    title: 'Pride Pixel Portrait',
    description: 'Pixel-Art Portrait unseres Kapitäns Pride',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa0a08?w=800&h=800&fit=crop',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1569163139394-de4798aa0a08?w=400&h=400&fit=crop',
    createdAt: '2024-06-01T10:00:00Z',
    publishedAt: '2024-06-02T10:00:00Z',
    isPublic: true,
    order: 1,
    tags: ['pixel-art', 'pride', 'portrait'],
    stats: {
      views: 245,
      likes: 89,
    },
  },
  {
    id: 'work-2',
    creatorId: 'creator-1',
    title: 'EMEA Masters Victory Banner',
    description: 'Siegesbanner für unseren EMEA Masters Triumph 2024',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&h=600&fit=crop',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=200&fit=crop',
    createdAt: '2024-05-12T20:00:00Z',
    publishedAt: '2024-05-13T08:00:00Z',
    isPublic: true,
    order: 2,
    tags: ['emea-masters', 'victory', 'banner', 'champions'],
    stats: {
      views: 892,
      likes: 234,
    },
  },
  {
    id: 'work-3',
    creatorId: 'creator-1',
    title: 'Spandau Legends Wallpaper Pack',
    description: 'Desktop und Mobile Wallpaper für echte Fans',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=1080&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop',
    createdAt: '2024-07-20T15:00:00Z',
    publishedAt: '2024-07-21T10:00:00Z',
    isPublic: true,
    order: 3,
    tags: ['wallpaper', 'desktop', 'mobile', 'fanart'],
    stats: {
      views: 567,
      likes: 178,
    },
  },
  // BeatsByFanini Works
  {
    id: 'work-4',
    creatorId: 'creator-2',
    title: 'Spandau Hymne 2024',
    description: 'Die offizielle Fan-Hymne für die Season 2024',
    type: 'audio',
    fileUrl: '/audio/spandau-hymne-2024.mp3',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    createdAt: '2024-04-01T12:00:00Z',
    publishedAt: '2024-04-05T18:00:00Z',
    isPublic: true,
    order: 1,
    tags: ['hymne', 'musik', 'fangesang'],
    stats: {
      views: 1234,
      likes: 345,
    },
  },
  {
    id: 'work-5',
    creatorId: 'creator-2',
    title: 'Victory Remix - EMEA Masters',
    description: 'Electronic Remix zur Feier des EMEA Masters Siegs',
    type: 'audio',
    fileUrl: '/audio/victory-remix.mp3',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    createdAt: '2024-05-15T20:00:00Z',
    publishedAt: '2024-05-16T10:00:00Z',
    isPublic: true,
    order: 2,
    tags: ['remix', 'electronic', 'victory', 'emea-masters'],
    stats: {
      views: 2890,
      likes: 567,
    },
  },
  // SpandauFilms Works
  {
    id: 'work-6',
    creatorId: 'creator-3',
    title: 'Road to EMEA Masters - Documentary',
    description: 'Die emotionale Reise zum größten Erfolg der Vereinsgeschichte',
    type: 'video',
    fileUrl: 'https://vimeo.com/123456789',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1585951237313-1f0ec2f9f6c2?w=800&h=450&fit=crop',
    createdAt: '2024-05-20T10:00:00Z',
    publishedAt: '2024-05-25T18:00:00Z',
    isPublic: true,
    order: 1,
    tags: ['documentary', 'emea-masters', 'behind-the-scenes'],
    stats: {
      views: 4567,
      likes: 890,
    },
  },
  {
    id: 'work-7',
    creatorId: 'creator-3',
    title: 'Baller League Highlights - Season 3',
    description: 'Die besten Momente aus der Baller League Season 3',
    type: 'video',
    fileUrl: 'https://youtube.com/watch?v=abc123',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop',
    createdAt: '2024-09-10T14:00:00Z',
    publishedAt: '2024-09-12T16:00:00Z',
    isPublic: true,
    order: 2,
    tags: ['highlights', 'baller-league', 'fußball'],
    stats: {
      views: 3210,
      likes: 567,
    },
  },
  {
    id: 'work-8',
    creatorId: 'creator-3',
    title: 'Fan Reactions - Prime League Finals',
    description: 'Die emotionalsten Fan-Reaktionen während der Finals',
    type: 'video',
    fileUrl: 'https://youtube.com/watch?v=xyz789',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=450&fit=crop',
    createdAt: '2024-04-14T20:00:00Z',
    publishedAt: '2024-04-15T12:00:00Z',
    isPublic: true,
    order: 3,
    tags: ['fan-reactions', 'prime-league', 'finals', 'emotions'],
    stats: {
      views: 5678,
      likes: 1234,
    },
  },
];

// Helper Functions
export const toCreatorListItem = (creator: Creator): CreatorListItem => ({
  id: creator.id,
  artistName: creator.artistName,
  profileImage: creator.profileImage,
  type: creator.type,
  shortDescription: `${creator.description.substring(0, 100)}...`,
  worksCount: creator.stats.worksCount,
  isActive: creator.isActive,
});

export const getGalleryWorks = (): CreatorWorksResponse => {
  const publicWorks = CREATOR_WORKS_DATA.filter(work => work.isPublic).sort(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
  );

  return {
    data: publicWorks,
    meta: {
      total: publicWorks.length,
      hasMore: false,
    },
  };
};

export const getCreatorWorks = (creatorId: string, page = 1, limit = 12): CreatorWorksResponse => {
  const creatorWorks = CREATOR_WORKS_DATA.filter(
    work => work.creatorId === creatorId && work.isPublic
  ).sort((a, b) => a.order - b.order);

  const start = (page - 1) * limit;
  const paginatedWorks = creatorWorks.slice(start, start + limit);

  return {
    data: paginatedWorks,
    meta: {
      total: creatorWorks.length,
      hasMore: start + limit < creatorWorks.length,
    },
  };
};

// Seed function
export const seedCreators = () => {
  console.info('[MSW] Seeding creators and works...');
  return {
    creators: CREATORS_DATA,
    works: CREATOR_WORKS_DATA,
  };
};
