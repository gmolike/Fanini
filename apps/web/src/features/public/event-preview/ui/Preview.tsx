// frontend/src/features/public/event-preview/ui/Preview.tsx
import { Link } from '@tanstack/react-router';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';

import { EVENT_TYPE_CONFIG, usePublicEventList } from '@/entities/public/event';

import { Badge, Button, Card, CardContent } from '@/shared/shadcn';
import { LoadingState } from '@/shared/ui';

/**
 * Preview Feature Component
 * @description Zeigt die nächsten 3 Events
 */
export const Preview = () => {
  const eventsQuery = usePublicEventList();

  return (
    <LoadingState
      query={eventsQuery}
      loadingFallback={<EventsLoadingSkeleton />}
      errorFallback={<EventsError />}
      emptyFallback={<NoEventsMessage />}
    >
      {response => {
        // Nur die ersten 3 Events anzeigen
        const upcomingEvents = response.data.slice(0, 3);

        return (
          <>
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map(event => {
                const typeConfig = EVENT_TYPE_CONFIG[event.type];

                return (
                  <Card
                    key={event.id}
                    className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="h-1 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]" />

                    {/* Event Image */}
                    {event.thumbnailImage ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={event.thumbnailImage}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/80">
                        <Calendar className="h-16 w-16 text-white/50" />
                      </div>
                    )}

                    <CardContent className="p-6">
                      {/* Type Badge - mit Fallback */}
                      <Badge className={`mb-3 ${typeConfig.color} border-0`}>
                        {typeConfig.label}
                      </Badge>

                      <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-[var(--color-fanini-blue)]">
                        {event.title}
                      </h3>

                      <div className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString('de-DE')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time} Uhr</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      {/* Teilnehmer Info */}
                      {event.maxParticipants && event.maxParticipants > 0 ? (
                        <div className="mt-4 border-t pt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--color-muted-foreground)]">Teilnehmer</span>
                            <span className="font-medium">
                              {event.currentParticipants ?? 0} / {event.maxParticipants}
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full bg-[var(--color-fanini-blue)] transition-all duration-500"
                              style={{
                                width: `${(((event.currentParticipants ?? 0) / event.maxParticipants) * 100).toString()}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/events">
                  Alle Events anzeigen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        );
      }}
    </LoadingState>
  );
};

// Components bleiben gleich...
const EventsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map(i => (
      <Card key={i} className="overflow-hidden">
        <div className="h-48 animate-pulse bg-gray-200" />
        <CardContent className="p-6">
          <div className="mb-3 h-6 w-20 animate-pulse rounded bg-gray-200" />
          <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mb-4 h-4 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const EventsError = () => (
  <Card className="p-8">
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 h-12 w-12 text-[var(--color-destructive)]">!</div>
      <h3 className="mb-2 text-lg font-semibold">Events konnten nicht geladen werden</h3>
      <p className="text-[var(--color-muted-foreground)]">
        Bitte versuche es später erneut oder kontaktiere uns bei anhaltenden Problemen.
      </p>
    </div>
  </Card>
);

const NoEventsMessage = () => (
  <Card className="p-8">
    <div className="text-center">
      <Calendar className="mx-auto mb-4 h-12 w-12 text-[var(--color-muted-foreground)]" />
      <h3 className="mb-2 text-lg font-semibold">Keine kommenden Events</h3>
      <p className="text-[var(--color-muted-foreground)]">
        Aktuell sind keine Events geplant. Schau später nochmal vorbei!
      </p>
    </div>
  </Card>
);
