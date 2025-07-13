// features/public/organization-list/ui/GremiumCard.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users } from 'lucide-react';

import { GREMIUM_CONFIG, type GremiumListItem } from '@/entities/public/organization';

import { Badge, Button } from '@/shared/shadcn';
import { FloatingCard, Image } from '@/shared/ui';

type GremiumCardProps = {
  gremium: GremiumListItem;
  onSelect: (id: string) => void;
};

export const GremiumCard = ({ gremium, onSelect }: GremiumCardProps) => {
  const config = GREMIUM_CONFIG[gremium.type];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <FloatingCard>
        <div className="group bg-card h-full overflow-hidden rounded-xl border transition-all hover:shadow-2xl">
          {/* Header Image */}
          {gremium.headerImage ? (
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={gremium.headerImage}
                alt={gremium.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Type Badge */}
              <Badge
                className="absolute top-4 left-4 text-white"
                style={{
                  background: `linear-gradient(to right, ${config.gradient})`,
                }}
              >
                <span className="mr-1">{config.icon}</span>
                {config.label}
              </Badge>
            </div>
          ) : null}

          {/* Content */}
          <div className="space-y-4 p-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {gremium.memberCount} Mitglieder
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Seit {new Date(gremium.establishedDate).getFullYear()}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="mb-2 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-xl font-bold text-transparent">
                {gremium.name}
              </h3>
              <p className="text-[var(--color-muted-foreground)]">{gremium.shortDescription}</p>
            </div>

            {/* Action */}
            <Button
              onClick={() => {
                onSelect(gremium.id);
              }}
              className="group/btn w-full"
              variant="outline"
            >
              Details ansehen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </FloatingCard>
    </motion.div>
  );
};
