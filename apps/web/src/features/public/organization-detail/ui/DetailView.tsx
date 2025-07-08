// features/public/organization-detail/ui/DetailView.tsx
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import type { Gremium } from '@/entities/public/organization';

import { Button } from '@/shared/shadcn';
import { AnimatedValue, GlassCard } from '@/shared/ui';
import { ParallaxCard } from '@/shared/ui/parallax';

import { DetailHero } from './Hero';
import { HighlightSection } from './HighlightSection';
import { MemberSection } from './MemberSection';
import { ResponsibilitySection } from './ResponsibilitySection';

type DetailViewProps = {
  gremium: Gremium;
};

export const DetailView = ({ gremium }: DetailViewProps) => {
  return (
    <>
      {/* Hero Section */}
      <DetailHero gremium={gremium} />

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
              <Link to="/about">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Übersicht
              </Link>
            </Button>
          </motion.div>

          {/* Introduction */}
          <ParallaxCard>
            <GlassCard className="mb-12 p-8">
              <AnimatedValue gradient className="mb-4 text-2xl font-bold">
                Über das {gremium.name}
              </AnimatedValue>
              <p className="text-lg leading-relaxed text-[var(--color-muted-foreground)]">
                {gremium.description}
              </p>
            </GlassCard>
          </ParallaxCard>

          {/* Members */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MemberSection members={gremium.members} />
            </motion.div>
          </AnimatePresence>

          {/* Responsibilities */}
          {gremium.responsibilities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ResponsibilitySection responsibilities={gremium.responsibilities} />
            </motion.div>
          )}

          {/* Highlights */}
          {gremium.highlights && gremium.highlights.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HighlightSection highlights={gremium.highlights} />
            </motion.div>
          ) : null}
        </div>
      </div>
    </>
  );
};
