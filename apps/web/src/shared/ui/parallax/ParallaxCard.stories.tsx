// frontend/src/shared/ui/parallax/ParallaxCard.stories.tsx
import { ParallaxCard } from './ParallaxCard';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * @description ParallaxCard mit Scroll-Effekt
 * Scrolle die Seite um den Parallax-Effekt zu sehen
 */
const meta: Meta<typeof ParallaxCard> = {
  title: 'parallaxCard',
  component: ParallaxCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="min-h-[200vh] bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="flex h-screen items-center justify-center">
          <p className="text-2xl text-gray-600">↓ Scrolle nach unten um den Effekt zu sehen ↓</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Story />
        </div>
        <div className="h-screen" />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * @description Standard Parallax-Effekt
 */
export const Default: Story = {
  args: {
    children: (
      <div className="h-64 w-96 rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-2xl font-bold">Parallax Card</h3>
        <p className="text-gray-600">
          Diese Karte bewegt sich beim Scrollen langsamer als der Rest der Seite.
        </p>
      </div>
    ),
  },
};

/**
 * @description Parallax mit höherem Offset
 */
export const HighOffset: Story = {
  args: {
    offset: 100,
    children: (
      <div className="h-64 w-96 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-xl">
        <h3 className="mb-4 text-2xl font-bold">Hoher Offset</h3>
        <p>Diese Karte hat einen stärkeren Parallax-Effekt (offset: 100)</p>
      </div>
    ),
  },
};

/**
 * @description Mehrere Parallax-Karten mit verschiedenen Offsets
 */
export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-32">
      <ParallaxCard offset={30}>
        <div className="h-48 rounded-lg bg-blue-500 p-6 text-white shadow-lg">
          <h4 className="text-xl font-semibold">Offset: 30</h4>
          <p>Leichter Parallax-Effekt</p>
        </div>
      </ParallaxCard>

      <ParallaxCard offset={60}>
        <div className="h-48 rounded-lg bg-green-500 p-6 text-white shadow-lg">
          <h4 className="text-xl font-semibold">Offset: 60</h4>
          <p>Mittlerer Parallax-Effekt</p>
        </div>
      </ParallaxCard>

      <ParallaxCard offset={90}>
        <div className="h-48 rounded-lg bg-purple-500 p-6 text-white shadow-lg">
          <h4 className="text-xl font-semibold">Offset: 90</h4>
          <p>Starker Parallax-Effekt</p>
        </div>
      </ParallaxCard>
    </div>
  ),
};
