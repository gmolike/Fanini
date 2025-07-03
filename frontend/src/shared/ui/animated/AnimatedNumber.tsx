// frontend/src/shared/ui/animated/AnimatedNumber.tsx
import { useEffect } from 'react';

import { motion, useSpring, useTransform } from 'framer-motion';

type AnimatedNumberProps = {
  value: number;
};

/**
 * Animated number display
 * @description Animiert Zahlenänderungen smooth
 */
export const AnimatedNumber = ({ value }: AnimatedNumberProps) => {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, current => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};
