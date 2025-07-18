import { useState } from 'react';

import { EditContactForm } from '@/features/intern/member-edit/ui/forms/EditContactForm';

import type { MemberDetail } from '@/entities/intern/member';

import {
  Alert,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn';

import { EditBasicInfoForm } from './forms/EditBasicInfoForm';

type EditMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberDetail;
  needsApproval: boolean;
};

/**
 * EditMemberDialog Component
 *
 * @description Multi-Tab Dialog zum Bearbeiten von Mitgliederdaten
 */
export const EditMemberDialog = ({
  open,
  onOpenChange,
  member,
  needsApproval,
}: EditMemberDialogProps) => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mitglied bearbeiten</DialogTitle>
          <DialogDescription>
            Bearbeiten Sie die Daten von {member.vorname} {member.nachname}
          </DialogDescription>
        </DialogHeader>

        {needsApproval ? (
          <Alert>
            <AlertDescription>
              Ihre Änderungen werden zur Genehmigung an den Vorstand gesendet.
            </AlertDescription>
          </Alert>
        ) : null}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basisdaten</TabsTrigger>
            <TabsTrigger value="contact">Kontaktdaten</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <EditBasicInfoForm
              member={member}
              onSuccess={() => {
                onOpenChange(false);
              }}
              needsApproval={needsApproval}
            />
          </TabsContent>

          <TabsContent value="contact">
            <EditContactForm
              member={member}
              onSuccess={() => {
                onOpenChange(false);
              }}
              needsApproval={needsApproval}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
