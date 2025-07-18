// apps/web/src/features/intern/member/list/ui/ListToolbar.tsx
import { useEffect } from 'react';

import { Download, Filter, Search, UserPlus } from 'lucide-react';

import {
  getRoleLabel,
  type MemberListFilters,
  type MemberRole,
  ROLE_OPTIONS,
} from '@/entities/intern/member';

import { Badge, Button } from '@/shared/shadcn';
import { FormInput, FormSelect, useForm } from '@/shared/ui/form';

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
  const form = useForm({
    defaultValues: {
      search: filters.search ?? '',
      status: filters.active?.toString() ?? 'all',
      role: filters.roleId ?? ('all' as string),
    },
  });

  // Watch form values
  const searchValue = form.watch('search');
  const statusValue = form.watch('status');
  const roleValue = form.watch('role');

  // Handle search changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange('search', searchValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue, onFilterChange]);

  // Handle status changes
  useEffect(() => {
    onFilterChange('active', statusValue === 'all' ? undefined : statusValue === 'true');
  }, [statusValue, onFilterChange]);

  // Handle role changes
  useEffect(() => {
    onFilterChange('roleId', roleValue === 'all' ? undefined : (roleValue as MemberRole));
  }, [roleValue, onFilterChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="max-w-sm flex-1">
          <FormInput
            control={form.control}
            name="search"
            placeholder="Name oder E-Mail suchen..."
            startIcon={Search}
            showReset={false}
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
        <div className="w-32">
          <FormSelect
            control={form.control}
            name="status"
            options={[
              { value: 'all', label: 'Alle' },
              { value: 'true', label: 'Aktiv' },
              { value: 'false', label: 'Inaktiv' },
            ]}
            showReset={false}
          />
        </div>

        {/* Role Filter */}
        <div className="w-40">
          <FormSelect
            control={form.control}
            name="role"
            options={[{ value: 'all', label: 'Alle Rollen' }, ...ROLE_OPTIONS]}
            showReset={false}
          />
        </div>

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
