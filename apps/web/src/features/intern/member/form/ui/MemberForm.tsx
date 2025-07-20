/* eslint-disable complexity */
/* eslint-disable sonarjs/no-hardcoded-passwords */
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  type CreateLocalMemberRequest,
  type MemberDetail,
  type MemberFormData,
  memberFormSchema,
  useCreateLocalMember,
  type UserPermissions,
  useUpdateMember,
} from '@/entities/intern/member';

import { generateTemporaryPassword } from '@/shared/lib/password';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/shadcn';

import {
  BasicInfoSection,
  ContactSection,
  CreatorSection,
  LoginSection,
  MemberTypeSection,
} from '../sections';

export type MemberFormProps = {
  mode: 'create' | 'edit';
  initialData?: MemberDetail;
  userPermissions?: UserPermissions;
  onSuccess: () => void;
  onCancel: () => void;
};

/**
 * MemberForm Component
 *
 * @description Single-Page Formular für Create und Edit von Mitgliedern
 * @param {MemberFormProps} props - Component props
 * @returns {JSX.Element} Rendered form
 */
export const MemberForm = ({
  mode,
  initialData,
  userPermissions,
  onSuccess,
  onCancel,
}: MemberFormProps) => {
  const [generatedPassword, setGeneratedPassword] = useState<string>();

  const createMutation = useCreateLocalMember();
  const updateMutation = useUpdateMember();

  const needsApproval = userPermissions?.role === 'TEAM_VEREIN';

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues:
      mode === 'edit' && initialData
        ? {
            mode: 'edit',
            vorname: initialData.vorname,
            nachname: initialData.nachname,
            email: initialData.email,
            telefon: initialData.telefon ?? '',
            geburtsdatum: initialData.geburtsdatum ?? '',
            mitgliedsnummer: initialData.mitgliedsnummer ?? '',
            istAktiv: initialData.istAktiv ?? true,
            adresse: initialData.adresse ?? {
              strasse: '',
              hausnummer: '',
              plz: '',
              stadt: '',
            },
            sichtbarkeit: initialData.sichtbarkeit ?? {
              email: 'mitglieder',
              telefon: 'mitglieder',
              profil: 'mitglieder',
            },
            notfallkontakt: initialData.notfallkontakt,
            iban: initialData.iban,
          }
        : {
            mode: 'create',
            memberType: undefined as any, // Will be set by user
            passwordOption: 'generate',
            sendCredentials: false,
            vorname: '',
            nachname: '',
            email: '',
            telefon: '',
            kuenstlername: '',
            portfolio: '',
            password: '',
          },
  });

  const memberType = mode === 'create' ? form.watch('memberType') : undefined;
  const passwordOption = mode === 'create' ? form.watch('passwordOption') : undefined;

  const handleGeneratePassword = () => {
    const password = generateTemporaryPassword();
    setGeneratedPassword(password);
    form.setValue('password', password);
  };

  const handleSubmit = async (data: MemberFormData) => {
    try {
      if (data.mode === 'create') {
        // Transform für API
        const apiData: CreateLocalMemberRequest = {
          vorname: data.vorname,
          nachname: data.nachname,
          email: data.email,
          telefon: data.telefon,
          memberType: data.memberType,
          passwordOption: data.passwordOption,
          password: data.password,
          kuenstlername: data.memberType === 'creator' ? data.kuenstlername : undefined,
          portfolio: data.memberType === 'creator' ? data.portfolio : undefined,
          sendCredentials: data.sendCredentials,
        };

        const result = await createMutation.mutateAsync(apiData);

        if (result.success) {
          toast.success('Mitglied wurde erfolgreich angelegt');
          onSuccess();
        }
      } else if (data.mode === 'edit' && initialData) {
        await updateMutation.mutateAsync({
          memberId: initialData.id,
          vorname: data.vorname,
          nachname: data.nachname,
          email: data.email,
          telefon: data.telefon,
          mitgliedsnummer: data.mitgliedsnummer,
          istAktiv: data.istAktiv,
          geburtsdatum: data.geburtsdatum,
          adresse: data.adresse,
          notfallkontakt: data.notfallkontakt,
          iban: data.iban,
        });

        if (needsApproval) {
          toast.info('Ihre Änderungen wurden zur Genehmigung eingereicht.');
        } else {
          toast.success('Mitgliederdaten wurden aktualisiert.');
        }
        onSuccess();
      }
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten');
      console.error(error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>
              {mode === 'create'
                ? 'Neues Mitglied anlegen'
                : `${initialData?.vorname} ${initialData?.nachname} bearbeiten`}
            </CardTitle>
            <CardDescription>
              {mode === 'create'
                ? 'Fülle das Formular aus, um ein neues lokales Mitglied anzulegen'
                : 'Bearbeite die Mitgliedsdaten'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {needsApproval && mode === 'edit' ? (
              <Alert className="mb-6">
                <AlertDescription>
                  Ihre Änderungen werden zur Genehmigung an den Vorstand gesendet.
                </AlertDescription>
              </Alert>
            ) : null}

            {mode === 'create' && (
              <>
                <MemberTypeSection control={form.control} />
                <Separator />
              </>
            )}

            <BasicInfoSection control={form.control} mode={mode} />

            {mode === 'create' && memberType === 'creator' && (
              <>
                <Separator />
                <CreatorSection control={form.control} />
              </>
            )}

            <Separator />
            <ContactSection control={form.control} />

            {mode === 'create' && (
              <>
                <Separator />
                <LoginSection
                  control={form.control}
                  generatedPassword={generatedPassword}
                  onGeneratePassword={handleGeneratePassword}
                />
              </>
            )}

            <div className="flex justify-end gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending
                  ? 'Wird gespeichert...'
                  : mode === 'create'
                    ? 'Mitglied anlegen'
                    : 'Änderungen speichern'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};
