// features/sidebar/ui/UserInfo.tsx
import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn/badge';

import { roleColors } from '../model/config';

import type { AuthUser } from '../model/types';

type UserInfoProps = {
  user: AuthUser;
};

/**
 * Displays user information in the sidebar
 * @param user - The authenticated user object
 * @returns User info section with avatar and role badge
 */
export const UserInfo = ({ user }: UserInfoProps) => {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <Badge variant="outline" className={cn(roleColors[user.roleType], 'text-xs')}>
            {user.role}
          </Badge>
        </div>
      </div>
    </div>
  );
};
