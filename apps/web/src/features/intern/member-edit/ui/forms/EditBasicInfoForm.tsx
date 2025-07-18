import { toast } from 'sonner';
import { z } from 'zod';

import { type MemberDetail, useUpdateMember } from '@/entities/intern/member';

import { Form, FormCheckbox, FormDatePicker, FormFooter, FormInput } from '@/shared/ui/form';

const editBasicInfoSchema = z.object({
  vorname: z.string().min(2, 'Mindestens 2 Zeichen'),
  nachname: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  mitgliedsnummer: z.string().min(1, 'Mitgliedsnummer erforderlich'),
  geburtsdatum: z.string().optional(),
  istAktiv: z.boolean(),
});

type EditBasicInfoFormData = z.infer<typeof editBasicInfoSchema>;

type EditBasicInfoFormProps = {
  member: MemberDetail;
  onSuccess: () => void;
  needsApproval: boolean;
};

/**
 * EditBasicInfoForm Component
 *
 * @description Formular zum Bearbeiten der Basisdaten
 */
export const EditBasicInfoForm = ({ member, onSuccess, needsApproval }: EditBasicInfoFormProps) => {
  const updateMutation = useUpdateMember();

  const handleSubmit = async (data: EditBasicInfoFormData) => {
    await updateMutation.mutateAsync({
      memberId: member.id,
      ...data,
    });

    if (needsApproval) {
      toast.info('Ihre Änderungen wurden zur Genehmigung eingereicht.');
    } else {
      toast.success('Mitgliederdaten wurden aktualisiert.');
    }

    onSuccess();
  };

  return (
    <Form
      schema={editBasicInfoSchema}
      defaultValues={{
        vorname: member.vorname,
        nachname: member.nachname,
        email: member.email,
        mitgliedsnummer: member.mitgliedsnummer,
        geburtsdatum: member.geburtsdatum ?? '',
        istAktiv: member.istAktiv,
      }}
      onSubmit={handleSubmit}
    >
      {form => (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput control={form.control} name="vorname" label="Vorname" required />

            <FormInput control={form.control} name="nachname" label="Nachname" required />
          </div>

          <FormInput
            control={form.control}
            name="email"
            label="E-Mail-Adresse"
            type="email"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="mitgliedsnummer"
              label="Mitgliedsnummer"
              required
            />

            <FormDatePicker
              control={form.control}
              name="geburtsdatum"
              label="Geburtsdatum"
              max={new Date()}
            />
          </div>

          <FormCheckbox
            control={form.control}
            name="istAktiv"
            label="Aktives Mitglied"
            description="Deaktivierte Mitglieder können sich nicht anmelden"
          />

          <FormFooter showReset submitText="Speichern" />
        </>
      )}
    </Form>
  );
};
