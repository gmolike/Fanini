// frontend/src/features/team-history/FaniniCard/FaniniCard.tsx
import { Calendar, Heart, Image as ImageIcon, Users } from 'lucide-react';

import type { FaniniContent } from '@/entities/public/team-history';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

type FaniniCardProps = {
  content: FaniniContent;
  year: number;
};

/**
 * Zeigt Faninitiative Aktivitäten und Informationen
 * @component
 */
export const FaniniCard = ({ content, year }: FaniniCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-[var(--color-fanini-red)]" />
          {content.title || `Faninitiative ${String(year)}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="rounded-lg bg-[var(--color-muted)] p-4">
          <p className="text-sm">{content.description}</p>
          {content.members > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span className="font-medium">{content.members} aktive Mitglieder</span>
            </div>
          )}
        </div>

        {/* Activities */}
        {content.activities.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Calendar className="h-4 w-4" />
              Aktivitäten {year}
            </h4>
            <div className="space-y-3">
              {content.activities.map(activity => (
                <div key={`${activity.name}-${activity.date}`} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <h5 className="font-medium">{activity.name}</h5>
                    <span className="text-sm text-[var(--color-muted-foreground)]">
                      {activity.date}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-[var(--color-muted-foreground)]">
                    {activity.description}
                  </p>
                  {activity.participants ? (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {activity.participants} Teilnehmer
                      </span>
                      {activity.images && activity.images.length > 0 ? (
                        <span className="flex items-center gap-1 text-[var(--color-fanini-blue)]">
                          <ImageIcon className="h-3 w-3" />
                          {activity.images.length} Fotos
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images Gallery Preview */}
        {content.images && content.images.length > 0 ? (
          <div>
            <h4 className="mb-3 font-semibold">Eindrücke aus {year}</h4>
            <div className="grid grid-cols-3 gap-2">
              {content.images.slice(0, 6).map((image, index) => (
                <div
                  key={image}
                  className="aspect-square overflow-hidden rounded-lg bg-[var(--color-muted)]"
                >
                  <img
                    src={image}
                    alt={`Faninitiative ${String(year)} - Bild ${String(index + 1)}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
