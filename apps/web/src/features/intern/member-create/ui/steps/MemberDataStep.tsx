// apps/web/src/features/intern/member-create/ui/steps/MemberDataStep.tsx
import { Button } from '@/shared/shadcn';
import { FormInput, type UseFormReturn } from '@/shared/ui/form';

type MemberDataStepProps = {
  form: UseFormReturn<any>;
  memberType: 'creator' | 'sponsor' | 'partner';
  onNext: () => void;
  onBack: () => void;
};

/**
 * MemberDataStep Component
 *
 * @description Schritt 2: Eingabe der Mitgliedsdaten
 */
export const MemberDataStep = ({ form, memberType, onNext, onBack }: MemberDataStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Mitgliedsdaten</h3>
        <p className="text-muted-foreground mt-1 text-sm">Gib die Daten des neuen Mitglieds ein</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          control={form.control}
          name="vorname"
          label="Vorname"
          placeholder="Max"
          required
        />

        <FormInput
          control={form.control}
          name="nachname"
          label="Nachname"
          placeholder="Mustermann"
          required
        />
      </div>

      <FormInput
        control={form.control}
        name="email"
        label="E-Mail"
        type="email"
        placeholder="max@example.com"
        description="Diese E-Mail wird für den Login verwendet"
        required
      />

      <FormInput
        control={form.control}
        name="telefon"
        label="Telefon"
        type="tel"
        placeholder="+49 123 456789"
        description="Optional"
      />

      {memberType === 'creator' && (
        <>
          <FormInput
            control={form.control}
            name="kuenstlername"
            label="Künstlername"
            placeholder="Künstlername oder Pseudonym"
            description="Wird öffentlich angezeigt"
          />

          <FormInput
            control={form.control}
            name="portfolio"
            label="Portfolio URL"
            type="url"
            placeholder="https://portfolio.example.com"
            description="Link zu Portfolio, Instagram, etc."
          />
        </>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button type="button" onClick={onNext}>
          Weiter
        </Button>
      </div>
    </div>
  );
};
