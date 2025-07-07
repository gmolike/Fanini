/* eslint-disable sonarjs/pseudo-random */
// frontend/src/features/public/home-hero/Hero.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

import { Button } from '@/shared/shadcn';
import { AnimatedValue, Container } from '@/shared/ui';

/**
 * Hero Section für die Homepage
 * @description Moderne Hero mit verstärkten Animationen und Gradient-Effekten
 */
export const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Enhanced Animated Background - bleibt wie vorher */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, var(--color-fanini-blue) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, var(--color-fanini-red) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, var(--color-fanini-blue) 0%, transparent 40%),
              radial-gradient(circle at 70% 60%, var(--color-fanini-red) 0%, transparent 40%)
            `,
          }}
        />

        {/* Floating Elements - bleibt wie vorher */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'var(--color-fanini-blue)' : 'var(--color-fanini-red)'
              } 0%, transparent 70%)`,
              width: `${String(200 + i * 50)}px`,
              height: `${String(200 + i * 50)}px`,
              left: `${String(Math.random() * 100)}%`,
              top: `${String(Math.random() * 100)}%`,
              opacity: 0.15 + i * 0.05,
            }}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -50, 50, 0],
              scale: [1, 1.3, 0.7, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}

        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              linear-gradient(45deg, var(--color-fanini-blue)/20 0%, transparent 50%, var(--color-fanini-red)/20 100%),
              linear-gradient(-45deg, var(--color-fanini-red)/20 0%, transparent 50%, var(--color-fanini-blue)/20 100%)
            `,
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          {/* Logo - bleibt wie vorher */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1 }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 3, repeat: Infinity, repeatType: 'reverse' },
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] opacity-50 blur-2xl"
              />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-2xl">
                <img
                  src="/images/logo.png"
                  alt="Faninitiative Spandau"
                  className="h-28 w-28 object-contain"
                />
              </div>
            </div>
          </motion.div>

          {/* Title - bleibt wie vorher */}
          <AnimatedValue delay={0.3}>
            <h1 className="mb-6 text-6xl font-bold md:text-8xl">
              <motion.span
                className="inline-block bg-gradient-to-r from-[var(--color-fanini-blue)] via-purple-500 to-[var(--color-fanini-red)] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Faninitiative
              </motion.span>
              <br />
              <span className="text-4xl md:text-6xl">Spandau e.V.</span>
            </h1>
          </AnimatedValue>

          {/* Subtitle */}
          <AnimatedValue delay={0.5}>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-[var(--color-muted-foreground)] md:text-2xl">
              Die offizielle Faninitiative der Eintracht Spandau.
              <div className="mt-2 flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </motion.span>
                Leidenschaft aus Tradition seit 2025
                <motion.span
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </motion.span>
              </div>
            </p>
          </AnimatedValue>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="transform bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              asChild
            >
              <a
                href="https://easyverein.com/public/Fanini/applicationform/12733"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Heart className="h-5 w-5" />
                Mitglied werden
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 backdrop-blur-sm hover:bg-white/10"
              asChild
            >
              <a href="https://discord.gg/faninitiative" target="_blank" rel="noopener noreferrer">
                Zur Community
              </a>
            </Button>
          </motion.div>

          {/* "Entdecke mehr" unter den Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <motion.p
              animate={{
                y: [0, 5, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="cursor-pointer text-sm font-medium text-[var(--color-fanini-blue)]"
              onClick={() => {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }}
            >
              Entdecke mehr
              <motion.span
                className="mt-1 block"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </motion.p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
