// src/features/team/ui/MemberFieldGroup.tsx
import { memo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Trash2 } from 'lucide-react';

import { FormInput, FormSelect, FormDatePicker, FormCheckbox } from '@/shared/ui/form';
import { Button } from '@/shared/shadcn';
import { cn } from '@/shared/lib';

import { TEAM_MEMBER_ROLES } from '@/entities/team/model/constants';
import type { TeamFormDto } from '@/entities/team/model/types';

type Props = {
  /**
   * Form instance from parent
   */
  form: UseFormReturn<TeamFormDto>;

  /**
   * Member index in array
   */
  index: number;

  /**
   * Remove handler
   */
  onRemove: () => void;

  /**
   * Whether removal is allowed
   */
  canRemove: boolean;
};

/**
 * Member Field Group - Renders fields for a single team member
 *
 * @internal
 */
const Component = ({ form, index, onRemove, canRemove }: Props) => {
  return (
    <div className={cn('relative rounded-lg border p-4', 'bg-muted/20')}>
      {/* Remove Button */}
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="absolute top-2 right-2 h-8 w-8"
          aria-label="Remove member"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {/* Member Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          control={form.control}
          name={`members.${index}.name`}
          label="Name"
          placeholder="Member name"
          required
        />

        <FormInput
          control={form.control}
          name={`members.${index}.email`}
          label="Email"
          type="email"
          placeholder="member@example.com"
          required
        />

        <FormSelect
          control={form.control}
          name={`members.${index}.role`}
          label="Role"
          options={TEAM_MEMBER_ROLES}
          required
        />

        <FormDatePicker
          control={form.control}
          name={`members.${index}.startDate`}
          label="Start Date"
          max={new Date()}
        />

        <div className="md:col-span-2">
          <FormCheckbox
            control={form.control}
            name={`members.${index}.isActive`}
            label="Active Member"
            description="Uncheck if member is no longer active"
          />
        </div>
      </div>
    </div>
  );
};

export const MemberFieldGroup = memo(Component);
