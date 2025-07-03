// frontend/src/features/public/newsletter-list/ui/List.tsx
import { CalendarDays, Hash, Newspaper } from 'lucide-react';

import { ARTICLE_CATEGORY_CONFIG, type NewsletterListItem } from '@/entities/public/newsletter';

import { cn } from '@/shared/lib';
import { Badge, Card, CardContent } from '@/shared/shadcn';
import { Image } from '@/shared/ui';

type ListProps = {
  newsletters: NewsletterListItem[];
  onSelect: (id: string) => void;
};

export const List = ({ newsletters, onSelect }: ListProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {newsletters.map(newsletter => (
        <Card
          key={newsletter.id}
          className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
          onClick={() => {
            onSelect(newsletter.id);
          }}
        >
          {newsletter.headerImage ? (
            <div className="aspect-video overflow-hidden">
              <Image
                src={newsletter.headerImage}
                alt={newsletter.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          ) : null}

          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Newspaper className="h-3 w-3" />
                Edition #{newsletter.edition}
              </Badge>
              <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <CalendarDays className="h-3 w-3" />
                {new Date(newsletter.publishedAt).toLocaleDateString('de-DE')}
              </span>
            </div>

            <h3 className="mb-2 text-xl font-bold group-hover:text-[var(--color-fanini-blue)]">
              {newsletter.title}
            </h3>

            {newsletter.subtitle ? (
              <p className="text-muted-foreground mb-3">{newsletter.subtitle}</p>
            ) : null}

            {newsletter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newsletter.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Hash className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
