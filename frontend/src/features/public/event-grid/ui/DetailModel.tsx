// frontend/src/features/public/event-grid/ui/DetailModal.tsx
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, X } from 'lucide-react';

import { usePublicEventDetail } from '@/entities/public/event';

import { Badge, Button } from '@/shared/shadcn';
import { GlassCard, Image, LoadingState } from '@/shared/ui';

type EventDetailModalProps = {
  eventId: string;
  onClose: () => void;
};

export const EventDetailModal = ({ eventId, onClose }: EventDetailModalProps) => {
  const eventQuery = usePublicEventDetail(eventId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl"
        onClick={e => { e.stopPropagation(); }}
      >
        <GlassCard className="relative overflow-hidden">
          <LoadingState query={eventQuery()}>
            {response => {
              const event = response.data;

              return (
                <>
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Header Image */}
                  {event.bannerImage ? <div className="relative h-64 overflow-hidden">
                      <Image
                        src={event.bannerImage}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div> : null}

                  {/* Content */}
                  <div className="p-8 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-6">
                      {/* Title & Badges */}
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-[var(--color-fanini-blue)] text-white">
                            {event.organizerDetails?.name ?? event.organizer}
                          </Badge>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
                      </div>

                      {/* Meta Info */}
                      <div className="grid gap-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(event.date).toLocaleDateString('de-DE', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time} Uhr</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        {event.responsiblePerson ? <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{event.responsiblePerson.name}</span>
                          </div> : null}
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className="font-semibold mb-2">Beschreibung</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {event.description}
                        </p>
                      </div>

                      {/* Actions */}
                      {event.ticketLink ? <div className="pt-4 border-t">
                          <Button className="w-full" asChild>
                            <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
                              Tickets kaufen
                            </a>
                          </Button>
                        </div> : null}
                    </div>
                  </div>
                </>
              );
            }}
          </LoadingState>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
