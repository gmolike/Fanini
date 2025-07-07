// frontend/src/features/public/newsletter-list/ui/FilterBar.tsx
import { motion } from 'framer-motion';
import { Filter, Hash, Search, X } from 'lucide-react';

import { Badge, Input } from '@/shared/shadcn';
import { GlassCard } from '@/shared/ui';

type FilterBarProps = {
  searchTerm: string;
  selectedTag: string | null;
  availableTags: string[];
  onSearchChange: (value: string) => void;
  onTagChange: (tag: string | null) => void;
};

export const FilterBar = ({
  searchTerm,
  selectedTag,
  availableTags,
  onSearchChange,
  onTagChange,
}: FilterBarProps) => {
  return (
    <GlassCard className="bg-card/80 dark:bg-card/60 mb-8 p-6">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Newsletter durchsuchen..."
            value={searchTerm}
            onChange={e => {
              onSearchChange(e.target.value);
            }}
            className="bg-background/80 dark:bg-background/80 border-border pl-10"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="text-foreground flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            <span>Themen filtern</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Badge
                variant={selectedTag === null ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => {
                  onTagChange(null);
                }}
              >
                Alle Themen
              </Badge>
            </motion.div>
            {availableTags.map(tag => (
              <motion.div key={tag} whileTap={{ scale: 0.95 }}>
                <Badge
                  variant={selectedTag === tag ? 'default' : 'secondary'}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => {
                    onTagChange(tag === selectedTag ? null : tag);
                  }}
                >
                  <Hash className="mr-1 h-3 w-3" />
                  {tag}
                  {selectedTag === tag && <X className="ml-1 h-3 w-3" />}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
