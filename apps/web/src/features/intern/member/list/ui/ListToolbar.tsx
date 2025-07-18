// apps/web/src/features/intern/member/list/ui/ListToolbar.tsx
import { useEffect, useState } from 'react';

import { Download, Filter, Search, UserPlus } from 'lucide-react';

import {
  getRoleLabel,
  type MemberListFilters,
  type MemberRole,
  ROLE_OPTIONS,
} from '@/entities/intern/member';

import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn';

type ListToolbarProps = {
  filters: MemberListFilters;
  onFilterChange: <K extends keyof MemberListFilters>(key: K, value: MemberListFilters[K]) => void;
  onReset: () => void;
  onCreateClick: () => void;
  onExportClick?: () => void;
  canExport: boolean;
  isFiltered: boolean;
};

export const ListToolbar = ({
  filters,
  onFilterChange,
  onReset,
  onCreateClick,
  onExportClick,
  canExport,
  isFiltered,
}: ListToolbarProps) => {
  const [searchValue, setSearchValue] = useState(filters.search ?? '');

  // Handle search changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange('search', searchValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue, onFilterChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
            }}
            placeholder="Name oder E-Mail suchen..."
            className="pl-10"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {canExport ? (
            <Button variant="outline" size="sm" onClick={onExportClick} disabled={!onExportClick}>
              <Download className="mr-2 h-4 w-4" />
              Exportieren
            </Button>
          ) : null}
          <Button onClick={onCreateClick} size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Lokales Mitglied anlegen
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        {/* Status Filter */}
        <Select
          value={filters.active === undefined ? 'all' : filters.active.toString()}
          onValueChange={value => {
            onFilterChange('active', value === 'all' ? undefined : value === 'true');
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="true">Aktiv</SelectItem>
            <SelectItem value="false">Inaktiv</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select
          value={filters.roleId ?? 'all'}
          onValueChange={value => {
            onFilterChange('roleId', value === 'all' ? undefined : (value as MemberRole));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Rollen</SelectItem>
            {ROLE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 lg:px-3">
            Filter zurücksetzen
          </Button>
        ) : null}

        {/* Active Filter Display */}
        {filters.roleId ? (
          <Badge variant="secondary" className="gap-1">
            Rolle: {getRoleLabel(filters.roleId)}
            <button
              onClick={() => {
                onFilterChange('roleId', undefined);
              }}
              className="hover:text-foreground ml-1"
            >
              ×
            </button>
          </Badge>
        ) : null}
      </div>
    </div>
  );
};
