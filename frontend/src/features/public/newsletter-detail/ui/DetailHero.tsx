// frontend/src/features/public/newsletter-detail/ui/DetailHero.tsx
import { motion } from 'framer-motion';
import { Calendar, Clock, Newspaper } from 'lucide-react';

import { ARTICLE_CATEGORY_CONFIG, type Newsletter } from '@/entities/public/newsletter';

import { Badge } from '@/shared/shadcn';
import { AnimatedNumber, Image } from '@/shared/ui';

type DetailHeroProps = {
  newsletter: Newsletter;
};

export const DetailHero = ({ newsletter }: DetailHeroProps) => {
  return (
    <div className="relative min-h-[60vh] overflow-hidden">
      {/* Background Image with Parallax */}
      {newsletter.headerImage ? (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={newsletter.headerImage}
            alt={newsletter.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      ) : null}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex min-h-[60vh] items-end pb-12">
          <div className="max-w-4xl space-y-6">
            {/* Edition Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-[var(--color-fanini-blue)] px-4 py-2 text-lg text-white">
                <Newspaper className="mr-2 h-5 w-5" />
                Edition #<AnimatedNumber value={newsletter.edition} />
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-white md:text-7xl"
            >
              {newsletter.title}
            </motion.h1>

            {/* Subtitle */}
            {newsletter.subtitle ? (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/90 md:text-2xl"
              >
                {newsletter.subtitle}
              </motion.p>
            ) : null}

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 text-white/80"
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {new Date(newsletter.publishedAt).toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {newsletter.stats ? (
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {newsletter.stats.estimatedReadTime} Min. Lesezeit
                </span>
              ) : null}
            </motion.div>

            {/* Category Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {Object.entries(
                newsletter.articles.reduce<Record<string, number>>((acc, article) => {
                  acc[article.category] = (acc[article.category] ?? 0) + 1;
                  return acc;
                }, {})
              ).map(([category, count]) => {
                const config =
                  ARTICLE_CATEGORY_CONFIG[category as keyof typeof ARTICLE_CATEGORY_CONFIG];
                return (
                  <div
                    key={category}
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
                  >
                    <span className="text-lg">{config.icon}</span>
                    <span className="text-sm font-medium text-white">
                      {count} {config.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
