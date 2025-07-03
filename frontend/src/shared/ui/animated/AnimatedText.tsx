// frontend/src/shared/ui/animated/AnimatedText.tsx
import { type ReactNode } from 'react';

import { motion, type Variants } from 'framer-motion';

import { cn } from '@/shared/lib';

type AnimatedTextProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  gradient?: boolean;
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Animierter Text mit Fade-In Effekt
 * @param delay - Verzögerung der Animation in Sekunden
 * @param gradient - Aktiviert Gradient Text Effekt
 */
export const AnimatedText = ({
  children,
  className,
  delay = 0,
  gradient = false,
}: AnimatedTextProps) => {
  return (
    <motion.div
      variants={textVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay }}
      className={cn(
        gradient &&
          'bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
