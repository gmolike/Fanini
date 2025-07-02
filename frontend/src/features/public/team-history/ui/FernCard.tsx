// frontend/src/features/team-history/FernCard/FernCard.tsx
import { Globe, Mail,MapPin, Users } from 'lucide-react';

import type { FernContent } from '@/entities/public/team-history';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

type FernCardProps = {
  content: FernContent;
  year: number;
};

/**
 * Zeigt Ferninitiative Informationen und Chapters
 * @component
 */
export const FernCard = ({ content, year }: FernCardProps) => {
  const totalMembers = content.chapters.reduce((sum, chapter) => sum + chapter.memberCount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[var(--color-fanini-blue)]" />
          {content.title || `Ferninitiative ${String(year)}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="rounded-lg bg-[var(--color-muted)] p-4">
          <p className="mb-3 text-sm">{content.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 font-medium">
              <Users className="h-4 w-4" />
              {totalMembers} Mitglieder weltweit
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {content.chapters.length} Standorte
            </span>
          </div>
        </div>

        {/* Chapters */}
        {content.chapters.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold">Chapter Übersicht</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {content.chapters.map((chapter) => (
                <div key={chapter.location} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h5 className="flex items-center gap-2 font-medium">
                        <MapPin className="h-3 w-3" />
                        {chapter.location}
                      </h5>
                      {chapter.country ? <span className="text-xs text-[var(--color-muted-foreground)]">
                          {chapter.country}
                        </span> : null}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-fanini-blue)]">
                      {chapter.memberCount} Mitglieder
                    </span>
                  </div>
                  {chapter.foundedDate ? <p className="text-xs text-[var(--color-muted-foreground)]">
                      Gegründet: {chapter.foundedDate}
                    </p> : null}
                  {chapter.contact ? <div className="mt-2 flex items-center gap-1 text-xs">
                      <Mail className="h-3 w-3" />
                      <span>{chapter.contact}</span>
                    </div> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        {content.activities.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold">Gemeinsame Aktivitäten</h4>
            <ul className="space-y-1">
              {content.activities.map((activity) => (
                <li key={activity} className="flex items-start gap-2 text-sm">
                  <span className="text-[var(--color-fanini-blue)]">•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
