import { useState } from 'react';

import { type CreateMemberFormData, useCreateLocalMember } from '@/entities/intern/member';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/shadcn';
import { useForm } from '@/shared/ui/form';

import { DataStep } from './steps/DataStep';
import { PasswordSetupStep } from './steps/PasswordSetupStep';
import { TypeSelection } from './steps/TypeSelection';

type CreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * CreateDialog Component
 * @description Multi-Step Dialog zum Anlegen lokaler Mitglieder
 */
export const CreateDialog = ({ open, onOpenChange }: CreateDialogProps) => {
  const [step, setStep] = useState(1);
  const [generatedPassword, setGeneratedPassword] = useState<string>();

  const form = useForm<CreateMemberFormData>({
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
      password: '',
    },
  });

  const createMutation = useCreateLocalMember();

  const handleSubmit = async (data: CreateMemberFormData) => {
    try {
      if (data.passwordOption === 'manual' && !data.password) {
        form.setError('password', { message: 'Passwort ist erforderlich' });
        return;
      }

      // mutateAsync gibt CreateLocalMemberResponse zurück, nicht Request!
      const result = await createMutation.mutateAsync(data);

      if (result.success) {
        if (result.data?.temporaryPassword) {
          setGeneratedPassword(result.data.temporaryPassword);
          setStep(4);
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return <TypeSelection form={form} onNext={handleNext} />;
      case 2:
        return (
          <DataStep
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
