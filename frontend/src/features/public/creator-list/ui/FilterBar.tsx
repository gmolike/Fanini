// features/public/creator-list/ui/FilterBar.tsx
import { motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';

import { CREATOR_TYPE_CONFIG, type CreatorType } from '@/entities/public/creator';

import { Badge, Input } from '@/shared/shadcn';
import { GlassCard } from '@/shared/ui';

type FilterBarProps = {
  searchTerm: string;
  selectedTypes: string[];
  availableTypes: string[];
  onSearchChange: (value: string) => void;
  onTypesChange: (types: string[]) => void;
};

export const FilterBar = ({
  searchTerm,
  selectedTypes,
  availableTypes,
  onSearchChange,
  onTypesChange,
}: FilterBarProps) => {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <GlassCard className="bg-card/80 dark:bg-card/60 mb-8 p-6">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Künstler durchsuchen..."
            value={searchTerm}
            onChange={e => {
              onSearchChange(e.target.value);
            }}
            className="bg-background/80 dark:bg-background/80 border-border pl-10"
          />
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <div className="text-foreground flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            <span>Nach Kunstform filtern</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Badge
                variant={selectedTypes.length === 0 ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => {
                  onTypesChange([]);
                }}
              >
                Alle Künstler
              </Badge>
            </motion.div>
            {availableTypes.map(type => {
              const config = CREATOR_TYPE_CONFIG[type as CreatorType];
              const isSelected = selectedTypes.includes(type);
              return (
                <motion.div key={type} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant={isSelected ? 'default' : 'secondary'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => {
                      toggleType(type);
                    }}
                  >
                    <span className="mr-1">{config.icon}</span>
                    {config.label}
                    {isSelected ? <X className="ml-1 h-3 w-3" /> : null}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
