import type { MemberFormData } from '@/entities/intern/member';

import { FormCheckbox, FormDatePicker, FormInput } from '@/shared/ui/form';

import type { Control } from 'react-hook-form';

type BasicInfoSectionProps = {
  control: Control<MemberFormData>;
  mode: 'create' | 'edit';
};

/**
 * BasicInfoSection Component
 *
 * @description Basis-Informationen eines Mitglieds (Name, Email, etc.)
 * @param {BasicInfoSectionProps} props - Component props
 * @returns {JSX.Element} Rendered section
 */
export const BasicInfoSection = ({ control, mode }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basisdaten</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput control={control} name="vorname" label="Vorname" placeholder="Max" required />

        <FormInput
          control={control}
          name="nachname"
          label="Nachname"
          placeholder="Mustermann"
          required
        />
      </div>

      <FormInput
        control={control}
        name="email"
        label="E-Mail"
        type="email"
        placeholder="max@example.com"
        description={mode === 'create' ? 'Diese E-Mail wird für den Login verwendet' : undefined}
        required
      />

      {mode === 'edit' && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput control={control} name="mitgliedsnummer" label="Mitgliedsnummer" required />

            <FormDatePicker
              control={control}
              name="geburtsdatum"
              label="Geburtsdatum"
              placeholder="Datum auswählen"
              max={new Date()}
            />
          </div>

          <FormCheckbox
            control={control}
            name="istAktiv"
            label="Aktives Mitglied"
            description="Deaktivierte Mitglieder können sich nicht anmelden"
          />
        </>
      )}
    </div>
  );
};
