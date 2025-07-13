// frontend/src/features/public/newsletter-list/ui/NewsletterCard.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, FileText, Hash } from 'lucide-react';

import type { NewsletterListItem } from '@/entities/public/newsletter';

import { Badge, Button } from '@/shared/shadcn';
import { FloatingCard, Image } from '@/shared/ui';

type NewsletterCardProps = {
  newsletter: NewsletterListItem;
  onSelect: (id: string) => void;
};

export const NewsletterCard = ({ newsletter, onSelect }: NewsletterCardProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <FloatingCard>
        {/* Entfernt GlassCard, nutzt stattdessen normale Card-Styles */}
        <div className="group bg-card h-full overflow-hidden rounded-xl border transition-all hover:shadow-2xl">
          {/* Header Image */}
          {newsletter.headerImage ? (
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={newsletter.headerImage}
                alt={newsletter.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Edition Badge */}
              <Badge className="absolute top-4 left-4 bg-[var(--color-fanini-blue)] text-white">
                Edition #{newsletter.edition}
              </Badge>
            </div>
          ) : null}

          {/* Content */}
          <div className="space-y-4 p-6">
            {/* Date & Stats */}
            <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(newsletter.publishedAt).toLocaleDateString('de-DE')}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {newsletter.articleCount} Artikel
              </span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h3 className="mb-2 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-xl font-bold text-transparent">
                {newsletter.title}
              </h3>
              {newsletter.subtitle ? (
                <p className="text-[var(--color-muted-foreground)]">{newsletter.subtitle}</p>
              ) : null}
            </div>

            {/* Preview */}
            <p className="line-clamp-3 text-sm text-[var(--color-muted-foreground)]">
              {newsletter.preview}
            </p>

            {/* Tags */}
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

            {/* Action */}
            <Button
              onClick={() => {
                onSelect(newsletter.id);
              }}
              className="group/btn w-full"
              variant="outline"
            >
              Weiterlesen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </FloatingCard>
    </motion.div>
  );
};
