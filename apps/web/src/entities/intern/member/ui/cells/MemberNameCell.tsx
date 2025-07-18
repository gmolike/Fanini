import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn';
import type { CellProps } from '@/shared/ui/dataTable';

import type { MemberListItem } from '../../model/types';

/**
 * MemberNameCell Component
 *
 * @description Zeigt den Namen des Mitglieds mit Avatar an
 */
export const MemberNameCell = ({ row }: CellProps<MemberListItem>) => {
  const initials = `${row.vorname.charAt(0)}${row.nachname.charAt(0)}`.toUpperCase();
  const fullName = `${row.vorname} ${row.nachname}`;

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {typeof row.profilbild === 'string' && row.profilbild.trim() !== '' && (
          <AvatarImage src={row.profilbild} alt={fullName} />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{fullName}</div>
        <div className="text-muted-foreground text-sm">{row.mitgliedsnummer}</div>
      </div>
    </div>
  );
};
