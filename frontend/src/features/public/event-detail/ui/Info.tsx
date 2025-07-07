// features/public/event-detail/ui/Info.tsx
import { Calendar, Clock, Euro, MapPin, User, Users } from 'lucide-react';

import {
  EVENT_CATEGORY_CONFIG,
  EVENT_ORGANIZER_CONFIG,
  type PublicEventDetail,
} from '@/entities/public/event';

import { Badge } from '@/shared/shadcn';
import { AnimatedValue, DataField, DataGrid, GlassCard } from '@/shared/ui';

type EventInfoProps = {
  event: PublicEventDetail;
};

// Extrahierte Komponenten
const DateTimeField = ({ date, time }: { date: string; time: string }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4" />
      {new Date(date).toLocaleDateString('de-DE', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </div>
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4" />
      {time} Uhr
    </div>
  </div>
);

const LocationField = ({ location }: { location: string }) => (
  <div className="flex items-center gap-2">
    <MapPin className="h-4 w-4" />
    {location}
  </div>
);

const CategoryField = ({ category }: { category: keyof typeof EVENT_CATEGORY_CONFIG }) => {
  const config = EVENT_CATEGORY_CONFIG[category];
  return (
    <Badge variant="outline">
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

const OrganizerField = ({ organizer }: { organizer: keyof typeof EVENT_ORGANIZER_CONFIG }) => {
  const config = EVENT_ORGANIZER_CONFIG[organizer];
  return (
    <div
      className="rounded-md px-2 py-1 text-sm font-medium"
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
    >
      {config.name}
    </div>
  );
};

const ResponsiblePersonField = ({ person }: { person: PublicEventDetail['responsiblePerson'] }) => {
  if (!person) return null;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" />
        {person.name}
      </div>
      {person.role ? (
        <Badge variant="secondary" className="text-xs">
          {person.role}
        </Badge>
      ) : null}
    </div>
  );
};

const ParticipantsField = ({ current, max }: { current?: number; max: number }) => {
  const currentCount = current ?? 0;
  const percentage = (currentCount / max) * 100;

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <AnimatedValue value={currentCount} />
          {' / '}
          {max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full transition-all ${getProgressColor()}`}
          style={{ width: `${String(percentage)}%` }}
        />
      </div>
    </div>
  );
};

const PriceField = ({ price }: { price: PublicEventDetail['price'] }) => {
  if (!price) return null;

  return (
    <div className="flex items-center gap-2">
      <Euro className="h-4 w-4" />
      <AnimatedValue value={price.amount} format={n => `${n.toFixed(2)} €`} />
      {price.description ? (
        <span className="text-sm text-[var(--color-muted-foreground)]">({price.description})</span>
      ) : null}
    </div>
  );
};

export const EventInfo = ({ event }: EventInfoProps) => {
  return (
    <GlassCard className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Event-Details</h3>

      <DataGrid columns={1} bordered={false}>
        <DataField
          label="Datum & Zeit"
          value={<DateTimeField date={event.date} time={event.time} />}
        />

        <DataField label="Ort" value={<LocationField location={event.location} />} />

        <DataField label="Kategorie" value={<CategoryField category={event.category} />} />

        <DataField label="Veranstalter" value={<OrganizerField organizer={event.organizer} />} />

        {event.responsiblePerson ? (
          <DataField
            label="Ansprechpartner"
            value={<ResponsiblePersonField person={event.responsiblePerson} />}
          />
        ) : null}

        {event.maxParticipants ? (
          <DataField
            label="Teilnehmer"
            value={
              <ParticipantsField current={event.currentParticipants} max={event.maxParticipants} />
            }
          />
        ) : null}

        {event.price ? (
          <DataField label="Preis" value={<PriceField price={event.price} />} />
        ) : null}
      </DataGrid>
    </GlassCard>
  );
};
