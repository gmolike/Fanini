import { useState } from 'react';

import { Key, Settings, UserX } from 'lucide-react';

import { SetPasswordDialog } from '@/features/intern/member-password/ui/SetPasswordDialog';

import { type MemberDetail, useToggleMemberStatus } from '@/entities/intern/member';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn';

type MemberActionsCardProps = {
  member: MemberDetail;
  canResetPassword: boolean;
  canToggleStatus: boolean;
  canDelete: boolean;
  needsApproval: boolean;
  onEdit?: () => void;
};

/**
 * MemberActionsCard Component
 *
 * @description Aktionen für Mitgliederverwaltung
 */
export const MemberActionsCard = ({
  member,
  canResetPassword,
  canToggleStatus,
  canDelete,
  needsApproval,
  onEdit,
}: MemberActionsCardProps) => {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const toggleStatusMutation = useToggleMemberStatus();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleToggleStatus = async () => {
    await toggleStatusMutation.mutateAsync({
      memberId: member.id,
      istAktiv: !member.istAktiv,
    });
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Aktionen
          </CardTitle>
          <CardDescription>Verwaltungsaktionen für dieses Mitglied</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {needsApproval ? (
            <Alert>
              <AlertDescription>
                Ihre Änderungen müssen vom Vorstand genehmigt werden.
              </AlertDescription>
            </Alert>
          ) : null}

          {onEdit ? (
            <Button variant="default" className="w-full" onClick={onEdit}>
              <Settings className="mr-2 h-4 w-4" />
              Profil bearbeiten
            </Button>
          ) : null}

          {canResetPassword ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPasswordDialogOpen(true);
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              Passwort zurücksetzen
            </Button>
          ) : null}

          {canToggleStatus ? (
            <Button
              variant={member.istAktiv ? 'destructive' : 'outline'}
              className="w-full"
              onClick={() => { setConfirmDialogOpen(true); }}
              disabled={toggleStatusMutation.isPending}
            >
              <UserX className="mr-2 h-4 w-4" />
              {member.istAktiv ? 'Mitglied deaktivieren' : 'Mitglied aktivieren'}
            </Button>
          ) : null}

          {canDelete ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                setConfirmDialogOpen(true);
              }}
              disabled
              title="Funktion noch nicht implementiert"
            >
              Mitglied löschen
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <SetPasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        memberId={member.id}
        memberName={`${member.vorname} ${member.nachname}`}
      />

      {/* Custom confirmation dialog */}
      {confirmDialogOpen ? <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-sm rounded bg-white p-6 shadow-lg">
            <div className="mb-4">
              Möchten Sie das Mitglied wirklich {member.istAktiv ? 'deaktivieren' : 'aktivieren'}?
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setConfirmDialogOpen(false); }}>
                Abbrechen
              </Button>
              <Button
                variant={member.istAktiv ? 'destructive' : 'default'}
                onClick={handleToggleStatus}
                disabled={toggleStatusMutation.isPending}
              >
                Bestätigen
              </Button>
            </div>
          </div>
        </div> : null}
    </>
  );
};
