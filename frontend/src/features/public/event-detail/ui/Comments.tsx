// frontend/src/features/public/event-detail/ui/components/EventComments.tsx
import { MessageSquare, Info } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
} from '@/shared/shadcn';

import type { PublicEventDetail } from '@/entities/public/event';

type EventCommentsProps = {
  comments: NonNullable<PublicEventDetail['comments']>;
};

/**
 * EventComments Component
 * @description Zeigt Kommentare mit Hinweis auf Vereinsmitglieder
 */
export const EventComments = ({ comments }: EventCommentsProps) => {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-semibold">
        <MessageSquare className="h-4 w-4" />
        Kommentare ({comments.length})
      </h3>

      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Alle Kommentare stammen ausschließlich von verifizierten Vereinsmitgliedern und
          repräsentieren deren persönliche Meinungen und Erfahrungen.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              {comment.author.avatar && (
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
              )}
              <AvatarFallback>
                {comment.author.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{comment.author.name}</span>
                {comment.author.role && (
                  <Badge variant="secondary" className="text-xs">
                    {comment.author.role}
                  </Badge>
                )}
                {comment.isOfficial && (
                  <Badge className="bg-[var(--color-fanini-blue)] text-xs">
                    Offizieller Kommentar
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{comment.content}</p>
              <p className="text-muted-foreground text-xs">
                {new Date(comment.createdAt).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
