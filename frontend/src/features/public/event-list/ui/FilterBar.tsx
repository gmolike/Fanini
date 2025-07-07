// features/public/event-list/ui/FilterBar.tsx
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, Search, X } from 'lucide-react';

import { EVENT_ORGANIZER_CONFIG, EVENT_TYPE_CONFIG, type EventType } from '@/entities/public/event';

import { Badge, Input, Switch } from '@/shared/shadcn';
import { AnimatedValue, GlassCard } from '@/shared/ui';

type EventFilterBarProps = {
  searchTerm: string;
  selectedType: string | null;
  selectedOrganizer: string | null;
  showPastEvents: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string | null) => void;
  onOrganizerChange: (organizer: string | null) => void;
  onPastEventsToggle: (show: boolean) => void;
  eventCount: number;
};

export const EventFilterBar = ({
  searchTerm,
  selectedType,
  selectedOrganizer,
  showPastEvents,
  onSearchChange,
  onTypeChange,
  onOrganizerChange,
  onPastEventsToggle,
  eventCount,
}: EventFilterBarProps) => {
  const eventTypes = Object.keys(EVENT_TYPE_CONFIG) as EventType[];
  const organizers = Object.keys(EVENT_ORGANIZER_CONFIG) as (keyof typeof EVENT_ORGANIZER_CONFIG)[];

  return (
    <GlassCard className="bg-card/80 dark:bg-card/60 mb-8 p-6">
      <div className="space-y-4">
        {/* Header with count */}
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Filter className="h-5 w-5" />
            Events filtern
          </h3>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              <AnimatedValue value={eventCount} format={n => `${String(n)} Events`} />
            </Badge>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--color-muted-foreground)]" />
              <span className="text-sm text-[var(--color-muted-foreground)]">
                {showPastEvents ? 'Vergangene' : 'Anstehende'}
              </span>
              <Switch checked={showPastEvents} onCheckedChange={onPastEventsToggle} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Events durchsuchen..."
            value={searchTerm}
            onChange={e => {
              onSearchChange(e.target.value);
            }}
            className="bg-background/80 dark:bg-background/80 border-border pl-10"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Event Type Filter */}
          <div className="space-y-2">
            <div className="text-foreground flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              <span>Event-Typ</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map(type => {
                const config = EVENT_TYPE_CONFIG[type];
                return (
                  <motion.div key={type} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant={selectedType === type ? 'default' : 'secondary'}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => {
                        onTypeChange(type === selectedType ? null : type);
                      }}
                    >
                      {config.label}
                      {selectedType === type && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Organizer Filter */}
          <div className="space-y-2">
            <div className="text-foreground flex items-center gap-2 text-sm font-medium">
              <span>Veranstalter</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {organizers.map(org => {
                const config = EVENT_ORGANIZER_CONFIG[org];
                return (
                  <motion.div key={org} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant={selectedOrganizer === org ? 'default' : 'outline'}
                      className="cursor-pointer transition-all hover:scale-105"
                      style={{
                        borderColor: selectedOrganizer === org ? config.color : undefined,
                        backgroundColor:
                          selectedOrganizer === org ? `${config.color}20` : undefined,
                      }}
                      onClick={() => {
                        onOrganizerChange(org === selectedOrganizer ? null : org);
                      }}
                    >
                      {config.name}
                      {selectedOrganizer === org && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
