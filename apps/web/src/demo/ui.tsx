// src/features/team/ui/TeamForm.tsx
import { memo, useState } from 'react';

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
import { PersonSelectButton } from './ui/PersonSelectButton';

import type { MemberFieldGroupProps, PersonInfo, TeamFormProps } from './model/types';

/**
 * Member Field Group Component - Renders fields for a single team member
 *
 * @internal
 */
const MemberFieldGroup = memo(({ control, index, onRemove, canRemove }: MemberFieldGroupProps) => {
  return (
    <div className={cn('rounded-lg border', 'bg-muted/20')}>
      <div className="flex items-center gap-4 p-4">
        {/* Tabellenartige Anordnung der Felder */}
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-end">
          <FormInput
            control={control}
            name={`members.${index}.name`}
            label="Name"
            placeholder="Member name"
            required
            className="lg:flex-1"
          />

          <FormInput
            control={control}
            name={`members.${index}.email`}
            label="Email"
            type="email"
            placeholder="member@example.com"
            required
            className="lg:flex-1"
          />

          <FormSelect
            control={control}
            name={`members.${index}.role`}
            label="Role"
            options={TEAM_MEMBER_ROLES}
            required
            className="lg:w-40"
          />

          <FormDatePicker
            control={control}
            name={`members.${index}.startDate`}
            label="Start Date"
            max={new Date()}
            className="lg:w-40"
          />

          <FormCheckbox
            control={control}
            name={`members.${index}.isActive`}
            label="Active"
            className="lg:w-24"
          />
        </div>

        {/* Remove Button mit Label */}
        {canRemove ? (
          <Button
            type="button"
            variant="outline"
            onClick={onRemove}
            className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
            aria-label="Remove member"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Entfernen
          </Button>
        ) : null}
      </div>
    </div>
  );
});

MemberFieldGroup.displayName = 'MemberFieldGroup';

/**
 * Team Form Component with person selection
 *
 * @example
 * ```tsx
 * // Creating new team
 * <TeamForm
 *   onSubmit={handleSubmit}
 * />
 *
 * // Editing existing team
 * <TeamForm
 *   defaultValues={teamData}
 *   defaultPersonInfo={personData}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
const Component = ({
  defaultValues,
  defaultPersonInfo,
  onSubmit,
  onCancel,
}: TeamFormProps & { defaultPersonInfo?: PersonInfo }) => {
  const { form, fields, handleAddMember, handleRemoveMember, canRemoveMember } = useController({
    defaultValues,
  });

  // State for person info (not part of form DTO)
  const [personInfo, setPersonInfo] = useState<PersonInfo | undefined>(defaultPersonInfo);
  const sortedFields = [...fields].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateB - dateA; // Neueste zuerst
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

          {/* Person Selection */}
          <PersonSelectButton
            control={form.control}
            name="verantwortlichId"
            label="Verantwortliche Person"
            description="Wählen Sie die verantwortliche Person für dieses Team"
            required
            personInfo={personInfo}
            onPersonChange={setPersonInfo}
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
            {sortedFields.map(field => {
              // Finde den original Index für die form control
              const originalIndex = fields.findIndex(f => f.id === field.id);

              return (
                <MemberFieldGroup
                  key={field.id}
                  control={form.control}
                  index={originalIndex}
                  onRemove={() => {
                    handleRemoveMember(originalIndex);
                  }}
                  canRemove={canRemoveMember}
                />
              );
            })}
          </div>
        </div>
      </div>

      <FormFooter showReset showCancel onCancel={onCancel} submitText="Save Team" />
    </Form>
  );
};

export const TeamForm = memo(Component);
