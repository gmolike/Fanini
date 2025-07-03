// frontend/src/shared/ui/common/Image.tsx
import { useState } from 'react';

import { ImageOff } from 'lucide-react';

import { cn } from '@/shared/lib';

type ImageProps = {
  /** Die Bild-URL */
  src: string;
  /** Alt-Text für Barrierefreiheit */
  alt: string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Fallback-Element bei Ladefehler */
  fallback?: React.ReactNode;
  /** Callback bei erfolgreichem Laden */
  onLoad?: () => void;
  /** Callback bei Ladefehler */
  onError?: () => void;
};

/**
 * Image Component
 * @description Bild-Komponente mit Fehlerbehandlung und Lazy Loading
 * @example
 * ```tsx
 * <Image
 *   src="/images/hero.jpg"
 *   alt="Hero Image"
 *   className="w-full h-auto"
 * />
 * ```
 */
export const Image = ({ src, alt, className, fallback, onLoad, onError }: ImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  if (hasError) {
    return (
      fallback ?? (
        <div className={cn('bg-muted flex items-center justify-center', className)}>
          <ImageOff className="text-muted-foreground h-8 w-8" />
        </div>
      )
    );
  }

  return (
    <>
      {isLoading ? <div className={cn('bg-muted animate-pulse', className)} /> : null}
      <img
        src={src}
        alt={alt}
        className={cn(isLoading && 'hidden', className)}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </>
  );
};
