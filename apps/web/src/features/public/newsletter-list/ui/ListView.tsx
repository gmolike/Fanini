// frontend/src/features/public/newsletter-list/ui/ListView.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { useNewsletterList } from '@/entities/public/newsletter';

import { GlassCard, LoadingState } from '@/shared/ui';

import { FilterBar } from './FilterBar';
import { NewsletterCard } from './NewsletterCard';

export const ListView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const newslettersQuery = useNewsletterList();

  const handleSelect = (id: string) => {
    void navigate({ to: `/newsletter/$newsletterId`, params: { newsletterId: id } });
  };

  return (
    <LoadingState query={newslettersQuery}>
      {response => {
        const newsletters = response.data;
        const tags = [...new Set(newsletters.flatMap(n => n.tags))];

        const filtered = newsletters.filter(newsletter => {
          const matchesSearch =
            newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            newsletter.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesTag = !selectedTag || newsletter.tags.includes(selectedTag);
          return matchesSearch && matchesTag;
        });

        return (
          <>
            <FilterBar
              searchTerm={searchTerm}
              selectedTag={selectedTag}
              availableTags={tags}
              onSearchChange={setSearchTerm}
              onTagChange={setSelectedTag}
            />

            {filtered.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <p className="text-[var(--color-muted-foreground)]">Keine Newsletter gefunden.</p>
              </GlassCard>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map(newsletter => (
                  <NewsletterCard
                    key={newsletter.id}
                    newsletter={newsletter}
                    onSelect={handleSelect}
                  />
                ))}
              </motion.div>
            )}
          </>
        );
      }}
    </LoadingState>
  );
};
