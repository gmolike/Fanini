import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn';
import { DataField, DataGrid, DateDisplay, EmailDisplay, PhoneDisplay } from '@/shared/ui';

import type { MemberDetail } from '../../model/types';

type MemberInfoCardProps = {
  member: MemberDetail;
  canViewSensitiveData: boolean;
};

/**
 * MemberInfoCard Component
 *
 * @description Zeigt Mitgliedsinformationen in einer strukturierten Card an
 */
export const InfoCard = ({ member, canViewSensitiveData }: MemberInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mitgliedsinformationen</CardTitle>
        <CardDescription>
          Mitglied seit <DateDisplay date={member.mitgliedSeit} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataGrid columns={2}>
          <DataField label="Name" value={`${member.vorname} ${member.nachname}`} />

          <DataField label="Mitgliedsnummer" value={member.mitgliedsnummer} />

          <DataField label="E-Mail" value={<EmailDisplay email={member.email} />} />

          {member.telefon ? (
            <DataField label="Telefon" value={<PhoneDisplay phone={member.telefon} />} />
          ) : null}

          {member.geburtsdatum && canViewSensitiveData ? (
            <DataField label="Geburtsdatum" value={<DateDisplay date={member.geburtsdatum} />} />
          ) : null}

          {member.adresse && canViewSensitiveData ? (
            <DataField
              label="Adresse"
              value={`${member.adresse.strasse} ${member.adresse.hausnummer}, ${member.adresse.plz} ${member.adresse.stadt}`}
              className="col-span-2"
            />
          ) : null}
        </DataGrid>
      </CardContent>
    </Card>
  );
};
