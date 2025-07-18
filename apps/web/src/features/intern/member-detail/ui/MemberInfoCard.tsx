import { User } from 'lucide-react';

import { type MemberDetail, ROLE_CONFIG } from '@/entities/intern/member';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn';
import { BooleanDisplay, DataField, DataGrid, DateDisplay, EnumBadge } from '@/shared/ui';

type MemberInfoCardProps = {
  member: MemberDetail;
  canViewSensitiveData: boolean;
};

/**
 * MemberInfoCard Component
 *
 * @description Zeigt die Basis-Informationen eines Mitglieds
 */
export const MemberInfoCard = ({ member, canViewSensitiveData }: MemberInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Mitgliedsinformationen
        </CardTitle>
        <CardDescription>
          Mitglied seit <DateDisplay date={member.mitgliedSeit} format="medium" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataGrid columns={2} bordered>
          <DataField
            label="Name"
            value={`${member.vorname} ${member.nachname}`}
            icon={<User className="h-4 w-4" />}
          />

          <DataField label="Mitgliedsnummer" value={member.mitgliedsnummer} />

          <DataField
            label="Status"
            value={<BooleanDisplay value={member.istAktiv} variant="text" />}
          />

          <DataField
            label="Rollen"
            value={
              <div className="flex flex-wrap gap-1">
                {member.rolle.map(role => (
                  <EnumBadge key={role} value={role} config={ROLE_CONFIG} size="sm" />
                ))}
              </div>
            }
          />

          {canViewSensitiveData && member.geburtsdatum ? (
            <DataField label="Geburtsdatum" value={<DateDisplay date={member.geburtsdatum} />} />
          ) : null}

          <DataField
            label="Vertraulichkeitserklärung"
            value={<BooleanDisplay value={member.hatVertraulichkeitserklaerung} variant="text" />}
          />

          {member.letzteAktivitaet ? (
            <DataField
              label="Letzte Aktivität"
              value={<DateDisplay date={member.letzteAktivitaet} />}
              className="col-span-2"
            />
          ) : null}
        </DataGrid>
      </CardContent>
    </Card>
  );
};
