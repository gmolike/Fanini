// apps/web/src/features/intern/member-password/ui/SetPasswordDialog.tsx
import { useState } from 'react';

import { Mail, RefreshCw } from 'lucide-react';

import { useSetMemberPassword } from '@/features/intern/member-create';

import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn';

type SetPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  memberName: string;
};

/**
 * SetPasswordDialog Component
 * @description Dialog zum Zurücksetzen von Passwörtern
 */
export const SetPasswordDialog = ({
  open,
  onOpenChange,
  memberId,
  memberName,
}: SetPasswordDialogProps) => {
  const [generatedPassword, setGeneratedPassword] = useState<string>();
  const [sendEmail, setSendEmail] = useState(true);

  const mutation = useSetMemberPassword();

  const handleGeneratePassword = async () => {
    try {
      const result = await mutation.mutateAsync({
        memberId,
        generateTemporary: true,
        sendEmail,
      });

      if (result.success && result.data?.temporaryPassword) {
        setGeneratedPassword(result.data.temporaryPassword);
      }
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Passwort zurücksetzen</DialogTitle>
          <DialogDescription>Temporäres Passwort für {memberName} generieren</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!generatedPassword ? (
            <>
              <Alert>
                <AlertDescription>
                  Ein temporäres Passwort wird generiert, das beim ersten Login geändert werden
                  muss.
                </AlertDescription>
              </Alert>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmail}
                  onChange={(e) => { setSendEmail(e.target.checked); }}
                  className="rounded"
                />
                <label htmlFor="sendEmail" className="text-sm">
                  <Mail className="mr-2 inline h-4 w-4" />
                  Zugangsdaten per E-Mail senden
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { onOpenChange(false); }}>
                  Abbrechen
                </Button>
                <Button onClick={() => void handleGeneratePassword()} disabled={mutation.isPending}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {mutation.isPending ? 'Wird generiert...' : 'Passwort generieren'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Alert>
                <AlertDescription>
                  Temporäres Passwort wurde erfolgreich generiert:
                </AlertDescription>
              </Alert>

              <div className="bg-muted rounded-lg p-4">
                <code className="font-mono text-lg">{generatedPassword}</code>
              </div>

              {sendEmail ? <p className="text-muted-foreground text-sm">
                  Die Zugangsdaten wurden per E-Mail versendet.
                </p> : null}

              <Button onClick={() => { onOpenChange(false); }} className="w-full">
                Schließen
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
