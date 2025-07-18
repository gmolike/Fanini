import { EnumBadge } from '@/shared/ui';
import type { CellProps } from '@/shared/ui/dataTable';

import { ROLE_CONFIG } from '../../model/constants';

import type { MemberListItem } from '../../model/types';

/**
 * MemberRoleCell Component
 *
 * @description Zeigt die Rollen eines Mitglieds als Badge-Liste an
 */
export const MemberRoleCell = ({ row }: CellProps<MemberListItem>) => {
  const roles = row.rolle;

  // Zeige max. 2 Rollen, Rest als "+X"
  const displayRoles = roles.slice(0, 2);
  const remainingCount = roles.length - displayRoles.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayRoles.map(role => (
        <EnumBadge key={role} value={role} config={ROLE_CONFIG} size="sm" />
      ))}
      {remainingCount > 0 && (
        <span className="text-muted-foreground text-xs">+{remainingCount}</span>
      )}
    </div>
  );
};
