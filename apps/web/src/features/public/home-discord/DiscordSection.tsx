// frontend/src/features/public/home-discord/DiscordSection.tsx
import { useState } from 'react';

import { motion } from 'framer-motion';
import { MessageSquare, Users, Zap } from 'lucide-react';

import { Button } from '@/shared/shadcn';
import { AnimatedValue, GlassCard, HoverCard, ParallaxCard } from '@/shared/ui';

/**
 * Discord Section für die Homepage
 * @description Zeigt Discord-Integration mit Live-Stats und CTA
 */
export const DiscordSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ParallaxCard>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <HoverCard>
          <GlassCard className="relative overflow-hidden p-8 md:p-12">
            {/* Animated Background */}
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  rotate: isHovered ? 180 : 0,
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#5865F2]/10 blur-3xl"
              />
              <motion.div
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? -180 : 0,
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#5865F2]/20 blur-3xl"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
              {/* Text Content */}
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-flex rounded-full bg-[#5865F2] p-4"
                >
                  <MessageSquare className="h-8 w-8 text-white" />
                </motion.div>

                <div>
                  <AnimatedValue gradient delay={0.3}>
                    <h2 className="mb-4 text-4xl font-bold">Werde Teil unserer Community</h2>
                  </AnimatedValue>
                  <p className="text-lg text-[var(--color-muted-foreground)]">
                    Tausche dich mit anderen Fans aus, bleibe immer auf dem Laufenden und erlebe die
                    Faninitiative hautnah auf unserem Discord-Server.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    size="lg"
                    className="bg-[#5865F2] text-white shadow-lg hover:bg-[#4752C4]"
                    asChild
                  >
                    <a
                      href="https://discord.gg/faninitiative"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3"
                    >
                      <MessageSquare className="h-5 w-5" />
                      Jetzt Discord beitreten
                      <motion.span
                        animate={{ x: isHovered ? 5 : 0 }}
                        transition={{ type: 'spring' }}
                      >
                        →
                      </motion.span>
                    </a>
                  </Button>
                </motion.div>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, value: '1500+', label: 'Aktive Mitglieder' },
                  { icon: MessageSquare, value: 'Alle', label: 'Event Infos' },
                  { icon: Zap, value: '24/7', label: 'Community' },
                  { icon: Users, value: '15+', label: 'Voice Channels' },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <GlassCard className="p-6 text-center transition-transform hover:scale-105">
                        <Icon className="mx-auto mb-3 h-8 w-8 text-[#5865F2]" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-[var(--color-muted-foreground)]">
                          {stat.label}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </HoverCard>
      </motion.div>
    </ParallaxCard>
  );
};
