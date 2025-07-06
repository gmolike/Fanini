// features/public/creator-info/ui/InfoCard.tsx
import { motion } from 'framer-motion';
import { Brush, Camera, Film, Music, Sparkles } from 'lucide-react';

import { GlassCard, ParallaxCard } from '@/shared/ui';
import { socialIcons } from '@/shared/ui/icons/socialIcons';

export const InfoCard = () => {
  // Social Links für den Kreativbereich
  const creativeSocialLinks = [
    {
      name: 'instagram',
      href: 'https://instagram.com/fanini_kreativ',
      icon: socialIcons.instagram.path,
    },
  ];

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
            <div className="absolute -top-20 -right-20 h-40 w-40 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-amber-500/10 blur-3xl delay-1000" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mb-4 inline-flex rounded-full bg-gradient-to-r from-purple-500 to-amber-500 p-4"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>

              <h3 className="text-foreground mb-2 text-2xl font-bold">Kreativbereich</h3>

              <p className="text-muted-foreground">Kunst & Kreativität für unseren Verein</p>

              {/* Social Links */}
              <div className="mt-4 flex justify-center gap-2">
                {creativeSocialLinks.map(social => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-purple-500/20"
                    aria-label={social.name}
                  >
                    <svg
                      className="h-4 w-4 fill-[var(--color-muted-foreground)] transition-colors group-hover:fill-purple-500"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>

              {/* Kategorien */}
              <div className="mt-6 space-y-3">
                <div className="rounded-lg bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brush className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Grafik Design</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Fotografie</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Film className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Video</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Musik</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-amber-500/20 p-4 text-center">
              <p className="text-sm font-medium">Du bist kreativ und möchtest mitmachen?</p>
              <a
                href="/kontakt"
                className="mt-2 inline-block text-sm font-bold text-[var(--color-fanini-blue)] hover:underline"
              >
                Kontaktiere uns →
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </ParallaxCard>
  );
};
