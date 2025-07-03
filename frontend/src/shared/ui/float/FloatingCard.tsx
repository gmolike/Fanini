// frontend/src/shared/ui/float/FloatingCard.tsx
import { type ReactNode } from 'react';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { cn } from '@/shared/lib';

type FloatingCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

/**
 * Schwebende Karte mit 3D-Tilt Effekt bei Hover
 * @param intensity - Intensität des Tilt-Effekts (Standard: 10)
 */
export const FloatingCard = ({ children, className, intensity = 10 }: FloatingCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${String(intensity)}deg`, `${String(-intensity)}deg`]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${String(-intensity)}deg`, `${String(intensity)}deg`]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn('relative', className)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};
