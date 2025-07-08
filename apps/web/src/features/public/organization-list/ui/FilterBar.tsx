// features/public/organization-list/ui/FilterBar.tsx
import { motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';

import { GREMIUM_CONFIG, type GremiumType } from '@/entities/public/organization';

import { Badge, Input } from '@/shared/shadcn';
import { GlassCard } from '@/shared/ui';

type FilterBarProps = {
  searchTerm: string;
  selectedType: string | null;
  availableTypes: string[];
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string | null) => void;
};

export const FilterBar = ({
  searchTerm,
  selectedType,
  availableTypes,
  onSearchChange,
  onTypeChange,
}: FilterBarProps) => {
  return (
    <GlassCard className="bg-card/80 dark:bg-card/60 mb-8 p-6">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Gremien durchsuchen..."
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
            <span>Nach Typ filtern</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Badge
                variant={selectedType === null ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => {
                  onTypeChange(null);
                }}
              >
                Alle Gremien
              </Badge>
            </motion.div>
            {availableTypes.map(type => {
              const config = GREMIUM_CONFIG[type as GremiumType];
              return (
                <motion.div key={type} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant={selectedType === type ? 'default' : 'secondary'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => {
                      onTypeChange(type === selectedType ? null : type);
                    }}
                  >
                    <span className="mr-1">{config.icon}</span>
                    {config.label || type}
                    {selectedType === type && <X className="ml-1 h-3 w-3" />}
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
