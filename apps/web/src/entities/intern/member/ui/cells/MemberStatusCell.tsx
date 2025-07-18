import { Badge } from '@/shared/shadcn';
import type { CellProps } from '@/shared/ui/dataTable';

import type { MemberListItem } from '../../model/types';

/**
 * MemberStatusCell Component
 *
 * @description Zeigt den Aktivitätsstatus eines Mitglieds an
 */
export const MemberStatusCell = ({ row }: CellProps<MemberListItem>) => {
  return (
    <Badge variant={row.istAktiv ? 'secondary' : 'default'}>
      {row.istAktiv ? 'Aktiv' : 'Inaktiv'}
    </Badge>
  );
};
