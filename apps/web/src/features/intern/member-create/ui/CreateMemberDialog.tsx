// apps/web/src/features/intern/member-create/ui/CreateMemberDialog.tsx
import { useState } from 'react';

import { z } from 'zod';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/shadcn';
import { useForm } from '@/shared/ui/form';

import { useCreateLocalMember } from '../api/mutations';

import { MemberDataStep } from './steps/MemberDataStep';
import { MemberTypeSelection } from './steps/MemberTypeSelection';
import { PasswordSetupStep } from './steps/PasswordSetupStep';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createMemberSchema = z.object({
  memberType: z.enum(['creator', 'sponsor', 'partner']),
  vorname: z.string().min(2, 'Mindestens 2 Zeichen'),
  nachname: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  telefon: z.string().optional(),
  kuenstlername: z.string().optional(),
  portfolio: z.string().optional(),
  passwordOption: z.enum(['none', 'generate', 'manual']),
  password: z.string().optional(),
  sendCredentials: z.boolean(),
});

export type CreateMemberFormData = z.infer<typeof createMemberSchema>;

type CreateMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * CreateMemberDialog Component
 * @description Multi-Step Dialog zum Anlegen lokaler Mitglieder
 */
export const CreateMemberDialog = ({ open, onOpenChange }: CreateMemberDialogProps) => {
  const [step, setStep] = useState(1);
  const [generatedPassword, setGeneratedPassword] = useState<string>();

  const form = useForm<CreateMemberFormData>({
    defaultValues: {
      memberType: 'creator',
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
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

  const createMutation = useCreateLocalMember();

  const handleSubmit = async (data: CreateMemberFormData) => {
    try {
      // Validate password if manual option is selected
      if (data.passwordOption === 'manual' && !data.password) {
        form.setError('password', { message: 'Passwort ist erforderlich' });
        return;
      }

      const result = await createMutation.mutateAsync(data);

      if (result.success) {
        if (result.data?.temporaryPassword) {
          setGeneratedPassword(result.data.temporaryPassword);
          setStep(4); // Success Step
        } else {
          onOpenChange(false);
        }
      } else {
        console.error('Failed to create member:', result.error);
      }
    } catch (error) {
      console.error('Error creating member:', error);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof CreateMemberFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['memberType'];
        break;
      case 2:
        fieldsToValidate = ['vorname', 'nachname', 'email'];
        if (form.watch('memberType') === 'creator') {
          fieldsToValidate.push('kuenstlername');
        }
        break;
      case 3: {
        const option = form.watch('passwordOption');
        if (option === 'manual') {
          fieldsToValidate = ['password'];
        }
        break;
      }
    }

    const isValid = fieldsToValidate.length === 0 || (await form.trigger(fieldsToValidate));
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleClose = () => {
    form.reset();
    setStep(1);
    setGeneratedPassword(undefined);
    onOpenChange(false);
  };

  // Render der einzelnen Steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return <MemberTypeSelection form={form} onNext={handleNext} />;
      case 2:
        return (
          <MemberDataStep
            form={form}
            memberType={form.watch('memberType')}
            onNext={handleNext}
            onBack={() => {
              setStep(1);
            }}
          />
        );
      case 3:
        return (
          <PasswordSetupStep
            form={form}
            onSubmit={() => void form.handleSubmit(handleSubmit)()}
            onBack={() => {
              setStep(2);
            }}
            isSubmitting={createMutation.isPending}
          />
        );
      case 4:
        return generatedPassword ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                Mitglied erfolgreich angelegt!
              </h3>
              <div className="mt-2">
                <p className="text-sm text-green-700 dark:text-green-300">Temporäres Passwort:</p>
                <code className="mt-1 block rounded bg-white p-2 font-mono dark:bg-gray-900">
                  {generatedPassword}
                </code>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Schließen
            </Button>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Neues lokales Mitglied anlegen</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">{renderStep()}</div>
      </DialogContent>
    </Dialog>
  );
};
