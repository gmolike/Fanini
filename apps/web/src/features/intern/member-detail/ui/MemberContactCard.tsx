import { AlertTriangle,Mail, MapPin, Phone } from 'lucide-react';

import { type MemberDetail , SICHTBARKEIT_CONFIG } from '@/entities/intern/member';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn';
import { DataField, DataGrid, EmailDisplay, EnumBadge,PhoneDisplay } from '@/shared/ui';

type MemberContactCardProps = {
  member: MemberDetail;
  canViewSensitiveData: boolean;
};

/**
 * MemberContactCard Component
 *
 * @description Zeigt die Kontaktdaten eines Mitglieds
 */
export const MemberContactCard = ({ member, canViewSensitiveData }: MemberContactCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Kontaktdaten
        </CardTitle>
        <CardDescription>Kontaktinformationen und Sichtbarkeitseinstellungen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DataGrid columns={1}>
          <DataField
            label="E-Mail"
            value={<EmailDisplay email={member.email} />}
            icon={<Mail className="h-4 w-4" />}
            suffix={
              member.sichtbarkeit?.email ? <EnumBadge
                  value={member.sichtbarkeit.email}
                  config={SICHTBARKEIT_CONFIG}
                  size="sm"
                /> : null
            }
          />

          {member.telefon ? <DataField
              label="Telefon"
              value={<PhoneDisplay phone={member.telefon} />}
              icon={<Phone className="h-4 w-4" />}
              suffix={
                member.sichtbarkeit?.telefon ? <EnumBadge
                    value={member.sichtbarkeit.telefon}
                    config={SICHTBARKEIT_CONFIG}
                    size="sm"
                  /> : null
              }
            /> : null}

          {canViewSensitiveData && member.adresse ? <DataField
              label="Adresse"
              value={
                <div>
                  <div>
                    {member.adresse.strasse} {member.adresse.hausnummer}
                  </div>
                  <div>
                    {member.adresse.plz} {member.adresse.stadt}
                  </div>
                </div>
              }
              icon={<MapPin className="h-4 w-4" />}
            /> : null}

          {canViewSensitiveData && member.notfallkontakt ? <DataField
              label="Notfallkontakt"
              value={
                <div>
                  <div className="font-medium">{member.notfallkontakt.name}</div>
                  <PhoneDisplay phone={member.notfallkontakt.telefon} />
                </div>
              }
              icon={<AlertTriangle className="h-4 w-4" />}
            /> : null}
        </DataGrid>
      </CardContent>
    </Card>
  );
};
