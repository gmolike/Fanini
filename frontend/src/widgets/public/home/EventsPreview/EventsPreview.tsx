import { Link } from '@tanstack/react-router';
import { AlertCircle, ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';

import { EVENT_TYPE_CONFIG, useUpcomingEvents } from '@/entities/public/event';

import { Badge, Button, Card, CardContent } from '@/shared/shadcn';
import { LoadingState } from '@/shared/ui';
import { Container } from '@/shared/ui/layout';

/**
 * EventsPreview Widget
 * @description Zeigt die nächsten 3 Events auf der Startseite (von API)
 */
export const EventsPreview = () => {
  const { data } = useUpcomingEvents();
  const eventsQuery = useUpcomingEvents();

  console.log('EventsPreview', data);

  return (
    <section className="py-20">
      <Container>
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-[Bebas_Neue] text-4xl text-[var(--color-fanini-blue)] sm:text-5xl">
            Nächste Events
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-muted-foreground)]">
            Verpasse keine Veranstaltung und sei bei allen wichtigen Terminen dabei
          </p>
        </div>

        {/* Events mit Loading State */}
        <LoadingState
          query={eventsQuery}
          loadingFallback={<EventsLoadingSkeleton />}
          errorFallback={<EventsError />}
          emptyFallback={<NoEventsMessage />}
        >
          {response => (
            <>
              {/* Events Grid */}
              <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {response.data.map(event => {
                  const config = EVENT_TYPE_CONFIG[event.type];

                  return (
                    <Card
                      key={event.id}
                      className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      {/* Event Type Header */}
                      <div className="h-1 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]" />

                      {/* Event Image or Placeholder */}
                      {event.image ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={event.image}
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
                        {/* Type Badge */}
                        <Badge className={`mb-3 ${config.color} border-0`}>{config.label}</Badge>

                        {/* Title */}
                        <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-[var(--color-fanini-blue)]">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="mb-4 text-[var(--color-muted-foreground)]">
                          {event.shortDescription ?? event.description}
                        </p>

                        {/* Meta Info */}
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

                        {/* Teilnehmer Info wenn vorhanden */}
                        {typeof event.maxParticipants === 'number' && event.maxParticipants > 0 && (
                          <div className="mt-4 border-t pt-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[var(--color-muted-foreground)]">
                                Teilnehmer
                              </span>
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
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/events">
                    Alle Events anzeigen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </LoadingState>
      </Container>
    </section>
  );
};

// Loading Skeleton
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

// Error Component
const EventsError = () => (
  <Card className="p-8">
    <div className="flex flex-col items-center text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-[var(--color-destructive)]" />
      <h3 className="mb-2 text-lg font-semibold">Events konnten nicht geladen werden</h3>
      <p className="text-[var(--color-muted-foreground)]">
        Bitte versuche es später erneut oder kontaktiere uns bei anhaltenden Problemen.
      </p>
    </div>
  </Card>
);

// No Events Message
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
