/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'sonner';
import { type z } from 'zod';

import {
  editContactSchema,
  type MemberDetail,
  SICHTBARKEIT_CONFIG,
  useUpdateMember,
} from '@/entities/intern/member';

import { Form, FormFooter, FormInput, FormSelect } from '@/shared/ui/form';

type EditContactFormData = z.infer<typeof editContactSchema>;

type ContactFormProps = {
  member: MemberDetail;
  onSuccess: () => void;
  needsApproval: boolean;
};

/**
 * ContactForm Component
 *
 * @description Formular zum Bearbeiten der Kontaktdaten eines Mitglieds
 */
export const ContactForm = ({ member, onSuccess, needsApproval }: ContactFormProps) => {
  const updateMutation = useUpdateMember();

  const handleSubmit = async (data: EditContactFormData) => {
    await updateMutation.mutateAsync({
      memberId: member.id,
      ...data,
    } as any);

    if (needsApproval) {
      toast.info('Ihre Änderungen wurden zur Genehmigung eingereicht.');
    } else {
      toast.success('Kontaktdaten wurden aktualisiert.');
    }

    onSuccess();
  };

  const sichtbarkeitOptions = Object.entries(SICHTBARKEIT_CONFIG).map(([value]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1), // or provide a mapping for user-friendly labels
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
