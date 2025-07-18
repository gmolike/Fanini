// apps/web/src/features/intern/member-create/ui/steps/MemberTypeSelection.tsx
import { Building2, Handshake, Palette } from 'lucide-react';

import { Button, Label, RadioGroup, RadioGroupItem } from '@/shared/shadcn';
import type { UseFormReturn } from '@/shared/ui/form';

type MemberTypeSelectionProps = {
  form: UseFormReturn<any>;
  onNext: () => void;
};

const memberTypes = [
  {
    value: 'creator' as const,
    label: 'Creator',
    description: 'Künstler, Designer oder Content Creator',
    icon: Palette,
  },
  {
    value: 'sponsor' as const,
    label: 'Sponsor',
    description: 'Unterstützer und Förderer des Vereins',
    icon: Building2,
  },
  {
    value: 'partner' as const,
    label: 'Partner',
    description: 'Kooperationspartner und Organisationen',
    icon: Handshake,
  },
];

/**
 * MemberTypeSelection Component
 *
 * @description Schritt 1: Auswahl des Mitgliedstyps
 */
export const MemberTypeSelection = ({ form, onNext }: MemberTypeSelectionProps) => {
  const memberType = form.watch('memberType');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Mitgliedstyp auswählen</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Wähle den Typ des neuen lokalen Mitglieds
        </p>
      </div>

      <RadioGroup
        value={memberType}
        onValueChange={value => {
          form.setValue('memberType', value);
        }}
        className="grid gap-4"
      >
        {memberTypes.map(type => {
          const Icon = type.icon;
          return (
            <div key={type.value}>
              <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
              <Label
                htmlFor={type.value}
                className="hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex cursor-pointer items-center space-x-4 rounded-lg border p-4"
              >
                <Icon className="text-muted-foreground h-6 w-6" />
                <div className="flex-1">
                  <p className="font-medium">{type.label}</p>
                  <p className="text-muted-foreground text-sm">{type.description}</p>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      <div className="flex justify-end">
        <Button type="button" onClick={onNext} disabled={!memberType}>
          Weiter
        </Button>
      </div>
    </div>
  );
};
