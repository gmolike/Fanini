import { cn } from '@/shared/lib';

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryProps = {
  images: GalleryImage[];
  className?: string;
};

export const Gallery = ({ images, className }: GalleryProps) => {
  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
      {images.map(image => (
        <div
          key={image.src}
          className="group aspect-square cursor-pointer overflow-hidden rounded-lg"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      ))}

      {/* Placeholder für weitere Bilder */}
      {images.length < 8 &&
        Array.from({ length: 8 - images.length }).map((_, i) => (
          <div
            key={`placeholder-${String(images.length + i)}`}
            className="flex aspect-square items-center justify-center rounded-lg bg-[var(--color-muted)]"
          >
            <span className="text-[var(--color-muted-foreground)]">Bald mehr...</span>
          </div>
        ))}
    </div>
  );
};
