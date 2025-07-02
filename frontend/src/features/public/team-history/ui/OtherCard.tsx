// frontend/src/features/team-history/OtherCard/OtherCard.tsx
import { MoreHorizontal } from 'lucide-react';

import type { OtherContent } from '@/entities/public/team-history';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

type OtherCardProps = {
  content: OtherContent;
  year: number;
};

/**
 * Zeigt andere Team/Gruppen Informationen
 * @component
 */
export const OtherCard = ({ content, year }: OtherCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MoreHorizontal className="h-5 w-5" />
          {content.name} {year}
        </CardTitle>
        {content.category ? (
          <p className="text-sm text-[var(--color-muted-foreground)]">{content.category}</p>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="mb-4">{content.description}</p>

        {/* Custom Fields */}
        {Object.entries(content.customFields).length > 0 && (
          <div className="space-y-2">
            {Object.entries(content.customFields).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-[var(--color-muted-foreground)]">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
