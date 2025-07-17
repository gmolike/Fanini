 
// entities/public/organization/model/types.ts
export type GremiumType =
  | 'vorstand'
  | 'beirat'
  | 'team_event'
  | 'team_medien'
  | 'team_technik'
  | 'team_verein'
  | 'kassenpruefung';

export type RelationType = 'mutterverein' | 'fanfreundschaft' | 'kooperation' | 'partnerschaft';

export type StructureType = 'organization' | 'teams' | 'relationships';

export type GremiumMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  description?: string;
  memberSince: string;
  email?: string;
  phone?: string;
  responsibilities?: string[];
};

export type GremiumListItem = {
  id: string;
  type: GremiumType;
  name: string;
  shortDescription: string;
  memberCount: number;
  establishedDate: string;
  headerImage?: string;
  gradient: string;
};

export type Gremium = {
  id: string;
  type: GremiumType;
  name: string;
  description: string;
  shortDescription: string;
  headerImage?: string;
  gradient: string;
  members: GremiumMember[];
  responsibilities: string[];
  meetingSchedule?: string;
  contactEmail?: string;
  establishedDate: string;
  stats: {
    memberCount: number;
    projectsCompleted?: number;
    eventsOrganized?: number;
    activeSince: string;
  };
  highlights?: {
    title: string;
    description: string;
    date?: string;
  }[];
  images?: string[];
};

export type OrganizationDocument = {
  id: string;
  title: string;
  type: 'satzung' | 'geschaeftsordnung' | 'protokoll' | 'formular' | 'other';
  fileUrl: string;
  fileSize: number;
  updatedAt: string;
  category: string;
  description?: string;
};

export type RelationshipNode = {
  id: string;
  name: string;
  type: RelationType;
  description: string;
  logo?: string;
  since: string;
  active: boolean;
  link?: string;
};

// Response Types
export type GremienListResponse = {
  data: GremiumListItem[];
  meta?: {
    total: number;
  };
};

export type GremiumDetailResponse = {
  data: Gremium;
};

export type DocumentsResponse = {
  data: OrganizationDocument[];
  meta?: {
    total: number;
    categories: string[];
  };
};

// Constants
export const GREMIUM_CONFIG: Record<
  GremiumType,
  {
    label: string;
    icon: string;
    gradient: string;
    color: string;
  }
> = {
  vorstand: {
    label: 'Vorstand',
    icon: '👥',
    gradient: 'from-blue-500 to-blue-600',
    color: 'blue',
  },
  beirat: {
    label: 'Beirat',
    icon: '🎯',
    gradient: 'from-purple-500 to-purple-600',
    color: 'purple',
  },
  team_event: {
    label: 'Team Event',
    icon: '🎉',
    gradient: 'from-green-500 to-green-600',
    color: 'green',
  },
  team_medien: {
    label: 'Team Medien',
    icon: '📸',
    gradient: 'from-pink-500 to-pink-600',
    color: 'pink',
  },
  team_technik: {
    label: 'Team Technik',
    icon: '💻',
    gradient: 'from-amber-500 to-amber-600',
    color: 'amber',
  },
  team_verein: {
    label: 'Team Verein',
    icon: '🏛️',
    gradient: 'from-cyan-500 to-cyan-600',
    color: 'cyan',
  },
  kassenpruefung: {
    label: 'Kassenprüfung',
    icon: '📊',
    gradient: 'from-red-500 to-red-600',
    color: 'red',
  },
};
