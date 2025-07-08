// frontend/src/entities/public/organization-structure/model/types.ts
export type OrganizationNodeType = 'root' | 'partner' | 'department' | 'team' | 'external';

export type OrganizationNode = {
  id: string;
  name: string;
  type: OrganizationNodeType;
  description?: string;
  memberCount?: number;
  lead?: string;
  email?: string;
  children?: OrganizationNode[];
  logo?: string;
  color?: string;
  link?: string;
  isExternal?: boolean;
};

export const ORGANIZATION_NODE_CONFIG = {
  root: {
    label: 'Hauptverein',
    icon: '🏠',
    color: 'from-blue-600 to-blue-800',
  },
  partner: {
    label: 'Partner',
    icon: '🤝',
    color: 'from-purple-600 to-purple-800',
  },
  department: {
    label: 'Abteilung',
    icon: '🏢',
    color: 'from-green-600 to-green-800',
  },
  team: {
    label: 'Team',
    icon: '👥',
    color: 'from-orange-600 to-orange-800',
  },
  external: {
    label: 'Extern',
    icon: '🔗',
    color: 'from-gray-600 to-gray-800',
  },
} as const;
