// pages/_public/kreativ.galerie.tsx
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Grid3x3 } from 'lucide-react';

import { CreatorGalleryView } from '@/features/public/creator-gallery';

import { AnimatedValue, Container } from '@/shared/ui';

export const Route = createFileRoute('/_public/kreativ/galerie')({
  component: GaleriePage,
});

function GaleriePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-fanini-blue)]/5 via-transparent to-[var(--color-fanini-red)]/5">
      {/* Hero Section - kompakter als Hauptseite */}
      <div className="relative overflow-hidden py-16">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 h-60 w-60 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 animate-pulse rounded-full bg-amber-500/10 blur-3xl delay-1000" />
        </div>

        {/* Content */}
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mb-4 inline-flex rounded-full bg-gradient-to-r from-purple-500 to-amber-500 p-4"
          >
            <Grid3x3 className="h-8 w-8 text-white" />
          </motion.div>

          <AnimatedValue delay={0.1}>
            <h1 className="mb-4 bg-gradient-to-r from-purple-500 to-amber-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Kreativ-Galerie
            </h1>
          </AnimatedValue>

          <AnimatedValue delay={0.2}>
            <p className="mx-auto max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              Entdecke alle kreativen Werke unserer talentierten Künstler
            </p>
          </AnimatedValue>
        </Container>
      </div>

      {/* Gallery Content */}
      <Container className="pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CreatorGalleryView />
        </motion.div>
      </Container>
    </div>
  );
}
