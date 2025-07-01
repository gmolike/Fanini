// frontend/src/features/public/event-detail/ui/Header.tsx
import {
  EVENT_CATEGORY_CONFIG,
  EVENT_ORGANIZER_CONFIG,
  type PublicEventDetail,
} from '@/entities/public/event';

import { Badge } from '@/shared/shadcn';
import { Image } from '@/shared/ui';

type HeaderProps = {
  event: PublicEventDetail;
};

/**
 * Header Component
 * @description Event-Header mit Banner und Basis-Informationen
 */
export const Header = ({ event }: HeaderProps) => {
  const organizerConfig = EVENT_ORGANIZER_CONFIG[event.organizer];
  const categoryConfig = EVENT_CATEGORY_CONFIG[event.category];

  return (
    <div>
      {/* Banner Image */}
      {event.bannerImage ? (
        <div className="-mx-6 -mt-6 aspect-video overflow-hidden rounded-lg">
          <Image src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
        </div>
      ) : null}

      {/* Header Info */}
      <div className={event.bannerImage ? 'mt-4' : ''}>
        <div className="mb-2 flex items-center gap-2">
          <Badge className={organizerConfig.badge}>{organizerConfig.name}</Badge>
          <Badge variant="outline">
            <span className={categoryConfig.color}>{categoryConfig.icon}</span>
            <span className="ml-1">{categoryConfig.label}</span>
          </Badge>
        </div>

        <h2 className="mb-2 text-2xl font-bold">{event.title}</h2>

        {event.tags ? (
          <div className="flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
