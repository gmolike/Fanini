// frontend/src/features/public/newsletter-detail/ui/DetailView.tsx
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import type { Newsletter } from '@/entities/public/newsletter';

import { Button } from '@/shared/shadcn';
import { AnimatedText, GlassCard, ParallaxCard } from '@/shared/ui';

import { ArticleSection } from './ArticleSection';
import { DetailHero } from './DetailHero';
import { NavigationBar } from './NavigationBar';

type DetailViewProps = {
  newsletter: Newsletter;
};

export const DetailView = ({ newsletter }: DetailViewProps) => {
  return (
    <>
      {/* Sticky Navigation */}
      <NavigationBar newsletter={newsletter} />

      {/* Hero Section */}
      <DetailHero newsletter={newsletter} />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/newsletter">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Übersicht
              </Link>
            </Button>
          </motion.div>

          {/* Introduction */}
          <ParallaxCard>
            <GlassCard className="mb-12 p-8">
              <AnimatedText gradient className="mb-4 text-2xl font-bold">
                {newsletter.title}
              </AnimatedText>
              <p className="text-lg leading-relaxed text-[var(--color-muted-foreground)]">
                {newsletter.introduction}
              </p>
            </GlassCard>
          </ParallaxCard>

          {/* Articles */}
          <AnimatePresence>
            {newsletter.articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ArticleSection article={article} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Closing */}
          {newsletter.closingMessage || newsletter.nextEditionHint ? (
            <ParallaxCard>
              <GlassCard className="mt-12 p-8 text-center">
                {newsletter.closingMessage ? (
                  <p className="mb-4 text-lg">{newsletter.closingMessage}</p>
                ) : null}
                {newsletter.nextEditionHint ? (
                  <p className="text-[var(--color-muted-foreground)] italic">
                    Nächste Ausgabe: {newsletter.nextEditionHint}
                  </p>
                ) : null}
              </GlassCard>
            </ParallaxCard>
          ) : null}
        </div>
      </div>
    </>
  );
};
