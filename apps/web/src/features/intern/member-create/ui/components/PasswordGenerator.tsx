// apps/web/src/features/intern/member-create/ui/components/PasswordGenerator.tsx
import { useState } from 'react';

import { Check, Copy, RefreshCw } from 'lucide-react';

import { generateTemporaryPassword } from '@/shared/lib/password';
import { Alert, AlertDescription, Button } from '@/shared/shadcn';

import type { CreateMemberFormData } from '../../model/types';
import type { UseFormReturn } from 'react-hook-form';

type PasswordGeneratorProps = {
  form: UseFormReturn<CreateMemberFormData>;
};

/**
 * PasswordGenerator Component
 * @description Zeigt generierte temporäre Passwörter an
 */
export const PasswordGenerator = ({ form }: PasswordGeneratorProps) => {
  const [generatedPassword, setGeneratedPassword] = useState<string>();
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const password = generateTemporaryPassword();
    setGeneratedPassword(password);
    form.setValue('password', password);
  };

  const handleCopy = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Das temporäre Passwort wird automatisch generiert und muss beim ersten Login geändert
          werden.
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleGenerate}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Passwort generieren
        </Button>
      </div>

      {generatedPassword ? (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <code className="font-mono text-lg">{generatedPassword}</code>
            <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
