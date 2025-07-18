import { useState } from 'react';

import { Plus, Shield, Trash2 } from 'lucide-react';

import {
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
import { EnumBadge } from '@/shared/ui';
import { FormSelect, FormTextArea, useForm } from '@/shared/ui/form';

type MemberRolesCardProps = {
  member: MemberDetail;
  canManageRoles: boolean;
  userRole: MemberRole;
};

/**
 * MemberRolesCard Component
 *
 * @description Verwaltung der Mitgliederrollen
 */
export const MemberRolesCard = ({ member, canManageRoles, userRole }: MemberRolesCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();

  const form = useForm({
    defaultValues: {
      rolle: 'MITGLIED' as MemberRole,
      begruendung: '',
    },
  });

  const availableRoles = Object.entries(ROLE_CONFIG).filter(([role]) => {
    // ADMIN kann nur von ADMIN vergeben werden
    if (role === 'ADMIN' && userRole !== 'ADMIN') return false;
    // VORSTAND/BEIRAT kann nur von VORSTAND vergeben werden
    if (['VORSTAND', 'BEIRAT'].includes(role) && userRole !== 'VORSTAND') return false;
    // Bereits vorhandene Rollen ausblenden
    return !member.rolle.includes(role as MemberRole);
  });

  const handleAssignRole = async (data: { rolle: MemberRole; begruendung: string }) => {
    await assignRoleMutation.mutateAsync({
      memberId: member.id,
      ...data,
    });
    setDialogOpen(false);
    form.reset();
  };

  const handleRemoveRole = async (roleToRemove: MemberRole) => {
    if (confirm(`Möchten Sie die Rolle "${ROLE_CONFIG[roleToRemove].label}" wirklich entfernen?`)) {
      await removeRoleMutation.mutateAsync({
        memberId: member.id,
        roleId: roleToRemove,
      });
    }
  };

  const roleOptions = availableRoles.map(([value, config]) => ({
    value,
    label: config.label,
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
                        Hierarchie: {ROLE_CONFIG[role as keyof typeof ROLE_CONFIG].label}
                      </span>
                    </div>
                    {canManageRoles && role !== 'MITGLIED' ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void handleRemoveRole(role)}
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
    </>
  );
};
