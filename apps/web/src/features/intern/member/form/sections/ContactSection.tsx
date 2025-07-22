import { type MemberFormData } from '@/entities/intern/member';

import { FormInput, FormSelect } from '@/shared/ui/form';

import type { Control } from 'react-hook-form';

type ContactSectionProps = {
  control: Control<MemberFormData>;
};

/**
 * ContactSection Component
 *
 * @description Kontaktdaten und Sichtbarkeitseinstellungen
 * @param {ContactSectionProps} props - Component props
 * @returns {JSX.Element} Rendered section
 */
export const ContactSection = ({ control }: ContactSectionProps) => {
  // Fix: SICHTBARKEIT_CONFIG ist bereits ein korrektes Config-Objekt
  const sichtbarkeitOptions = [
    { value: 'alle', label: 'Öffentlich' },
    { value: 'mitglieder', label: 'Nur Mitglieder' },
    { value: 'vorstand', label: 'Nur Vorstand' },
    { value: 'niemand', label: 'Privat' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Kontaktdaten</h3>

      <FormInput
        control={control}
        name="telefon"
        label="Telefonnummer"
        type="tel"
        placeholder="+49 123 456789"
        description="Optional - wird für wichtige Vereinskommunikation genutzt"
      />

      <div className="space-y-4">
        <h4 className="font-medium">Adresse</h4>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            control={control}
            name="adresse.strasse"
            label="Straße"
            placeholder="Musterstraße"
          />
          <FormInput
            control={control}
            name="adresse.hausnummer"
            label="Hausnummer"
            placeholder="123"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            control={control}
            name="adresse.plz"
            label="PLZ"
            placeholder="12345"
            pattern="\d{5}"
          />
          <FormInput control={control} name="adresse.stadt" label="Stadt" placeholder="Berlin" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Sichtbarkeitseinstellungen</h4>

        <FormSelect
          control={control}
          name="sichtbarkeit.email"
          label="E-Mail Sichtbarkeit"
          options={sichtbarkeitOptions}
          placeholder="Sichtbarkeit wählen..."
        />

        <FormSelect
          control={control}
          name="sichtbarkeit.telefon"
          label="Telefon Sichtbarkeit"
          options={sichtbarkeitOptions}
          placeholder="Sichtbarkeit wählen..."
        />

        <FormSelect
          control={control}
          name="sichtbarkeit.profil"
          label="Profil Sichtbarkeit"
          options={sichtbarkeitOptions}
          placeholder="Sichtbarkeit wählen..."
        />
      </div>
    </div>
  );
};
