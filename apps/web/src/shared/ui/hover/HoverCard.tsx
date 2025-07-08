// frontend/src/shared/ui/hover/HoverCard.tsx
import { motion } from 'framer-motion';

import type { ReactNode } from 'react';

type HoverCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Hover card with 3D tilt effect
 * @description Karte mit 3D-Neigungseffekt beim Hovern
 */
export const HoverCard = ({ children, className }: HoverCardProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 1.02,
        rotateY: 5,
        rotateX: -5,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
};
