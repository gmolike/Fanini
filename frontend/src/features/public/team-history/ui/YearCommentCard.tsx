// frontend/src/features/team-history/YearCommentCard/YearCommentCard.tsx
import { Eye, MessageCircle, Star, TrendingDown } from 'lucide-react';

import type { FaniniYearComment } from '@/entities/public/team-history';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

type YearCommentCardProps = {
  comment: FaniniYearComment & { id: string };
};

/**
 * Zeigt den Faninitiative Jahreskommentar
 * @component
 */
export const YearCommentCard = ({ comment }: YearCommentCardProps) => {
  return (
    <Card className="border-2 border-[var(--color-fanini-blue)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Faninitiative Jahresrückblick {comment.year}
        </CardTitle>
        <p className="text-lg font-semibold text-[var(--color-fanini-red)]">{comment.headline}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>{comment.content}</p>
        </div>

        {comment.highlights.length > 0 && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <Star className="h-4 w-4 text-yellow-500" />
              Highlights des Jahres
            </h4>
            <ul className="space-y-1">
              {comment.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[var(--color-fanini-blue)]">•</span>
                  <span className="text-sm">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {comment.lowlights && comment.lowlights.length > 0 ? (
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Tiefpunkte
            </h4>
            <ul className="space-y-1">
              {comment.lowlights.map((lowlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span className="text-sm">{lowlight}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {comment.outlook ? (
          <div className="border-t pt-4">
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <Eye className="h-4 w-4" />
              Ausblick
            </h4>
            <p className="text-sm text-[var(--color-muted-foreground)]">{comment.outlook}</p>
          </div>
        ) : null}

        {comment.author ? (
          <div className="text-right text-sm text-[var(--color-muted-foreground)] italic">
            - {comment.author}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
