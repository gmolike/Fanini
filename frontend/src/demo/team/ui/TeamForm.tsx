// src/features/team/ui/TeamForm.tsx
import { memo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Trash2, Users } from 'lucide-react';

import {
  Form,
  FormInput,
  FormTextArea,
  FormSelect,
  FormDatePicker,
  FormCheckbox,
  FormHeader,
  FormFooter,
  FormActionButton,
  useForm,
} from '@/shared/ui/form';
import { Button } from '@/shared/shadcn';

import { TEAM_MEMBER_ROLES, DEFAULT_TEAM_MEMBER } from '@/entities/team/model/constants';
import type { TeamFormDto } from '@/entities/team/model/types';

/**
 * Team member sub-schema for validation
 */
const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['developer', 'designer', 'manager', 'tester']),
  startDate: z.string(),
  isActive: z.boolean(),
});

/**
 * Main team form schema
 */
const teamFormSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  description: z.string().optional(),
  members: z.array(teamMemberSchema).min(1, 'At least one member is required'),
});

type Props = {
  /**
   * Initial form values
   */
  defaultValues?: Partial<TeamFormDto>;

  /**
   * Submit handler
   */
  onSubmit: (data: TeamFormDto) => void;

  /**
   * Cancel handler
   */
  onCancel?: () => void;
};

/**
 * Team Form Component - Manages team with dynamic member list
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
const Component = ({ defaultValues, onSubmit, onCancel }: Props) => {
  const form = useForm({
    schema: teamFormSchema,
    defaultValues: {
      teamName: '',
      description: '',
      members: [DEFAULT_TEAM_MEMBER],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  });

  const handleAddMember = () => {
    append(DEFAULT_TEAM_MEMBER);
  };

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
                form={form}
                index={index}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
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
