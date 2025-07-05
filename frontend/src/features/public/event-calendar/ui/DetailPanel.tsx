// frontend/src/features/public/event-calendar/ui/DetailPanel.tsx
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, MapPin, Sparkles, User, X } from 'lucide-react';

import {
  EVENT_CATEGORY_CONFIG,
  EVENT_ORGANIZER_CONFIG,
  usePublicEventDetail,
} from '@/entities/public/event';

import { Badge, Button, Separator } from '@/shared/shadcn';
import { AnimatedValue, GlassCard, Image, LoadingState } from '@/shared/ui';

type EventDetailPanelProps = {
  eventId: string;
  onClose: () => void;
};

export const EventDetailPanel = ({ eventId, onClose }: EventDetailPanelProps) => {
  const eventQuery = usePublicEventDetail(eventId);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <GlassCard className="sticky top-4 overflow-hidden">
        <LoadingState query={eventQuery()}>
          {response => {
            const event = response.data;
            const organizerConfig = EVENT_ORGANIZER_CONFIG[event.organizer];
            const categoryConfig = EVENT_CATEGORY_CONFIG[event.category];

            return (
              <>
                {/* Header with gradient */}
                <div className="relative">
                  {event.bannerImage ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.bannerImage}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[var(--color-fanini-blue)]/20 to-[var(--color-fanini-red)]/20">
                      <div className="flex h-full items-center justify-center">
                        <Sparkles className="h-16 w-16 text-white/30" />
                      </div>
                    </div>
                  )}

                  {/* Close button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>

                  {/* Badges */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Badge className={`${organizerConfig.badge} backdrop-blur-sm`}>
                      {organizerConfig.name}
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-sm">
                      {categoryConfig.icon} {categoryConfig.label}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6 p-6">
                  {/* Title */}
                  <div>
                    <AnimatedValue className="mb-2 text-2xl font-bold">{event.title}</AnimatedValue>
                    {event.tags ? (
                      <div className="flex flex-wrap gap-1">
                        {event.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <Separator />

                  {/* Meta Info */}
                  <div className="space-y-3">
                    <InfoRow icon={Calendar}>
                      {new Date(event.date).toLocaleDateString('de-DE', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </InfoRow>
                    <InfoRow icon={Clock}>{event.time} Uhr</InfoRow>
                    <InfoRow icon={MapPin}>{event.location}</InfoRow>
                    {event.responsiblePerson ? (
                      <InfoRow icon={User}>
                        {event.responsiblePerson.name}
                        {event.responsiblePerson.role ? (
                          <span className="text-muted-foreground">
                            {' '}
                            • {event.responsiblePerson.role}
                          </span>
                        ) : null}
                      </InfoRow>
                    ) : null}
                  </div>

                  <Separator />

                  {/* Description */}
                  <div>
                    <h3 className="mb-2 font-semibold">Beschreibung</h3>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>

                  {/* Actions */}
                  {event.ticketLink || event.registrationRequired ? (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        {event.ticketLink ? (
                          <Button className="w-full" asChild>
                            <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Tickets kaufen
                            </a>
                          </Button>
                        ) : null}
                        {event.registrationRequired ? (
                          <Button variant="outline" className="w-full">
                            Zur Anmeldung
                          </Button>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            );
          }}
        </LoadingState>
      </GlassCard>
    </motion.div>
  );
};

// Helper Component
const InfoRow = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 text-sm">
    <Icon className="text-muted-foreground mt-0.5 h-4 w-4" />
    <span className="flex-1">{children}</span>
  </div>
);
