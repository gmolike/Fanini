/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/shared/ui/image/Image.tsx
import { useState } from 'react';

import { cn } from '@/shared/lib';

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  blurDataUrl?: string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
};

/**
 * Image
 * @description Erweiterte Image-Komponente mit Lazy Loading, Blur Placeholder und Fehlerbehandlung
 * @param {string} src - Bildquelle
 * @param {string} alt - Alternativer Text (Pflicht für Barrierefreiheit)
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {number} width - Bildbreite in Pixeln
 * @param {number} height - Bildhöhe in Pixeln
 * @param {'lazy' | 'eager'} loading - Loading-Strategie (default: lazy)
 * @param {string} fallbackSrc - Fallback-Bild bei Ladefehler
 * @param {string} blurDataUrl - Base64 Blur-Placeholder für smooth loading
 * @param {string} aspectRatio - Vordefiniertes Seitenverhältnis
 * @param {string} objectFit - CSS object-fit Wert
 * @param {Function} onLoad - Callback wenn Bild geladen
 * @param {Function} onError - Callback bei Ladefehler
 * @example
 * ```tsx
 * // Einfache Verwendung
 * <Image src="/hero.jpg" alt="Hero Bild" />
 *
 * // Mit Aspect Ratio und Fallback
 * <Image
 *   src="/event.jpg"
 *   alt="Event"
 *   aspectRatio="16:9"
 *   fallbackSrc="/placeholder.jpg"
 * />
 *
 * // Mit Blur Placeholder
 * <Image
 *   src="/team.jpg"
 *   alt="Team Foto"
 *   blurDataUrl="data:image/jpeg;base64,..."
 *   onLoad={() => console.log('Loaded!')}
 * />
 * ```
 */
export const Image = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  fallbackSrc = '/images/placeholder.jpg',
  blurDataUrl,
  aspectRatio,
  objectFit = 'cover',
  onLoad,
  onError,
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setImgSrc(fallbackSrc);
    onError?.(e);
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatio && aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Blur Placeholder */}
      {blurDataUrl && isLoading ? (
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 h-full w-full',
            objectFitClasses[objectFit],
            'scale-110 blur-lg'
          )}
        />
      ) : null}

      {/* Main Image */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'h-full w-full',
          objectFitClasses[objectFit],
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100 transition-opacity duration-300',
          hasError && 'grayscale'
        )}
      />

      {/* Loading State */}
      {isLoading && !blurDataUrl ? (
        <div className="bg-muted absolute inset-0 flex items-center justify-center">
          <div className="bg-muted-foreground/20 h-8 w-8 animate-pulse rounded-full" />
        </div>
      ) : null}
    </div>
  );
};
