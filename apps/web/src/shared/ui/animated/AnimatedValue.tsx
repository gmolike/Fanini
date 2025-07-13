// frontend/src/shared/ui/animated/AnimatedValue.tsx
import { type ReactNode, useEffect } from 'react';

import { motion, useSpring, useTransform, type Variants } from 'framer-motion';

import { cn } from '@/shared/lib';

type AnimatedValueProps = {
  className?: string;
  delay?: number;
  gradient?: boolean;
} & (
  | { value: number; format?: (value: number) => string; children?: never }
  | { value?: never; format?: never; children: ReactNode }
);

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * AnimatedValue
 * @description Animiert Zahlen oder Text-Content
 * @example
 * ```tsx
 * // Für Zahlen
 * <AnimatedValue value={1234} format={(n) => `${n}€`} />
 *
 * // Für Content
 * <AnimatedValue delay={0.2}>
 *   <h1>Willkommen</h1>
 * </AnimatedValue>
 * ```
 */
export const AnimatedValue = (props: AnimatedValueProps) => {
  const { className, delay = 0, gradient = false } = props;

  // Always call hooks at the top level
  const spring = useSpring('value' in props && props.value !== undefined ? props.value : 0, {
    stiffness: 100,
    damping: 30,
  });
  const display = useTransform(spring, current => {
    const rounded = Math.round(current);
    if ('value' in props && props.value !== undefined) {
      if (props.format) {
        return props.format(rounded);
      } else {
        return rounded.toString();
      }
    } else {
      return '';
    }
  });

  useEffect(() => {
    if ('value' in props && props.value !== undefined) {
      spring.set(props.value);
    }
  }, [spring, props]);

  // Zahlen-Animation
  if ('value' in props && props.value !== undefined) {
    return <motion.span className={className}>{display}</motion.span>;
  }

  // Text/Content-Animation
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
      {props.children}
    </motion.div>
  );
};
