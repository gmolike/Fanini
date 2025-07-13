// frontend/src/shared/ui/parallax/ParallaxCard.tsx
import { type ReactNode,useRef } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';

type ParallaxCardProps = {
  children: ReactNode;
  offset?: number;
};

/**
 * Parallax scrolling card
 * @description Karte mit Parallax-Scroll-Effekt
 */
export const ParallaxCard = ({ children, offset = 50 }: ParallaxCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};
