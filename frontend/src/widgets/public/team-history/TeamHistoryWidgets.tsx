// frontend/src/widgets/public/team-history/TeamHistoryWidgets.tsx
import { useState } from 'react';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { TeamHistoryTabs } from '@/features/public/team-history';

import { useAvailableYears, useTeamHistoryByYear } from '@/entities/public/team-history';

import { Button } from '@/shared/shadcn';

/**
 * Timeline Widget für Team History
 * @component
 */
export const TeamHistoryWidgets = () => {
  const { data: availableYears, isLoading: isLoadingYears } = useAvailableYears();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear - 1);

  // useTeamHistoryByYear gibt eine Funktion zurück, die wir aufrufen müssen
  const teamHistoryQuery = useTeamHistoryByYear(selectedYear);
  const { data: yearData, isLoading: isLoadingData } = teamHistoryQuery();

  if (isLoadingYears) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-muted-foreground)]" />
      </div>
    );
  }

  if (!availableYears || availableYears.years.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--color-muted-foreground)]">
        Keine Historie verfügbar
      </div>
    );
  }

  const canGoNext = selectedYear < Math.max(...availableYears.years);
  const canGoPrev = selectedYear > Math.min(...availableYears.years);

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setSelectedYear(y => y - 1);
          }}
          disabled={!canGoPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="font-[Bebas_Neue] text-3xl font-bold text-[var(--color-fanini-blue)]">
          {selectedYear}
        </h2>

        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setSelectedYear(y => y + 1);
          }}
          disabled={!canGoNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Year Navigation Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {availableYears.years.map(year => (
          <button
            key={year}
            onClick={() => {
              setSelectedYear(year);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              year === selectedYear
                ? 'bg-[var(--color-fanini-blue)] text-white'
                : 'bg-[var(--color-muted)] hover:bg-[var(--color-accent)]'
            } `}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Content - Entfernte die verschachtelte ternary expression */}
      {(() => {
        if (isLoadingData) {
          return (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-muted-foreground)]" />
            </div>
          );
        }

        if (yearData) {
          return <TeamHistoryTabs yearData={yearData} />;
        }

        return (
          <div className="py-12 text-center text-[var(--color-muted-foreground)]">
            Keine Daten für {selectedYear} verfügbar
          </div>
        );
      })()}
    </div>
  );
};
