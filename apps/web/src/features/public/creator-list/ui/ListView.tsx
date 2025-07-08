// features/public/creator-list/ui/ListView.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { useCreatorsList } from '@/entities/public/creator';

import { GlassCard, LoadingState } from '@/shared/ui';

import { CreatorCard } from './CreatorCard';
import { FilterBar } from './FilterBar';

export const ListView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const creatorsQuery = useCreatorsList();

  const handleCreatorSelect = (id: string) => {
    void navigate({ to: `/kreativ/$creatorId`, params: { creatorId: id } });
  };

  return (
    <LoadingState query={creatorsQuery}>
      {response => {
        const creators = response.data;
        const availableTypes = response.meta?.types ?? [];

        const filtered = creators.filter(creator => {
          const matchesSearch =
            creator.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            creator.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesType =
            selectedTypes.length === 0 || creator.type.some(t => selectedTypes.includes(t));

          return matchesSearch && matchesType;
        });

        return (
          <>
            <FilterBar
              searchTerm={searchTerm}
              selectedTypes={selectedTypes}
              availableTypes={availableTypes}
              onSearchChange={setSearchTerm}
              onTypesChange={setSelectedTypes}
            />

            {filtered.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <p className="text-[var(--color-muted-foreground)]">Keine Künstler gefunden.</p>
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
                {filtered.map(creator => (
                  <CreatorCard key={creator.id} creator={creator} onSelect={handleCreatorSelect} />
                ))}
              </motion.div>
            )}
          </>
        );
      }}
    </LoadingState>
  );
};
