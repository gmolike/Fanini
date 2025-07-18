import { useState } from 'react';

import { Shield, UserMinus } from 'lucide-react';

import { type MemberRole, ROLE_CONFIG } from '@/entities/intern/member';

import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn';
import { FormSelect, FormTextArea, useForm } from '@/shared/ui/form';

import type { BulkAction } from '../model/types';

type MemberBulkActionsProps = {
  selectedCount: number;
  onBulkAction: (action: BulkAction, data?: any) => void;
  canAssignRoles: boolean;
  isLoading: boolean;
};

/**
 * MemberBulkActions Component
 *
 * @description Bulk-Aktionen für ausgewählte Mitglieder
 */
export const MemberBulkActions = ({
  selectedCount,
  onBulkAction,
  canAssignRoles,
  isLoading,
}: MemberBulkActionsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      role: 'MITGLIED' as MemberRole,
      reason: '',
    },
  });

  if (selectedCount === 0) return null;

  const handleRoleAssignment = (data: { role: MemberRole; reason: string }) => {
    onBulkAction('assign-role', { roleId: data.role, reason: data.reason });
    setDialogOpen(false);
    form.reset();
  };

  const roleOptions = Object.entries(ROLE_CONFIG)
    .filter(([key]) => key !== 'ADMIN')
    .map(([value, config]) => ({
      value,
      label: config.label,
    }));

  return (
    <>
      <Alert className="flex items-center justify-between">
        <AlertDescription className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          {selectedCount} Mitglied{selectedCount !== 1 ? 'er' : ''} ausgewählt
        </AlertDescription>

        <div className="flex items-center gap-2">
          {canAssignRoles ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDialogOpen(true);
              }}
              disabled={isLoading}
            >
              Rolle zuweisen
            </Button>
          ) : null}

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onBulkAction('deactivate');
            }}
            disabled={isLoading}
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Deaktivieren
          </Button>
        </div>
      </Alert>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rolle zuweisen</DialogTitle>
            <DialogDescription>
              Weisen Sie {selectedCount} Mitglied{selectedCount !== 1 ? 'ern' : ''} eine neue Rolle
              zu.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleRoleAssignment)} className="space-y-4">
            <FormSelect
              control={form.control}
              name="role"
              label="Rolle"
              options={roleOptions}
              required
            />

            <FormTextArea
              control={form.control}
              name="reason"
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
              <Button type="submit" disabled={isLoading}>
                Rolle zuweisen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
