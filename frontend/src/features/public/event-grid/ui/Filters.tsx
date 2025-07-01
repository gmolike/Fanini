// frontend/src/features/public/event-grid/ui/EventFilters.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn';
import { EVENT_CATEGORY_CONFIG, EVENT_ORGANIZER_CONFIG } from '@/entities/public/event';

type EventFiltersProps = {
  categoryFilter: string;
  organizerFilter: string;
  onCategoryChange: (value: string) => void;
  onOrganizerChange: (value: string) => void;
};

/**
 * EventFilters Component
 * @description Filter-Komponenten für Event-Grid
 */
export const EventFilters = ({
  categoryFilter,
  organizerFilter,
  onCategoryChange,
  onOrganizerChange,
}: EventFiltersProps) => {
  return (
    <>
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Kategorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Kategorien</SelectItem>
          {Object.entries(EVENT_CATEGORY_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              <span className="flex items-center gap-2">
                <span>{config.icon}</span>
                {config.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={organizerFilter} onValueChange={onOrganizerChange}>
        <SelectTrigger>
          <SelectValue placeholder="Veranstalter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Veranstalter</SelectItem>
          {Object.entries(EVENT_ORGANIZER_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              {config.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
