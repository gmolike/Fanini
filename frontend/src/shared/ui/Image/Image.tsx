// frontend/src/shared/ui/Image/Image.tsx
import { type ImgHTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

type ImageProps = {
  fallback?: string;
} & ImgHTMLAttributes<HTMLImageElement>

export const Image = ({
  className,
  alt,
  fallback = '/images/placeholder.jpg',
  ...props
}: ImageProps) => {
  return (
    <img
      className={cn('object-cover', className)}
      alt={alt}
      onError={e => {
        e.currentTarget.src = fallback;
      }}
      loading='lazy'
      {...props}
    />
  );
};
