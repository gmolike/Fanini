import { type Control, Controller } from 'react-hook-form';

import { Building2, Handshake, Palette, Users } from 'lucide-react';

import type { MemberFormData, MemberTypeOption } from '@/entities/intern/member';

import { Label, RadioGroup, RadioGroupItem } from '@/shared/shadcn';

type MemberTypeSectionProps = {
  control: Control<MemberFormData>;
};

const memberTypeOptions: MemberTypeOption[] = [
  {
    value: 'member',
    label: 'Mitglied',
    description: 'Reguläres Vereinsmitglied',
    icon: Users,
  },
  {
    value: 'creator',
    label: 'Creator',
    description: 'Künstler, Designer oder Content Creator',
    icon: Palette,
  },
  {
    value: 'sponsor',
    label: 'Sponsor',
    description: 'Unterstützer und Förderer des Vereins',
    icon: Building2,
  },
  {
    value: 'partner',
    label: 'Partner',
    description: 'Kooperationspartner und Organisationen',
    icon: Handshake,
  },
];

/**
 * MemberTypeSection Component
 *
 * @description Auswahl des Mitgliedstyps bei der Erstellung
 * @param {MemberTypeSectionProps} props - Component props
 * @returns {JSX.Element} Rendered section
 */
export const MemberTypeSection = ({ control }: MemberTypeSectionProps) => {
  return (
    <div className="space-y-3">
      <Label>Mitgliedstyp *</Label>
      <Controller
        name="memberType"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid gap-3 md:grid-cols-2"
            >
              {memberTypeOptions.map(type => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    htmlFor={type.value}
                    className={`hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-all ${
                      field.value === type.value ? 'border-primary bg-accent' : 'border-input'
                    }`}
                  >
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Icon className="text-muted-foreground h-5 w-5" />
                    <div className="flex-1">
                      <p className="font-medium">{type.label}</p>
                      <p className="text-muted-foreground text-sm">{type.description}</p>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
            {fieldState.error ? (
              <p className="text-destructive text-sm">{fieldState.error.message}</p>
            ) : null}
          </>
        )}
      />
    </div>
  );
};
