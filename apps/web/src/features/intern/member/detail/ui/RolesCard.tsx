// apps/web/src/features/intern/member/detail/ui/RolesCard.tsx
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { Plus, Shield, Trash2 } from 'lucide-react';

import {
  type AssignRoleRequest,
  getRoleLabel,
  type MemberDetail,
  type MemberRole,
  ROLE_CONFIG,
  useAssignRole,
  useRemoveRole,
} from '@/entities/intern/member';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn';
import { ConfirmDialog, EnumBadge } from '@/shared/ui';
import { FormSelect, FormTextArea, useForm } from '@/shared/ui/form';

type RolesCardProps = {
  member: MemberDetail;
  canManageRoles: boolean;
  userRole: MemberRole;
};

export const RolesCard = ({ member, canManageRoles, userRole }: RolesCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<MemberRole | null>(null);

  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();

  const form = useForm({
    defaultValues: {
      rolle: 'MITGLIED' as MemberRole,
      begruendung: '',
    },
  });

  const availableRoles = (
    [
      'ADMIN',
      'VORSTAND',
      'BEIRAT',
      'KASSENPRUFER',
      'TEAM_EVENT',
      'TEAM_TECHNIK',
      'TEAM_MEDIEN',
      'TEAM_VEREIN',
      'MITGLIED',
    ] as const
  ).filter(role => {
    if (role === 'ADMIN' && userRole !== 'ADMIN') return false;
    if (['VORSTAND', 'BEIRAT'].includes(role) && userRole !== 'VORSTAND') return false;
    return !member.rolle.includes(role);
  });

  const handleAssignRole = async (data: { rolle: MemberRole; begruendung: string }) => {
    const request: AssignRoleRequest & { memberId: string } = {
      ...data,
      memberId: member.id,
    };

    await assignRoleMutation.mutateAsync(request as any);
    setDialogOpen(false);
    form.reset();
  };

  const handleRemoveRole = async () => {
    if (!roleToRemove) return;

    await removeRoleMutation.mutateAsync({
      memberId: member.id,
      roleId: roleToRemove,
    });

    setConfirmRemoveOpen(false);
    setRoleToRemove(null);
  };

  const roleOptions = availableRoles.map(value => ({
    value,
    label: getRoleLabel(value),
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rollen & Berechtigungen
          </CardTitle>
          <CardDescription>Verwaltung der Mitgliederrollen im System</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {member.rolle.length === 0 ? (
              <Alert>
                <AlertDescription>Diesem Mitglied sind keine Rollen zugewiesen.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {member.rolle.map(role => (
                  <div
                    key={role}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <EnumBadge value={role} config={ROLE_CONFIG} />
                      <span className="text-muted-foreground text-sm">
                        Hierarchie: {getRoleLabel(role)}
                      </span>
                    </div>
                    {canManageRoles && role !== 'MITGLIED' ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setRoleToRemove(role);
                          setConfirmRemoveOpen(true);
                        }}
                        disabled={removeRoleMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {canManageRoles && availableRoles.length > 0 ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Rolle hinzufügen
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rolle zuweisen</DialogTitle>
            <DialogDescription>
              Weisen Sie {member.vorname} {member.nachname} eine neue Rolle zu.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleAssignRole)} className="space-y-4">
            <FormSelect
              control={form.control}
              name="rolle"
              label="Rolle"
              options={roleOptions}
              required
            />

            <FormTextArea
              control={form.control}
              name="begruendung"
              label="Begründung"
              placeholder="Geben Sie eine Begründung für die Rollenzuweisung an..."
              rows={3}
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={assignRoleMutation.isPending}>
                Rolle zuweisen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmRemoveOpen}
        onOpenChange={setConfirmRemoveOpen}
        title="Rolle entfernen"
        description={`Möchten Sie die Rolle "${roleToRemove ? getRoleLabel(roleToRemove) : ''}" wirklich entfernen?`}
        confirmText="Entfernen"
        cancelText="Abbrechen"
        variant="destructive"
        onConfirm={() => void handleRemoveRole()}
        isLoading={removeRoleMutation.isPending}
      />
    </>
  );
};
