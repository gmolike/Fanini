// frontend/src/features/public/newsletter-detail/ui/DetailView.tsx
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CalendarDays, Hash, Newspaper, User } from 'lucide-react';

import { type Newsletter } from '@/entities/public/newsletter';

import { Badge, Button, Separator } from '@/shared/shadcn';
import { Image } from '@/shared/ui';

import { Article } from './Article';
import { TableOfContents } from './TableOfContents';

type DetailViewProps = {
  newsletter: Newsletter;
};

export const DetailView = ({ newsletter }: DetailViewProps) => {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link to="/newsletter">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Link>
      </Button>

      {/* Header */}
      <header className="mb-8 space-y-4">
        {newsletter.headerImage ? (
          <div className="aspect-video overflow-hidden rounded-lg">
            <Image
              src={newsletter.headerImage}
              alt={newsletter.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Newspaper className="h-3 w-3" />
              Edition #{newsletter.edition}
            </Badge>
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              <CalendarDays className="h-3 w-3" />
              {new Date(newsletter.publishedAt).toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl font-bold">{newsletter.title}</h1>

          {newsletter.subtitle ? (
            <p className="text-muted-foreground text-xl">{newsletter.subtitle}</p>
          ) : null}

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span>
              von {newsletter.author.name}
              {newsletter.author.role ? ` (${newsletter.author.role})` : null}
            </span>
          </div>

          {newsletter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {newsletter.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  <Hash className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      <Separator className="mb-8" />

      {/* Table of Contents */}
      <TableOfContents articles={newsletter.articles} />

      <Separator className="mb-8" />

      {/* Introduction */}
      <div className="prose prose-lg mb-12 max-w-none">
        <p className="lead">{newsletter.introduction}</p>
      </div>

      {/* Articles */}
      <div className="space-y-12">
        {newsletter.articles.map((article, index) => (
          <div key={article.id}>
            <div id={`article-${article.id}`} className="scroll-mt-20">
              <Article article={article} />
            </div>
            {index < newsletter.articles.length - 1 && <Separator className="my-12" />}
          </div>
        ))}
      </div>

      {/* Closing */}
      {newsletter.closingMessage || newsletter.nextEditionHint ? (
        <>
          <Separator className="my-12" />
          <div className="space-y-4">
            {newsletter.closingMessage ? (
              <p className="text-lg">{newsletter.closingMessage}</p>
            ) : null}
            {newsletter.nextEditionHint ? (
              <p className="text-muted-foreground italic">
                Nächste Ausgabe: {newsletter.nextEditionHint}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};
