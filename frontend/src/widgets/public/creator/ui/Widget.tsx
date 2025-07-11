// widgets/public/creator/ui/Widget.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Grid3x3, Palette } from 'lucide-react';

import { CreatorInfoCard } from '@/features/public/creator-info';
import { CreatorListView } from '@/features/public/creator-list';

import { AnimatedValue } from '@/shared/ui';

export const CreatorWidget = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-fanini-blue)]/5 via-transparent to-[var(--color-fanini-red)]/5">
      {/* Hero Section - wie bei Organization */}
      <div className="relative overflow-hidden py-20">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-amber-500/10 blur-3xl delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mb-6 inline-flex rounded-full bg-gradient-to-r from-purple-500 to-amber-500 p-5"
          >
            <Palette className="h-12 w-12 text-white" />
          </motion.div>

          <AnimatedValue delay={0.2}>
            <h1 className="mb-4 bg-gradient-to-r from-purple-500 to-amber-500 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              Kreativbereich
            </h1>
          </AnimatedValue>

          <AnimatedValue delay={0.3}>
            <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
              Entdecke die kreativen Köpfe der Faninitiative - Künstler, Designer, Fotografen und
              Content Creator präsentieren ihre Werke.
            </p>
          </AnimatedValue>

          {/* Gallery Button - KORRIGIERT: Kein Button mit asChild */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Link
              to="/kreativ/galerie"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-amber-500 px-6 py-3 text-lg font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              <Grid3x3 className="h-5 w-5" />
              Zur Galerie
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Creator List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <CreatorListView />
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <CreatorInfoCard />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
