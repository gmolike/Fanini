// frontend/src/features/public/newsletter-list/ui/ListView.tsx
import { useMemo, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { useNewsletterList } from '@/entities/public/newsletter';

import { LoadingState } from '@/shared/ui';

import { Filters } from './Filters';
import { List } from './List';

export const ListView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const newslettersQuery = useNewsletterList();

  const { filteredNewsletters, availableTags } = useMemo(() => {
    if (!newslettersQuery.data?.data) return { filteredNewsletters: [], availableTags: [] };

    const newsletters = newslettersQuery.data.data;

    // Alle Tags sammeln
    const tagsSet = new Set<string>();
    newsletters.forEach(nl => {
      nl.tags.forEach(tag => tagsSet.add(tag));
    });
    const tags = Array.from(tagsSet).sort((a, b) => a.localeCompare(b));

    // Filtern
    const filtered = newsletters.filter(newsletter => {
      const matchesSearch =
        newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsletter.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === 'all' || newsletter.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });

    return { filteredNewsletters: filtered, availableTags: tags };
  }, [newslettersQuery.data, searchTerm, selectedTag]);

  const handleSelect = (id: string) => {
    void navigate({ to: '/newsletter/$newsletterId', params: { newsletterId: id } });
  };

  return (
    <LoadingState query={newslettersQuery}>
      {() => (
        <>
          <Filters
            searchTerm={searchTerm}
            selectedTag={selectedTag}
            availableTags={availableTags}
            onSearchChange={setSearchTerm}
            onTagChange={setSelectedTag}
          />

          {filteredNewsletters.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              Keine Newsletter gefunden.
            </div>
          ) : (
            <List newsletters={filteredNewsletters} onSelect={handleSelect} />
          )}
        </>
      )}
    </LoadingState>
  );
};
