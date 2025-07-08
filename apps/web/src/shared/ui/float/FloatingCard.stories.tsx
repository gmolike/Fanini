// frontend/src/shared/ui/float/FloatingCard.stories.tsx
import { FloatingCard } from './FloatingCard';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * @description FloatingCard mit 3D-Tilt-Effekt beim Hover
 * Bewege die Maus über die Karte um den Effekt zu sehen
 */
const meta: Meta<typeof FloatingCard> = {
  title: 'floatingCard',
  component: FloatingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * @description Standard FloatingCard mit mittlerer Intensität
 */
export const Default: Story = {
  args: {
    children: (
      <div className="h-64 w-96 rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-2xl font-bold">Floating Card</h3>
        <p className="text-gray-600">
          Bewege deine Maus über diese Karte um den 3D-Tilt-Effekt zu sehen. Die Karte neigt sich in
          die Richtung deiner Mausbewegung.
        </p>
      </div>
    ),
  },
};

/**
 * @description FloatingCard mit niedriger Intensität
 */
export const LowIntensity: Story = {
  args: {
    intensity: 5,
    children: (
      <div className="h-64 w-96 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 p-6 text-white shadow-xl">
        <h3 className="mb-4 text-2xl font-bold">Niedrige Intensität</h3>
        <p>Der Tilt-Effekt ist hier subtiler (Intensität: 5)</p>
      </div>
    ),
  },
};

/**
 * @description FloatingCard mit hoher Intensität
 */
export const HighIntensity: Story = {
  args: {
    intensity: 20,
    children: (
      <div className="h-64 w-96 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white shadow-xl">
        <h3 className="mb-4 text-2xl font-bold">Hohe Intensität</h3>
        <p>Der Tilt-Effekt ist hier stärker ausgeprägt (Intensität: 20)</p>
      </div>
    ),
  },
};

/**
 * @description Mehrere FloatingCards nebeneinander
 */
export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <FloatingCard>
        <div className="h-48 rounded-lg bg-blue-500 p-4 text-white">
          <h4 className="font-semibold">Karte 1</h4>
        </div>
      </FloatingCard>
      <FloatingCard>
        <div className="h-48 rounded-lg bg-purple-500 p-4 text-white">
          <h4 className="font-semibold">Karte 2</h4>
        </div>
      </FloatingCard>
      <FloatingCard>
        <div className="h-48 rounded-lg bg-pink-500 p-4 text-white">
          <h4 className="font-semibold">Karte 3</h4>
        </div>
      </FloatingCard>
    </div>
  ),
};
