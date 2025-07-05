// frontend/src/shared/ui/animated/AnimatedValue.tsx
import { useEffect } from 'react';

import { motion, useSpring, useTransform } from 'framer-motion';

import { cn } from '@/shared/lib';

type AnimatedValueProps = {
  value: string | number;
  className?: string;
  delay?: number;
  gradient?: boolean;
  format?: (value: number) => string;
};

/**
 * AnimatedValue Komponente
 * @description Animiert Text und Zahlenänderungen
 * @param {string | number} value - Der zu animierende Wert
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {number} delay - Verzögerung der Animation in Sekunden
 * @param {boolean} gradient - Aktiviert Gradient Text Effekt
 * @param {Function} format - Custom Formatierung für Zahlen
 * @example
 * ```tsx
 * // Für Zahlen
 * <AnimatedValue value={1234} format={(n) => `€${n}`} />
 *
 * // Für Text
 * <AnimatedValue value="Willkommen" gradient />
 * ```
 */
export const AnimatedValue = ({
  value,
  className,
  delay = 0,
  gradient = false,
  format,
}: AnimatedValueProps) => {
  // Always call hooks in the same order
  const isNumber = typeof value === 'number';
  // Provide a default number for useSpring if not a number
  const spring = useSpring(isNumber ? value : 0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, current => {
    const rounded = Math.round(current);
    return format ? format(rounded) : rounded.toString();
  });

  useEffect(() => {
    if (isNumber) {
      spring.set(value);
    }
  }, [spring, value, isNumber]);

  if (isNumber) {
    return (
      <motion.span
        className={cn(
          gradient &&
            'bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-transparent',
          className
        )}
      >
        {display}
      </motion.span>
    );
  }

  // Für Text
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        gradient &&
          'bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-transparent',
        className
      )}
    >
      {value}
    </motion.div>
  );
};
