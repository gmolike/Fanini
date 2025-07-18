/* eslint-disable max-lines */
/* eslint-disable complexity */
// apps/web/src/features/intern/member/form/ui/MemberForm.tsx
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Eye, EyeOff, Handshake, Palette, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  type MemberDetail,
  SICHTBARKEIT_CONFIG,
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
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from '@/shared/shadcn';
import { FormCheckbox, FormDatePicker, FormInput, FormSelect } from '@/shared/ui/form';

import type { MemberFormData } from '../model/types';

// Schema
const memberFormSchema = z.object({
  memberType: z.enum(['member', 'creator', 'sponsor', 'partner']).optional(),
  passwordOption: z.enum(['none', 'generate', 'manual']),
  sendCredentials: z.boolean(),
  vorname: z.string().min(1, 'Vorname ist erforderlich'),
  nachname: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  telefon: z.string().optional(),
  kuenstlername: z.string().optional(),
  portfolio: z.string().optional(),
  password: z.string().optional(),
  geburtsdatum: z.string().optional(),
  mitgliedsnummer: z.string().optional(),
  istAktiv: z.boolean().optional(),
  adresse: z
    .object({
      strasse: z.string(),
      hausnummer: z.string(),
      plz: z.string(),
      stadt: z.string(),
    })
    .optional(),
  sichtbarkeit: z
    .object({
      email: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
      telefon: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
      profil: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
    })
    .optional(),
});

export type MemberFormProps = {
  mode: 'create' | 'edit';
  initialData?: MemberDetail;
  userPermissions?: UserPermissions;
  onSuccess: () => void;
  onCancel: () => void;
};

const memberTypeOptions = [
  {
    value: 'member' as const,
    label: 'Mitglied',
    description: 'Reguläres Vereinsmitglied',
    icon: Users,
  },
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
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>();

  const createMutation = useCreateLocalMember();
  const updateMutation = useUpdateMember();

  const needsApproval = userPermissions?.role === 'TEAM_VEREIN';

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues:
      mode === 'edit' && initialData
        ? {
            passwordOption: 'none',
            sendCredentials: false,
            vorname: initialData.vorname,
            nachname: initialData.nachname,
            email: initialData.email,
            telefon: initialData.telefon ?? '',
            geburtsdatum: initialData.geburtsdatum ?? '',
            mitgliedsnummer: initialData.mitgliedsnummer ?? '',
            istAktiv: initialData.istAktiv ?? true,
            kuenstlername: '',
            portfolio: '',
            password: '',
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
          }
        : {
            memberType: undefined,
            passwordOption: 'generate',
            sendCredentials: false,
            vorname: '',
            nachname: '',
            email: '',
            telefon: '',
            kuenstlername: '',
            portfolio: '',
            password: '',
            geburtsdatum: '',
            mitgliedsnummer: '',
            istAktiv: true,
            adresse: {
              strasse: '',
              hausnummer: '',
              plz: '',
              stadt: '',
            },
            sichtbarkeit: {
              email: 'mitglieder',
              telefon: 'mitglieder',
              profil: 'mitglieder',
            },
          },
  });

  const handleGeneratePassword = () => {
    const password = generateTemporaryPassword();
    setGeneratedPassword(password);
    form.setValue('password', password);
  };

  const memberType = form.watch('memberType');
  const passwordOption = form.watch('passwordOption');
  const handleSubmit = async (data: MemberFormData) => {
    try {
      if (mode === 'create') {
        if (!data.memberType) {
          form.setError('memberType', { message: 'Bitte wähle einen Mitgliedstyp' });
          return;
        }

        const apiData = {
          ...data,
          memberType: data.memberType === 'member' ? undefined : data.memberType,
        };

        const result = await createMutation.mutateAsync(apiData as any);

        if (typeof result === 'object' && 'success' in result && result.success) {
          toast.success('Mitglied wurde erfolgreich angelegt');
          onSuccess();
        }
      } else if (mode === 'edit' && initialData) {
        await updateMutation.mutateAsync({
          memberId: initialData.id,
          ...data,
        } as any);

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
            {needsApproval && mode === 'edit' && (
              <Alert className="mb-6">
                <AlertDescription>
                  Ihre Änderungen werden zur Genehmigung an den Vorstand gesendet.
                </AlertDescription>
              </Alert>
            )}

            {mode === 'create' && (
              <>
                <div className="space-y-3">
                  <Label>Mitgliedstyp *</Label>
                  <Controller
                    name="memberType"
                    control={form.control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value || ''}
                        onValueChange={field.onChange}
                        className="grid gap-3 md:grid-cols-2"
                      >
                        {memberTypeOptions.map(type => {
                          const Icon = type.icon;
                          return (
                            <label
                              key={type.value}
                              htmlFor={type.value}
                              className={`hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-all ${field.value === type.value ? 'border-primary bg-accent' : 'border-input'} `}
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
                    )}
                  />
                  {form.formState.errors.memberType && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.memberType.message}
                    </p>
                  )}
                </div>
                <Separator />
              </>
            )}

            {/* Basisdaten */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basisdaten</h3>

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
                description={
                  mode === 'create' ? 'Diese E-Mail wird für den Login verwendet' : undefined
                }
                required
              />

              {mode === 'edit' && (
                <>
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
                      placeholder="Datum auswählen"
                      max={new Date()}
                    />
                  </div>

                  <FormCheckbox
                    control={form.control}
                    name="istAktiv"
                    label="Aktives Mitglied"
                    description="Deaktivierte Mitglieder können sich nicht anmelden"
                  />
                </>
              )}

              {mode === 'create' && memberType === 'creator' && (
                <>
                  <Separator />
                  <h4 className="font-medium">Creator-Informationen</h4>

                  <FormInput
                    control={form.control}
                    name="kuenstlername"
                    label="Künstlername"
                    placeholder="Künstlername oder Pseudonym"
                    description="Wird öffentlich angezeigt"
                    required
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
            </div>

            <Separator />

            {/* Kontaktdaten */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kontaktdaten</h3>

              <FormInput
                control={form.control}
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
                    control={form.control}
                    name="adresse.strasse"
                    label="Straße"
                    placeholder="Musterstraße"
                  />
                  <FormInput
                    control={form.control}
                    name="adresse.hausnummer"
                    label="Hausnummer"
                    placeholder="123"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormInput
                    control={form.control}
                    name="adresse.plz"
                    label="PLZ"
                    placeholder="12345"
                    pattern="\d{5}"
                  />
                  <FormInput
                    control={form.control}
                    name="adresse.stadt"
                    label="Stadt"
                    placeholder="Berlin"
                  />
                </div>
              </div>
            </div>
            {/* Sichtbarkeit mit FormSelect */}
            <div className="space-y-4">
              <h4 className="font-medium">Sichtbarkeitseinstellungen</h4>

              <FormSelect
                control={form.control}
                name="sichtbarkeit.email"
                label="E-Mail Sichtbarkeit"
                options={Object.entries(SICHTBARKEIT_CONFIG).map(([value, config]) => ({
                  value,
                  label: config.label,
                }))}
                placeholder="Sichtbarkeit wählen..."
              />

              <FormSelect
                control={form.control}
                name="sichtbarkeit.telefon"
                label="Telefon Sichtbarkeit"
                options={Object.entries(SICHTBARKEIT_CONFIG).map(([value, config]) => ({
                  value,
                  label: config.label,
                }))}
                placeholder="Sichtbarkeit wählen..."
              />

              <FormSelect
                control={form.control}
                name="sichtbarkeit.profil"
                label="Profil Sichtbarkeit"
                options={Object.entries(SICHTBARKEIT_CONFIG).map(([value, config]) => ({
                  value,
                  label: config.label,
                }))}
                placeholder="Sichtbarkeit wählen..."
              />
            </div>

            {/* Login-Einstellungen - nur bei Create */}
            {mode === 'create' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Login-Einstellungen</h3>

                  <RadioGroup
                    value={passwordOption}
                    onValueChange={value => {
                      form.setValue('passwordOption', value as MemberFormData['passwordOption']);
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="none" id="none" className="mt-1" />
                      <Label htmlFor="none" className="cursor-pointer">
                        <div>
                          <p className="font-medium">Kein Login</p>
                          <p className="text-muted-foreground text-sm">
                            Mitglied wird nur zur Anzeige angelegt (z.B. für Sponsoren)
                          </p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="generate" id="generate" className="mt-1" />
                      <Label htmlFor="generate" className="cursor-pointer">
                        <div>
                          <p className="font-medium">Temporäres Passwort generieren</p>
                          <p className="text-muted-foreground text-sm">
                            System erstellt ein sicheres temporäres Passwort
                          </p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="manual" id="manual" className="mt-1" />
                      <Label htmlFor="manual" className="cursor-pointer">
                        <div>
                          <p className="font-medium">Passwort manuell setzen</p>
                          <p className="text-muted-foreground text-sm">
                            Du gibst ein eigenes Passwort vor
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {passwordOption === 'generate' && (
                    <div className="bg-muted/50 space-y-4 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleGeneratePassword}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Passwort generieren
                        </Button>
                        {generatedPassword ? (
                          <span className="text-muted-foreground text-sm">
                            Passwort wurde generiert
                          </span>
                        ) : null}
                      </div>

                      {generatedPassword ? (
                        <div className="bg-background rounded-lg border p-3">
                          <code className="font-mono text-sm">{generatedPassword}</code>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {passwordOption === 'manual' && (
                    <div className="relative">
                      <FormInput
                        control={form.control}
                        name="password"
                        label="Passwort"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mindestens 8 Zeichen"
                        description="Mindestens 8 Zeichen mit Groß-/Kleinbuchstaben und Zahlen"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-8 right-2"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}

                  {passwordOption !== 'none' && (
                    <FormCheckbox
                      control={form.control}
                      name="sendCredentials"
                      label="Zugangsdaten per E-Mail senden"
                      description="Sendet die Login-Daten automatisch an die angegebene E-Mail-Adresse"
                    />
                  )}
                </div>
              </>
            )}

            {/* Form Actions */}
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
