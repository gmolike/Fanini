// frontend/src/features/public/document-list/ui/CategoryFilter.tsx
import { motion } from 'framer-motion';
import { FileText, Filter } from 'lucide-react';

import { DOCUMENT_CATEGORY_CONFIG, type DocumentCategory } from '@/entities/public/document';

import { Input } from '@/shared/shadcn';
import { GlassCard } from '@/shared/ui';

type CategoryFilterProps = {
  searchTerm: string;
  selectedCategory: DocumentCategory | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: DocumentCategory | null) => void;
};

export const CategoryFilter = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <GlassCard className="bg-card/80 dark:bg-card/60 mb-8 p-6">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <FileText className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Dokumente durchsuchen..."
            value={searchTerm}
            onChange={e => {
              onSearchChange(e.target.value);
            }}
            className="bg-background/80 dark:bg-background/80 border-border pl-10"
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <div className="text-foreground flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            <span>Kategorien</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(DOCUMENT_CATEGORY_CONFIG).map(([key, config]) => {
              const isActive = selectedCategory === key;
              return (
                <motion.div
                  key={key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onCategoryChange(isActive ? null : (key as DocumentCategory));
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={`rounded-lg border p-4 transition-all hover:shadow-md ${
                      isActive
                        ? 'border-[var(--color-fanini-blue)] bg-[var(--color-fanini-blue)]/10'
                        : 'border-border hover:border-[var(--color-fanini-blue)]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <p className="font-medium">{config.label}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
