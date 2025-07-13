// frontend/src/shared/ui/themetoggle/ThemeToggle.stories.tsx
import { ThemeToggle } from './ThemeToggle';

import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'themetoggle',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => (
    <div className="flex items-center gap-4">
      <span className="text-muted-foreground text-sm">Theme umschalten:</span>
      <ThemeToggle />
    </div>
  ),
};

export const InHeader = {
  render: () => (
    <div className="bg-background w-full border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold">Faninitiative Spandau</h1>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">Max Mustermann</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  ),
};

export const ColorTest = {
  render: () => (
    <div className="w-96 space-y-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Standard Karte</h3>
          <p className="text-muted-foreground text-sm">
            Diese Karte passt sich automatisch an das Theme an.
          </p>
        </div>

        <div className="rounded-lg bg-[var(--color-fanini-blue)] p-4 text-white">
          <h3 className="mb-2 font-semibold">Vereinsfarben</h3>
          <p className="text-sm text-white/90">
            Die Vereinsfarben bleiben in beiden Themes gleich.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded p-3 text-center">
            <span className="text-sm">Muted</span>
          </div>
          <div className="bg-accent rounded p-3 text-center">
            <span className="text-sm">Accent</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
