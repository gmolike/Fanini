// features/public/creator-list/ui/CreatorCard.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

import { CREATOR_TYPE_CONFIG, type CreatorListItem } from '@/entities/public/creator';

import { Badge, Button } from '@/shared/shadcn';
import { AnimatedValue, FloatingCard, Image } from '@/shared/ui';

type CreatorCardProps = {
  creator: CreatorListItem;
  onSelect: (id: string) => void;
};

export const CreatorCard = ({ creator, onSelect }: CreatorCardProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <FloatingCard intensity={15}>
        <div className="group bg-card h-full overflow-hidden rounded-xl border transition-all hover:shadow-2xl">
          {/* Profile Image */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[var(--color-fanini-blue)]/20 to-[var(--color-fanini-red)]/20">
            {creator.profileImage ? (
              <Image
                src={creator.profileImage}
                alt={creator.artistName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-20 w-20 text-[var(--color-muted-foreground)]" />
              </div>
            )}

            {/* Type Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {creator.type.map(type => {
                const config = CREATOR_TYPE_CONFIG[type];
                return (
                  <Badge
                    key={type}
                    className="text-white backdrop-blur-sm"
                    style={{
                      background: `linear-gradient(to right, ${config.gradient})`,
                    }}
                  >
                    <span className="mr-1">{config.icon}</span>
                    {config.label}
                  </Badge>
                );
              })}
            </div>

            {/* Works Count */}
            <div className="absolute right-4 bottom-4">
              <Badge variant="secondary" className="backdrop-blur-sm">
                <ImageIcon className="mr-1 h-3 w-3" />
                <AnimatedValue value={creator.worksCount} /> Werke
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 p-6">
            <div>
              <h3 className="mb-2 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-xl font-bold text-transparent">
                {creator.artistName}
              </h3>
              <p className="line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
                {creator.shortDescription}
              </p>
            </div>

            {/* Action - Nur ein Button */}
            <Button
              onClick={() => {
                onSelect(creator.id);
              }}
              className="group/btn w-full"
              variant="outline"
            >
              Portfolio ansehen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </FloatingCard>
    </motion.div>
  );
};
