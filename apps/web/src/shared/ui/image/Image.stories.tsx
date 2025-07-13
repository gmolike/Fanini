// frontend/src/shared/ui/image/Image.stories.tsx
import { Image } from './Image';

import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'image',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => (
    <div className="w-96">
      <Image src="https://picsum.photos/400/300" alt="Beispielbild" />
    </div>
  ),
};

export const AspectRatios = {
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-4">
      <div>
        <p className="text-muted-foreground mb-2 text-sm">1:1 (Square)</p>
        <Image src="https://picsum.photos/400/400" alt="Square" aspectRatio="1:1" />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">4:3</p>
        <Image src="https://picsum.photos/400/300" alt="4:3 Ratio" aspectRatio="4:3" />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">16:9 (Video)</p>
        <Image src="https://picsum.photos/800/450" alt="16:9 Ratio" aspectRatio="16:9" />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">21:9 (Ultra Wide)</p>
        <Image src="https://picsum.photos/1000/428" alt="21:9 Ratio" aspectRatio="21:9" />
      </div>
    </div>
  ),
};

export const ObjectFit = {
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-3 gap-4">
      {(['cover', 'contain', 'fill'] as const).map(fit => (
        <div key={fit}>
          <p className="text-muted-foreground mb-2 text-sm">object-{fit}</p>
          <div className="h-48 rounded border">
            <Image
              src="https://picsum.photos/300/400"
              alt={`Object ${fit}`}
              objectFit={fit}
              className="h-full"
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Loading = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Mit Blur Placeholder</p>
        <Image
          src="https://picsum.photos/600/400"
          alt="Mit Blur"
          aspectRatio="16:9"
          blurDataUrl="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
        />
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">Lazy Loading</p>
        <Image
          src="https://picsum.photos/600/400?random=1"
          alt="Lazy loaded"
          aspectRatio="16:9"
          loading="lazy"
        />
      </div>
    </div>
  ),
};

export const ErrorValue = {
  render: () => (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">Bild mit fehlerhafter URL (zeigt Fallback)</p>
      <Image
        src="https://invalid-url-that-does-not-exist.com/image.jpg"
        alt="Fehlerhaftes Bild"
        fallbackSrc="https://via.placeholder.com/400x300/cccccc/666666?text=Placeholder"
        aspectRatio="4:3"
      />
    </div>
  ),
};
