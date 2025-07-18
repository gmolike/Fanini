// apps/web/src/features/intern/member/form/model/types.ts
import type { CreateMemberFormData } from '@/entities/intern/member';

export type MemberFormData = Omit<CreateMemberFormData, 'memberType'> & {
  memberType?: 'member' | 'creator' | 'sponsor' | 'partner'; // Optional machen
  telefon?: string;
  geburtsdatum?: string;
  mitgliedsnummer?: string;
  istAktiv?: boolean;
  adresse?: {
    strasse: string;
    hausnummer: string;
    plz: string;
    stadt: string;
  };
  sichtbarkeit?: {
    email: 'alle' | 'mitglieder' | 'vorstand' | 'niemand';
    telefon: 'alle' | 'mitglieder' | 'vorstand' | 'niemand';
    profil: 'alle' | 'mitglieder' | 'vorstand' | 'niemand';
  };
};
