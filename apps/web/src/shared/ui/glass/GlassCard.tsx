// frontend/src/shared/ui/glass/GlassCard.tsx
import { cn } from '@/shared/lib';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Glass morphism card component
 * @description Erstellt einen glassmorphism Effekt mit blur und semi-transparenz
 */
export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div
      className={cn(
        'bg-white/10 backdrop-blur-md dark:bg-black/10',
        'border border-white/20 dark:border-white/10',
        'rounded-xl shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
};
