// frontend/src/features/public/newsletter-list/ui/Filters.tsx
import { Search } from 'lucide-react';

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn';

type FiltersProps = {
  searchTerm: string;
  selectedTag: string;
  availableTags: string[];
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
};

export const Filters = ({
  searchTerm,
  selectedTag,
  availableTags,
  onSearchChange,
  onTagChange,
}: FiltersProps) => {
  return (
    <div className="bg-card mb-6 rounded-lg p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Newsletter durchsuchen..."
            value={searchTerm}
            onChange={e => {
              onSearchChange(e.target.value);
            }}
            className="pl-9"
          />
        </div>

        <Select value={selectedTag} onValueChange={onTagChange}>
          <SelectTrigger>
            <SelectValue placeholder="Alle Themen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Themen</SelectItem>
            {availableTags.map(tag => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
