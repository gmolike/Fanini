// widgets/public/organization/ui/Widget.tsx
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';

import { OrganizationInfoCard } from '@/features/public/organization-info';
import { OrganizationListView } from '@/features/public/organization-list';

import { AnimatedValue } from '@/shared/ui';

export const OrganizationWidget = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-fanini-blue)]/5 via-transparent to-[var(--color-fanini-red)]/5">
      {/* Hero Section - exactly like Newsletter */}
      <div className="relative overflow-hidden py-20">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-blue)]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-red)]/10 blur-3xl delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mb-6 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-5"
          >
            <Building className="h-12 w-12 text-white" />
          </motion.div>

          <AnimatedValue delay={0.2}>
            <h1 className="mb-4 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              Über uns
            </h1>
          </AnimatedValue>

          <AnimatedValue delay={0.3}>
            <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
              Die Faninitiative Spandau e.V. - Struktur, Menschen und Leidenschaft. Entdecke wer wir
              sind und wie wir gemeinsam für unseren Verein arbeiten.
            </p>
          </AnimatedValue>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Gremien List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <OrganizationListView />
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <OrganizationInfoCard />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
