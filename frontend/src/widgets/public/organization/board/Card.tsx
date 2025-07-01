// widgets/public/organization/board/Card.tsx
import { Calendar,Mail } from 'lucide-react';

import type { BoardMember } from '@/entities/public/organization';

import { Badge,Card as UICard, CardContent, CardHeader } from '@/shared/shadcn';

type CardProps = {
  member: BoardMember;
  onSelect?: (member: BoardMember) => void;
};

/**
 * Vorstandsmitglied-Karte
 * @param member - Mitgliedsdaten
 * @param onSelect - Auswahl-Callback
 */
export const Card = ({ member, onSelect }: CardProps) => {
  return (
    <UICard
      className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
      onClick={() => onSelect?.(member)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/80 text-xl font-bold text-white">
              {member.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <Badge className="mt-1">{member.roleLabel}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {member.description ? <p className="line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
            {member.description}
          </p> : null}

        <div className="space-y-2 text-sm">
          {member.email ? <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--color-muted-foreground)]" />
              <span className="truncate">{member.email}</span>
            </div> : null}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            <span>Seit {new Date(member.memberSince).getFullYear()}</span>
          </div>
        </div>
      </CardContent>
    </UICard>
  );
};
