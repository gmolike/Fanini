// frontend/src/features/public/home-hero/ScrollIndicator.tsx
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type ScrollIndicatorVariant = 'dots' | 'arrow' | 'text' | 'line' | 'pulse';

type ScrollIndicatorProps = {
  variant?: ScrollIndicatorVariant;
};

/**
 * Moderne Scroll-Indikatoren
 * @description Verschiedene Varianten für die Hero Section
 */
export const ScrollIndicator = ({ variant = 'arrow' }: ScrollIndicatorProps) => {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  switch (variant) {
    // Variante 1: Animierter Pfeil
    case 'arrow':
      return (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={scrollToContent}
          className="group absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            <span className="text-sm text-[var(--color-muted-foreground)] transition-colors group-hover:text-[var(--color-fanini-blue)]">
              Entdecke mehr
            </span>
            <ChevronDown className="h-6 w-6 text-[var(--color-fanini-blue)]" />
          </motion.div>
        </motion.button>
      );

    // Variante 2: Drei animierte Punkte
    case 'dots':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-[var(--color-fanini-blue)]"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      );

    // Variante 3: Nur Text mit sanfter Animation
    case 'text':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-sm text-[var(--color-muted-foreground)]"
          >
            Scroll für mehr
          </motion.p>
        </motion.div>
      );

    // Variante 4: Animierte Linie
    case 'line':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="relative h-20 w-[2px] overflow-hidden bg-[var(--color-muted-foreground)]/20">
            <motion.div
              className="absolute top-0 left-0 h-8 w-full bg-gradient-to-b from-[var(--color-fanini-blue)] to-transparent"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      );

    // Variante 5: Pulsierender Kreis
    case 'pulse':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div className="relative h-12 w-12" onClick={scrollToContent}>
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--color-fanini-blue)]/20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute inset-2 flex cursor-pointer items-center justify-center rounded-full bg-[var(--color-fanini-blue)]/10">
              <ChevronDown className="h-4 w-4 text-[var(--color-fanini-blue)]" />
            </div>
          </motion.div>
        </motion.div>
      );

    default:
      return null;
  }
};
