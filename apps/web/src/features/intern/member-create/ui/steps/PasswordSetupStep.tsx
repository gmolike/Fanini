// apps/web/src/features/intern/member-create/ui/steps/PasswordSetupStep.tsx
import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  Button,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@/shared/shadcn';
import { FormCheckbox, FormInput } from '@/shared/ui/form';

import { PasswordGenerator } from '../components/PasswordGenerator';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';

import type { CreateMemberFormData } from '../../model/types';
import type { UseFormReturn } from 'react-hook-form';

type PasswordSetupStepProps = {
  form: UseFormReturn<CreateMemberFormData>;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
};

/**
 * PasswordSetupStep Component
 * @description Schritt 3: Passwort-Einstellungen
 */
export const PasswordSetupStep = ({
  form,
  onSubmit,
  onBack,
  isSubmitting,
}: PasswordSetupStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordOption = form.watch('passwordOption');
  const password = form.watch('password');

  const handleIconClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Login-Einstellungen</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Lege fest, ob und wie sich das Mitglied einloggen kann
        </p>
      </div>

      <RadioGroup
        value={passwordOption}
        onValueChange={value => {
          form.setValue('passwordOption', value as CreateMemberFormData['passwordOption']);
        }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="none" id="none" />
          <Label htmlFor="none" className="cursor-pointer">
            <div>
              <p className="font-medium">Kein Login</p>
              <p className="text-muted-foreground text-sm">
                Mitglied wird nur zur Anzeige angelegt
              </p>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <RadioGroupItem value="generate" id="generate" />
          <Label htmlFor="generate" className="cursor-pointer">
            <div>
              <p className="font-medium">Temporäres Passwort generieren</p>
              <p className="text-muted-foreground text-sm">
                System erstellt ein sicheres temporäres Passwort
              </p>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <RadioGroupItem value="manual" id="manual" />
          <Label htmlFor="manual" className="cursor-pointer">
            <div>
              <p className="font-medium">Passwort manuell setzen</p>
              <p className="text-muted-foreground text-sm">Du gibst ein Passwort vor</p>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {passwordOption === 'generate' && <PasswordGenerator form={form} />}

      {passwordOption === 'manual' && (
        <div className="space-y-4">
          <div className="relative">
            <FormInput
              control={form.control}
              name="password"
              label="Passwort"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mindestens 8 Zeichen"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-8 right-2"
              onClick={handleIconClick}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {typeof password === 'string' && password.length > 0 && (
            <PasswordStrengthIndicator password={password} />
          )}

          <Alert>
            <AlertDescription>
              Passwort muss mindestens 8 Zeichen lang sein und Groß-/Kleinbuchstaben sowie Zahlen
              enthalten.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {passwordOption !== 'none' && (
        <FormCheckbox
          control={form.control}
          name="sendCredentials"
          label="Zugangsdaten per E-Mail senden"
          description="Sendet die Login-Daten an die angegebene E-Mail-Adresse"
        />
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Zurück
        </Button>
        <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Wird angelegt...' : 'Mitglied anlegen'}
        </Button>
      </div>
    </div>
  );
};
