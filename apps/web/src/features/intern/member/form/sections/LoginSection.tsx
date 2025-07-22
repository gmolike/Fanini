import { useState } from 'react';
import { type Control, Controller, useWatch } from 'react-hook-form';

import { Eye, EyeOff, RefreshCw } from 'lucide-react';

import type { MemberFormData } from '@/entities/intern/member';

import { Button, Label, RadioGroup, RadioGroupItem } from '@/shared/shadcn';
import { FormCheckbox, FormInput } from '@/shared/ui/form';

type LoginSectionProps = {
  control: Control<MemberFormData>; // Verwende MemberFormData
  generatedPassword?: string;
  onGeneratePassword: () => void;
};

/**
 * LoginSection Component
 *
 * @description Login-Einstellungen für neue Mitglieder
 * @param {LoginSectionProps} props - Component props
 * @returns {JSX.Element} Rendered section
 */
export const LoginSection = ({
  control,
  generatedPassword,
  onGeneratePassword,
}: LoginSectionProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordOption = useWatch({
    control,
    name: 'passwordOption',
    defaultValue: 'generate',
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Login-Einstellungen</h3>

      <Controller
        name="passwordOption"
        control={control}
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
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
                  <p className="text-muted-foreground text-sm">Du gibst ein eigenes Passwort vor</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        )}
      />

      {passwordOption === 'generate' && (
        <div className="bg-muted/50 space-y-4 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGeneratePassword}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Passwort generieren
            </Button>
            {generatedPassword ? (
              <span className="text-muted-foreground text-sm">Passwort wurde generiert</span>
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
            control={control}
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
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {passwordOption !== 'none' && (
        <FormCheckbox
          control={control}
          name="sendCredentials"
          label="Zugangsdaten per E-Mail senden"
          description="Sendet die Login-Daten automatisch an die angegebene E-Mail-Adresse"
        />
      )}
    </div>
  );
};
