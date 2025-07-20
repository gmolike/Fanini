import type { MemberFormData } from '@/entities/intern/member';

import { FormInput } from '@/shared/ui/form';

import type { Control } from 'react-hook-form';

type CreatorSectionProps = {
  control: Control<MemberFormData>;
};

/**
 * CreatorSection Component
 *
 * @description Creator-spezifische Felder
 * @param {CreatorSectionProps} props - Component props
 * @returns {JSX.Element} Rendered section
 */
export const CreatorSection = ({ control }: CreatorSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Creator-Informationen</h4>

      <FormInput
        control={control}
        name="kuenstlername"
        label="Künstlername"
        placeholder="Künstlername oder Pseudonym"
        description="Wird öffentlich angezeigt"
        required
      />

      <FormInput
        control={control}
        name="portfolio"
        label="Portfolio URL"
        type="url"
        placeholder="https://portfolio.example.com"
        description="Link zu Portfolio, Instagram, etc."
      />
    </div>
  );
};
