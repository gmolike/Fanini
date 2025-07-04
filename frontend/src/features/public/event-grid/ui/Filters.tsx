// frontend/src/features/public/event-grid/ui/FilterPanel.tsx
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import { EVENT_CATEGORY_CONFIG, EVENT_ORGANIZER_CONFIG } from '@/entities/public/event';

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn';

type FilterPanelProps = {
  filters: {
    category: string;
    organizer: string;
    timeRange: string;
  };
  onFiltersChange: (filters: { category: string; organizer: string; timeRange: string }) => void;
};

export const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const hasActiveFilters = Object.values(filters).some(f => f !== 'all');

  return (
    <div className="flex items-center gap-2">
      <Select
        value={filters.category}
        onValueChange={value => {
          onFiltersChange({ ...filters, category: value });
        }}
      >
        <SelectTrigger className="bg-background/50">
          <SelectValue placeholder="Kategorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Kategorien</SelectItem>
          {Object.entries(EVENT_CATEGORY_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              <span className="flex items-center gap-2">
                <span className={config.color}>{config.icon}</span>
                {config.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.organizer}
        onValueChange={value => {
          onFiltersChange({ ...filters, organizer: value });
        }}
      >
        <SelectTrigger className="bg-background/50">
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

      {hasActiveFilters ? (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onFiltersChange({ category: 'all', organizer: 'all', timeRange: 'all' });
            }}
          >
            <X className="mr-1 h-4 w-4" />
            Filter zurücksetzen
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
};
