// features/sidebar/model/config.ts
import {
  Calendar,
  Camera,
  CheckSquare,
  Crown,
  Home,
  PlusCircle,
  Settings,
  Shield,
  Users,
} from 'lucide-react';

import type { NavItem } from './types';

export const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/intern', icon: Home },
  { name: 'Events', href: '/intern/events', icon: Calendar },
  { name: 'Aufgaben', href: '/intern/tasks', icon: CheckSquare, badge: 5 },
  { name: 'Teams', href: '/intern/teams', icon: Shield },
  { name: 'Mitglieder', href: '/intern/members', icon: Users },
  { name: 'Galerie', href: '/intern/gallery', icon: Camera },
  {
    name: 'Creator',
    href: '/intern/creator',
    icon: PlusCircle,
    requiredRole: ['admin', 'vorstand', 'beirat'],
  },
  { name: 'Verein', href: '/intern/club', icon: Crown },
  {
    name: 'Einstellungen',
    href: '/intern/settings',
    icon: Settings,
    requiredRole: ['admin', 'vorstand'],
  },
];

export const roleColors = {
  admin: 'bg-purple-100 text-purple-700 border-purple-200',
  vorstand: 'bg-amber-100 text-amber-700 border-amber-200',
  beirat: 'bg-blue-100 text-blue-700 border-blue-200',
  team: 'bg-green-100 text-green-700 border-green-200',
  member: 'bg-gray-100 text-gray-700 border-gray-200',
} as const;
