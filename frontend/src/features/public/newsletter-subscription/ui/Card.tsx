// frontend/src/features/public/newsletter-subscription/ui/Card.tsx
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';

import { GlassCard, ParallaxCard } from '@/shared/ui';

import { SubscriptionForm } from './Form';

export const SubscriptionCard = () => {
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
                <Mail className="h-8 w-8 text-white" />
              </motion.div>

              <h3 className="text-foreground mb-2 text-2xl font-bold">Fanini-Newsletter</h3>

              <p className="text-muted-foreground">Alle Updates direkt in dein Postfach</p>

              {/* Features */}
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <span className="text-foreground flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Exklusive Inhalte
                </span>
                <span className="text-foreground flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Kostenlos
                </span>
              </div>
            </div>

            {/* Form */}
            <SubscriptionForm />
          </div>
        </GlassCard>
      </motion.div>
    </ParallaxCard>
  );
};
