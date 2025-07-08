// features/public/organization-list/ui/ListView.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { useGremienList } from '@/entities/public/organization';

import { GlassCard, LoadingState } from '@/shared/ui';

import { FilterBar } from './FilterBar';
import { GremiumCard } from './GremiumCard';

export const ListView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const gremienQuery = useGremienList();

  const handleSelect = (id: string) => {
    void navigate({ to: `/about/$gremiumId`, params: { gremiumId: id } });
  };

  return (
    <LoadingState query={gremienQuery}>
      {response => {
        const gremien = response.data;
        const types = [...new Set(gremien.map(g => g.type))];

        const filtered = gremien.filter(gremium => {
          const matchesSearch =
            gremium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gremium.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesType = !selectedType || gremium.type === selectedType;
          return matchesSearch && matchesType;
        });

        return (
          <>
            <FilterBar
              searchTerm={searchTerm}
              selectedType={selectedType}
              availableTypes={types}
              onSearchChange={setSearchTerm}
              onTypeChange={setSelectedType}
            />

            {filtered.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <p className="text-[var(--color-muted-foreground)]">Keine Gremien gefunden.</p>
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
                {filtered.map(gremium => (
                  <GremiumCard key={gremium.id} gremium={gremium} onSelect={handleSelect} />
                ))}
              </motion.div>
            )}
          </>
        );
      }}
    </LoadingState>
  );
};
