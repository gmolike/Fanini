// frontend/src/shared/ui/glass/GlassCard.stories.tsx
import { GlassCard } from './GlassCard';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * @description GlassCard mit Glassmorphism-Effekt
 * Funktioniert am besten vor bunten Hintergründen
 */
const meta: Meta<typeof GlassCard> = {
  title: 'glassCard',
  component: GlassCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="relative min-h-[400px] w-full overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-8">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * @description Standard GlassCard
 */
export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="mb-2 text-2xl font-bold text-white">Glass Morphism</h3>
        <p className="text-white/80">
          Diese Karte hat einen Glassmorphism-Effekt mit Blur und semi-transparentem Hintergrund.
        </p>
      </div>
    ),
  },
};

/**
 * @description GlassCard mit Form-Inhalt
 */
export const WithForm: Story = {
  args: {
    className: 'w-96',
    children: (
      <div className="p-8">
        <h3 className="mb-6 text-2xl font-bold text-white">Login</h3>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-Mail"
            className="w-full rounded-lg bg-white/20 px-4 py-2 text-white placeholder-white/60 backdrop-blur"
          />
          <input
            type="password"
            placeholder="Passwort"
            className="w-full rounded-lg bg-white/20 px-4 py-2 text-white placeholder-white/60 backdrop-blur"
          />
          <button className="w-full rounded-lg bg-white/30 py-2 font-semibold text-white backdrop-blur transition hover:bg-white/40">
            Anmelden
          </button>
        </div>
      </div>
    ),
  },
};

/**
 * @description Mehrere GlassCards übereinander
 */
export const Layered: Story = {
  render: () => (
    <div className="relative">
      <GlassCard className="absolute top-0 left-0 h-48 w-64">
        <div className="p-4 text-white">
          <h4 className="font-semibold">Ebene 1</h4>
        </div>
      </GlassCard>
      <GlassCard className="absolute top-8 left-8 h-48 w-64">
        <div className="p-4 text-white">
          <h4 className="font-semibold">Ebene 2</h4>
        </div>
      </GlassCard>
      <GlassCard className="relative top-16 left-16 h-48 w-64">
        <div className="p-4 text-white">
          <h4 className="font-semibold">Ebene 3</h4>
        </div>
      </GlassCard>
    </div>
  ),
};
