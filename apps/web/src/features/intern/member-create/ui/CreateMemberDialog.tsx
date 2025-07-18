// apps/web/src/features/intern/member-create/ui/CreateMemberDialog.tsx
import { useState } from 'react';

import { z } from 'zod';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/shadcn';
import { Form, useForm } from '@/shared/ui/form';

import { useCreateLocalMember } from '../api/mutations';

import { MemberDataStep } from './steps/MemberDataStep';
import { MemberTypeSelection } from './steps/MemberTypeSelection';
import { PasswordSetupStep } from './steps/PasswordSetupStep';

const createMemberSchema = z.object({
  memberType: z.enum(['creator', 'sponsor', 'partner']),
  vorname: z.string().min(2, 'Mindestens 2 Zeichen'),
  nachname: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  telefon: z.string().optional(),
  kuenstlername: z.string().optional(),
  portfolio: z.string().url('Ungültige URL').optional().or(z.literal('')),
  passwordOption: z.enum(['none', 'generate', 'manual']),
  password: z.string().min(8, 'Mindestens 8 Zeichen').optional(),
  sendCredentials: z.boolean().default(false),
});

type CreateMemberFormData = z.infer<typeof createMemberSchema>;

type CreateMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * CreateMemberDialog Component
 *
 * @description Multi-Step Dialog zum Anlegen lokaler Mitglieder
 */
export const CreateMemberDialog = ({ open, onOpenChange }: CreateMemberDialogProps) => {
  const [step, setStep] = useState(1);
  const [generatedPassword, setGeneratedPassword] = useState<string>();

  const form = useForm<CreateMemberFormData>({
    schema: createMemberSchema,
    defaultValues: {
      memberType: 'creator',
      passwordOption: 'generate',
      sendCredentials: false,
      vorname: '',
      nachname: '',
      email: '',
      telefon: '',
      kuenstlername: '',
      portfolio: '',
    },
  });

  const createMutation = useCreateLocalMember();

  const handleSubmit = async (data: CreateMemberFormData) => {
    const result = await createMutation.mutateAsync(data);

    if (result.data?.temporaryPassword) {
      setGeneratedPassword(result.data.temporaryPassword);
      setStep(4); // Success Step
    } else {
      onOpenChange(false);
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
          fieldsToValidate.push('kuenstlername', 'portfolio');
        }
        break;
      case 3:
        const option = form.watch('passwordOption');
        if (option === 'manual') {
          fieldsToValidate = ['password'];
        }
        break;
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Neues lokales Mitglied anlegen</DialogTitle>
        </DialogHeader>

        <Form form={form} onSubmit={handleSubmit}>
          <div className="space-y-6">
            {step === 1 && <MemberTypeSelection form={form} onNext={handleNext} />}

            {step === 2 && (
              <MemberDataStep
                form={form}
                memberType={form.watch('memberType')}
                onNext={handleNext}
                onBack={() => {
                  setStep(1);
                }}
              />
            )}

            {step === 3 && (
              <PasswordSetupStep
                form={form}
                onSubmit={() => form.handleSubmit(handleSubmit)()}
                onBack={() => {
                  setStep(2);
                }}
                isSubmitting={createMutation.isPending}
              />
            )}

            {step === 4 && generatedPassword ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Mitglied erfolgreich angelegt!
                  </h3>
                  {form.watch('passwordOption') === 'generate' && (
                    <div className="mt-2">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Temporäres Passwort:
                      </p>
                      <code className="mt-1 block rounded bg-white p-2 font-mono dark:bg-gray-900">
                        {generatedPassword}
                      </code>
                    </div>
                  )}
                </div>

                <Button onClick={handleClose} className="w-full">
                  Schließen
                </Button>
              </div>
            ) : null}
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
