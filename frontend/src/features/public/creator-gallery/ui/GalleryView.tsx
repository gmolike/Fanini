// features/public/creator-gallery/ui/GalleryView.tsx
import { useState } from 'react';

import { useSearch } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Filter, Heart, ImageIcon, X } from 'lucide-react';

import { type CreatorWork, useGalleryWorks } from '@/entities/public/creator';

import { Badge, Button } from '@/shared/shadcn';
import { AnimatedValue, GlassCard, Image as SharedImage, LoadingState } from '@/shared/ui';

export const GalleryView = () => {
  // TanStack Router way to get search params
  const search = useSearch({ strict: false });
  const creatorFilter = (search as { creator?: string }).creator;

  const [selectedWork, setSelectedWork] = useState<CreatorWork | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const galleryQuery = useGalleryWorks();

  console.log(
    '[Gallery] Query status:',
    galleryQuery.data,
    galleryQuery.isLoading,
    galleryQuery.isError
  );

  return (
    <LoadingState query={galleryQuery}>
      {response => {
        const works = response.data;

        // Filter works by type and creator
        const filteredWorks = works.filter(work => {
          const matchesType = filterType === 'all' || work.type === filterType;
          const matchesCreator = !creatorFilter || work.creatorId === creatorFilter;
          return matchesType && matchesCreator;
        });

        return (
          <>
            {/* Filter Bar */}
            <GlassCard className="mb-8 p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">Filter:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={filterType === 'all' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterType('all');
                    }}
                  >
                    Alle Werke
                  </Badge>
                  <Badge
                    variant={filterType === 'image' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterType('image');
                    }}
                  >
                    <ImageIcon className="mr-1 h-3 w-3" />
                    Bilder
                  </Badge>
                  <Badge
                    variant={filterType === 'video' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => {
                      setFilterType('video');
                    }}
                  >
                    🎬 Videos
                  </Badge>
                </div>
              </div>
            </GlassCard>

            {/* Gallery Grid */}
            {filteredWorks.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {filteredWorks.map(work => (
                  <GalleryItem
                    key={work.id}
                    work={work}
                    onClick={() => {
                      setSelectedWork(work);
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <GlassCard className="p-12 text-center">
                <p className="text-[var(--color-muted-foreground)]">
                  Keine Werke in dieser Kategorie gefunden.
                </p>
              </GlassCard>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
              {selectedWork ? (
                <LightboxModal
                  work={selectedWork}
                  onClose={() => {
                    setSelectedWork(null);
                  }}
                />
              ) : null}
            </AnimatePresence>
          </>
        );
      }}
    </LoadingState>
  );
};

// Gallery Item Component (bleibt gleich)
type GalleryItemProps = {
  work: CreatorWork;
  onClick: () => void;
};

const GalleryItem = ({ work, onClick }: GalleryItemProps) => {
  // Extract content rendering logic to avoid nested ternaries
  let content: React.ReactNode;
  if (work.type === 'image') {
    content = (
      <SharedImage
        src={work.thumbnailUrl ?? work.fileUrl}
        alt={work.title}
        className="h-full w-full object-cover"
      />
    );
  } else if (work.type === 'video') {
    content = (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-fanini-blue)]/20 to-[var(--color-fanini-red)]/20">
        <span className="text-4xl">🎬</span>
      </div>
    );
  } else {
    content = (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
        <span className="text-4xl">📄</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1 },
      }}
      whileHover={{ scale: 1.05 }}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-[var(--color-muted)]"
      onClick={onClick}
    >
      {content}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute right-0 bottom-0 left-0 p-4">
          <h4 className="mb-1 font-semibold text-white">{work.title}</h4>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <AnimatedValue value={work.stats.views} />
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <AnimatedValue value={work.stats.likes} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Lightbox Modal Component (bleibt gleich)
type LightboxModalProps = {
  work: CreatorWork;
  onClose: () => void;
};

const LightboxModal = ({ work, onClose }: LightboxModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {(() => {
          if (work.type === 'image') {
            return (
              <SharedImage
                src={work.fileUrl}
                alt={work.title}
                className="max-h-[80vh] rounded-lg object-contain"
              />
            );
          } else if (work.type === 'video') {
            return (
              <video src={work.fileUrl} controls className="max-h-[80vh] rounded-lg">
                <track kind="captions" />
                Sorry, your browser does not support embedded videos.
              </video>
            );
          } else {
            return (
              <div className="flex h-96 w-96 items-center justify-center rounded-lg bg-white">
                <p className="text-gray-500">Vorschau nicht verfügbar</p>
              </div>
            );
          }
        })()}

        {/* Info Bar */}
        <div className="mt-4 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <h3 className="mb-2 text-xl font-bold text-white">{work.title}</h3>
          {work.description ? <p className="mb-3 text-white/80">{work.description}</p> : null}
          <div className="flex items-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <AnimatedValue value={work.stats.views} /> Aufrufe
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <AnimatedValue value={work.stats.likes} /> Likes
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
