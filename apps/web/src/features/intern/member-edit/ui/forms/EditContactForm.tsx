import { toast } from 'sonner';
import { z } from 'zod';

import { type MemberDetail, SICHTBARKEIT_CONFIG, useUpdateMember } from '@/entities/intern/member';

import { Form, FormFooter, FormInput, FormSelect } from '@/shared/ui/form';

const editContactSchema = z.object({
  telefon: z
    .string()
    .regex(/^[\d\s\-+()]*$/, 'Ungültiges Telefonformat')
    .optional(),
  adresse: z
    .object({
      strasse: z.string().min(3, 'Mindestens 3 Zeichen'),
      hausnummer: z.string().min(1, 'Hausnummer erforderlich'),
      plz: z.string().regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben'),
      stadt: z.string().min(2, 'Mindestens 2 Zeichen'),
    })
    .optional(),
  notfallkontakt: z
    .object({
      name: z.string().min(3, 'Mindestens 3 Zeichen'),
      telefon: z.string().regex(/^[\d\s\-+()]+$/, 'Ungültiges Telefonformat'),
    })
    .optional(),
  sichtbarkeit: z.object({
    email: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
    telefon: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
    profil: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
  }),
});

type EditContactFormData = z.infer<typeof editContactSchema>;

type EditContactFormProps = {
  member: MemberDetail;
  onSuccess: () => void;
  needsApproval: boolean;
};

/**
 * EditContactForm Component
 *
 * @description Formular zum Bearbeiten der Kontaktdaten
 */
export const EditContactForm = ({ member, onSuccess, needsApproval }: EditContactFormProps) => {
  const updateMutation = useUpdateMember();

  const handleSubmit = async (data: EditContactFormData) => {
    await updateMutation.mutateAsync({
      memberId: member.id,
      ...data,
    });

    if (needsApproval) {
      toast.info('Ihre Änderungen wurden zur Genehmigung eingereicht.');
    } else {
      toast.success('Kontaktdaten wurden aktualisiert.');
    }

    onSuccess();
  };

  const sichtbarkeitOptions = Object.entries(SICHTBARKEIT_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  return (
    <Form
      schema={editContactSchema}
      defaultValues={{
        telefon: member.telefon ?? '',
        adresse: member.adresse ?? {
          strasse: '',
          hausnummer: '',
          plz: '',
          stadt: '',
        },
        notfallkontakt: member.notfallkontakt ?? {
          name: '',
          telefon: '',
        },
        sichtbarkeit: member.sichtbarkeit ?? {
          email: 'mitglieder',
          telefon: 'mitglieder',
          profil: 'mitglieder',
        },
      }}
      onSubmit={handleSubmit}
    >
      {form => (
        <>
          {/* Telefon */}
          <FormInput
            control={form.control}
            name="telefon"
            label="Telefonnummer"
            type="tel"
            placeholder="+49 123 456789"
          />

          {/* Adresse */}
          <div className="space-y-4">
            <h4 className="font-medium">Adresse</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput control={form.control} name="adresse.strasse" label="Straße" />

              <FormInput control={form.control} name="adresse.hausnummer" label="Hausnummer" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInput control={form.control} name="adresse.plz" label="PLZ" pattern="\d{5}" />

              <FormInput control={form.control} name="adresse.stadt" label="Stadt" />
            </div>
          </div>

          {/* Notfallkontakt */}
          <div className="space-y-4">
            <h4 className="font-medium">Notfallkontakt</h4>
            <FormInput control={form.control} name="notfallkontakt.name" label="Name" />

            <FormInput
              control={form.control}
              name="notfallkontakt.telefon"
              label="Telefonnummer"
              type="tel"
            />
          </div>

          {/* Sichtbarkeit */}
          <div className="space-y-4">
            <h4 className="font-medium">Sichtbarkeitseinstellungen</h4>
            <div className="grid gap-4">
              <FormSelect
                control={form.control}
                name="sichtbarkeit.email"
                label="E-Mail Sichtbarkeit"
                options={sichtbarkeitOptions}
              />

              <FormSelect
                control={form.control}
                name="sichtbarkeit.telefon"
                label="Telefon Sichtbarkeit"
                options={sichtbarkeitOptions}
              />

              <FormSelect
                control={form.control}
                name="sichtbarkeit.profil"
                label="Profil Sichtbarkeit"
                options={sichtbarkeitOptions}
              />
            </div>
          </div>

          <FormFooter showReset submitText="Speichern" />
        </>
      )}
    </Form>
  );
};
