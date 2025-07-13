// frontend/src/shared/ui/timeline/Timeline.stories.tsx
import { useState } from 'react';

import { ModernTimeline } from './ModernTimeline';

import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'timeline',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => {
    const TimelineDemo = () => {
      const [selectedYear, setSelectedYear] = useState(2024);
      const years = [2020, 2021, 2022, 2023, 2024, 2025];

      return (
        <div className="w-full">
          <ModernTimeline
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
          <div className="mt-8 text-center">
            <p className="text-lg">
              Ausgewähltes Jahr: <strong>{selectedYear}</strong>
            </p>
          </div>
        </div>
      );
    };

    return <TimelineDemo />;
  },
};

export const ManyYears = {
  render: () => {
    const TimelineDemo = () => {
      const [selectedYear, setSelectedYear] = useState(2024);
      const years = Array.from({ length: 20 }, (_, i) => 2010 + i);

      return (
        <div className="w-full">
          <h3 className="mb-4 text-center text-lg font-semibold">
            Timeline mit vielen Jahren (Responsive Grid)
          </h3>
          <ModernTimeline
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
      );
    };

    return <TimelineDemo />;
  },
};

export const WithContent = {
  render: () => {
    const TimelineDemo = () => {
      const [selectedYear, setSelectedYear] = useState(2024);
      const years = [2021, 2022, 2023, 2024, 2025];

      const eventsByYear: Record<number, string[]> = {
        2021: ['Vereinsgründung', 'Erste Mitgliederversammlung'],
        2022: ['Sommerfest', 'Weihnachtsfeier', 'Charity Event'],
        2023: ['Neujahrsempfang', 'Sommerfest', 'Oktoberfest'],
        2024: ['Mitgliederversammlung', 'Sommerfest', 'Adventsbasar'],
        2025: ['Neujahrsempfang (geplant)', 'Jubiläumsfeier (geplant)'],
      };

      return (
        <div className="mx-auto w-full max-w-4xl">
          <ModernTimeline
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />

          <div className="mt-8 rounded-lg border p-6">
            <h3 className="mb-4 text-xl font-bold">Events {selectedYear}</h3>
            <ul className="space-y-2">
              {eventsByYear[selectedYear]?.map(event => (
                <li key={event} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-fanini-blue)]" />
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    };

    return <TimelineDemo />;
  },
};
