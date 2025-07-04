// frontend/src/shared/ui/image/Image.tsx
import { cn } from '@/shared/lib';

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
};

/**
 * Optimierte Image-Komponente mit Lazy Loading und Fehlerbehandlung
 * @component
 * @param {string} src - Bildquelle
 * @param {string} alt - Alternativer Text
 * @param {string} [className] - Zusätzliche CSS-Klassen
 * @param {number} [width] - Bildbreite
 * @param {number} [height] - Bildhöhe
 * @param {'lazy' | 'eager'} [loading='lazy'] - Loading-Strategie
 * @param {function} [onError] - Error Handler
 */
export const Image = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  onError,
}: ImageProps) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      width={width}
      height={height}
      loading={loading}
      onError={handleError}
    />
  );
};
