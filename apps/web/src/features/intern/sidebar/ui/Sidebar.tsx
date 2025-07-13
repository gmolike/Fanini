// features/sidebar/ui/Sidebar.tsx
import { Logo } from './Logo';
import { LogoutButton } from './LogoutButton';
import { Navigation } from './Navigation';
import { UserInfo } from './UserInfo';

import type { SidebarProps } from '../model/types';

/**
 * Complete sidebar component for internal area
 * @param user - Authenticated user
 * @param onLogout - Logout handler
 * @param onOpenChange - Optional callback for mobile sidebar state
 * @returns Sidebar with navigation and user info
 */
export const Sidebar = ({ user, onLogout, onOpenChange }: SidebarProps) => {
  const handleNavigate = () => {
    onOpenChange?.(false);
  };

  return (
    <>
      <Logo />
      <UserInfo user={user} />
      <Navigation user={user} onNavigate={handleNavigate} />
      <LogoutButton onLogout={onLogout} />
    </>
  );
};
