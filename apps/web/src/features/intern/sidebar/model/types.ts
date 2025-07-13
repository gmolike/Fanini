// features/sidebar/model/types.ts
import type { LucideIcon } from 'lucide-react';

export type RoleType = 'admin' | 'vorstand' | 'beirat' | 'team' | 'member';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  roleType: RoleType;
  teams?: string[];
};

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  requiredRole?: RoleType[];
};

export type SidebarProps = {
  user: AuthUser;
  onLogout: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
