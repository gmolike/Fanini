// src/features/team/ui/TeamForm.tsx
import { memo } from 'react';

import { Plus, Trash2, Users } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';
import {
  Form,
  FormCheckbox,
  FormDatePicker,
  FormFooter,
  FormHeader,
  FormInput,
  FormSelect,
  FormTextArea,
} from '@/shared/ui/form';

import { TEAM_MEMBER_ROLES, useController } from './model/useController';

import type { MemberFieldGroupProps, TeamFormProps } from './model/types';

/**
 * Member Field Group Component - Renders fields for a single team member
 *
 * @internal
 */
const MemberFieldGroup = memo(({ control, index, onRemove, canRemove }: MemberFieldGroupProps) => {
  return (
    <div className={cn('relative rounded-lg border p-4', 'bg-muted/20')}>
      {/* Remove Button */}
      {canRemove ? (
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
      ) : null}

      {/* Member Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          control={control}
          name={`members.${index}.name`}
          label="Name"
          placeholder="Member name"
          required
        />

        <FormInput
          control={control}
          name={`members.${index}.email`}
          label="Email"
          type="email"
          placeholder="member@example.com"
          required
        />

        <FormSelect
          control={control}
          name={`members.${index}.role`}
          label="Role"
          options={TEAM_MEMBER_ROLES}
          required
        />

        <FormDatePicker
          control={control}
          name={`members.${index}.startDate`}
          label="Start Date"
          max={new Date()}
        />

        <div className="md:col-span-2">
          <FormCheckbox
            control={control}
            name={`members.${index}.isActive`}
            label="Active Member"
            description="Uncheck if member is no longer active"
          />
        </div>
      </div>
    </div>
  );
});

MemberFieldGroup.displayName = 'MemberFieldGroup';

/**
 * Team Form Component - Manages team with dynamic member list
 *
 * Features:
 * - Dynamic member addition/removal
 * - Form validation with Zod
 * - Type-safe field management
 *
 * @example
 * ```tsx
 * <TeamForm
 *   defaultValues={{ teamName: 'Frontend Team' }}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 * ```
 */
const Component = ({ defaultValues, onSubmit, onCancel }: TeamFormProps) => {
  const { form, fields, handleAddMember, handleRemoveMember, canRemoveMember } = useController({
    defaultValues,
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormHeader
        title="Team Configuration"
        description="Create or edit your team details"
        icon={Users}
      />

      <div className="space-y-6">
        {/* Team Details Section */}
        <div className="space-y-4">
          <FormInput
            control={form.control}
            name="teamName"
            label="Team Name"
            placeholder="Enter team name"
            required
          />

          <FormTextArea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Describe your team's purpose"
            rows={3}
          />
        </div>

        {/* Team Members Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Team Members</h3>
            <Button type="button" size="sm" onClick={handleAddMember} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <MemberFieldGroup
                key={field.id}
                control={form.control}
                index={index}
                onRemove={() => {
                  handleRemoveMember(index);
                }}
                canRemove={canRemoveMember}
              />
            ))}
          </div>
        </div>
      </div>

      <FormFooter showReset showCancel onCancel={onCancel} submitText="Save Team" />
    </Form>
  );
};

export const TeamForm = memo(Component);
