// frontend/src/features/public/event-calendar/ui/CalendarHeader.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/shadcn';

type CalendarHeaderProps = {
  selectedDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
};

/**
 * CalendarHeader Component
 * @description Kalender-Navigation
 */
export const CalendarHeader = ({
  selectedDate,
  onNavigateMonth,
  onGoToToday,
}: CalendarHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-semibold">
        {selectedDate.toLocaleDateString('de-DE', {
          month: 'long',
          year: 'numeric',
        })}
      </h2>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => onNavigateMonth('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onGoToToday}>
          Heute
        </Button>
        <Button variant="outline" size="icon" onClick={() => onNavigateMonth('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
