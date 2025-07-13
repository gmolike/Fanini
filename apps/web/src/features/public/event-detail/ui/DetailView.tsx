// features/public/event-detail/ui/DetailView.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Ticket } from 'lucide-react';

import { type PublicEventDetail } from '@/entities/public/event';

import { Badge, Button } from '@/shared/shadcn';
import { AnimatedValue, GlassCard } from '@/shared/ui';
import { ParallaxCard } from '@/shared/ui/parallax';

import { EventHero } from './Hero';
import { EventHistory } from './History';
import { EventInfo } from './Info';
import { RelatedEvents } from './RelatedEvents';

type DetailViewProps = {
  event: PublicEventDetail;
};

export const DetailView = ({ event }: DetailViewProps) => {
  const eventDate = new Date(`${event.date}T${event.time}`);
  const isPast = eventDate < new Date();

  return (
    <>
      {/* Hero Section */}
      <EventHero event={event} />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Übersicht
              </Link>
            </Button>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Description */}
              <ParallaxCard>
                <GlassCard className="p-8">
                  <AnimatedValue gradient className="mb-4 text-2xl font-bold">
                    Über das Event
                  </AnimatedValue>
                  <p className="text-lg leading-relaxed whitespace-pre-wrap text-[var(--color-muted-foreground)]">
                    {event.description}
                  </p>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </GlassCard>
              </ParallaxCard>

              {/* Event History/Timeline */}
              {event.history && event.history.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <EventHistory history={event.history} />
                </motion.div>
              ) : null}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <EventInfo event={event} />
              </motion.div>

              {/* Registration/Ticket */}
              {!isPast && (event.registrationRequired || event.ticketLink) ? (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">Teilnahme</h3>

                    {event.ticketLink ? (
                      <Button className="w-full" size="lg" asChild>
                        <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
                          <Ticket className="mr-2 h-5 w-5" />
                          Tickets kaufen
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      event.registrationRequired && (
                        <div className="space-y-3">
                          <p className="text-sm text-[var(--color-muted-foreground)]">
                            Anmeldung erforderlich
                          </p>
                          {event.registrationDeadline ? (
                            <p className="text-sm font-medium">
                              Anmeldeschluss:{' '}
                              {new Date(event.registrationDeadline).toLocaleDateString('de-DE')}
                            </p>
                          ) : null}
                          <Button className="w-full" disabled>
                            Als Gast nicht verfügbar
                          </Button>
                        </div>
                      )
                    )}
                  </GlassCard>
                </motion.div>
              ) : null}

              {/* Related Events */}
              {event.relatedEvents && event.relatedEvents.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <RelatedEvents events={event.relatedEvents} />
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
