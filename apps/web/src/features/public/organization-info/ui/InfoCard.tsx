// features/public/organization-info/ui/InfoCard.tsx
import { motion } from 'framer-motion';
import { FileText, Heart, Info, Shield } from 'lucide-react';

import { GlassCard, ParallaxCard } from '@/shared/ui';

export const InfoCard = () => {
  return (
    <ParallaxCard>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="bg-card/80 dark:bg-card/60 relative overflow-hidden p-8">
          {/* Background Animation */}
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 h-40 w-40 animate-pulse rounded-full bg-[var(--color-fanini-blue)]/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-[var(--color-fanini-red)]/10 blur-3xl delay-1000" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mb-4 inline-flex rounded-full bg-[var(--color-fanini-blue)] p-4"
              >
                <Info className="h-8 w-8 text-white" />
              </motion.div>

              <h3 className="text-foreground mb-2 text-2xl font-bold">
                Faninitiative Spandau e.V.
              </h3>

              <p className="text-muted-foreground">Gemeinsam für unseren Verein</p>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-2xl font-bold text-[var(--color-fanini-blue)]">2025</div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Gegründet</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-2xl font-bold text-[var(--color-fanini-red)]">7</div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">Gremien</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <a
                href="/about/vorstand"
                className="bg-background/80 hover:bg-background flex items-center gap-3 rounded-lg p-4 transition-all hover:shadow-md"
              >
                <Shield className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                <span className="font-medium">Vorstand</span>
              </a>

              <a
                href="/documents/satzung"
                className="bg-background/80 hover:bg-background flex items-center gap-3 rounded-lg p-4 transition-all hover:shadow-md"
              >
                <FileText className="h-5 w-5 text-[var(--color-fanini-red)]" />
                <span className="font-medium">Satzung</span>
              </a>

              <a
                href="/membership"
                className="bg-background/80 hover:bg-background flex items-center gap-3 rounded-lg p-4 transition-all hover:shadow-md"
              >
                <Heart className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                <span className="font-medium">Mitglied werden</span>
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </ParallaxCard>
  );
};
