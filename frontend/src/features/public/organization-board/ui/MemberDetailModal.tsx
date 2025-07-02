// frontend/src/features/public/organization-board/ui/MemberDetailModal.tsx
import { Calendar, Mail, Phone, User, X } from 'lucide-react';

import type { BoardMember } from '@/entities/public/organization';

import { Badge, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/shadcn';

type MemberDetailModalProps = {
  member: BoardMember | null;
  open: boolean;
  onClose: () => void;
};

/**
 * MemberDetailModal Component
 * @description Modal zur Detailansicht eines Vorstandsmitglieds
 */
export const MemberDetailModal = ({ member, open, onClose }: MemberDetailModalProps) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{member.name}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Schließen</span>
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header mit Bild */}
          <div className="flex items-start gap-6">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="h-24 w-24 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/80 shadow-lg">
                <User className="h-12 w-12 text-white" />
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{member.name}</h2>
              <Badge className="mt-2 bg-[var(--color-fanini-blue)] text-white">
                {member.roleLabel}
              </Badge>
              {member.description ? (
                <p className="mt-3 text-[var(--color-muted-foreground)]">{member.description}</p>
              ) : null}
            </div>
          </div>

          {/* Kontaktinformationen */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="mb-3 font-semibold">Kontaktinformationen</h3>

            {member.email ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-muted)]">
                  <Mail className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                </div>
                <a
                  href={`mailto:${member.email}`}
                  className="transition-colors hover:text-[var(--color-fanini-blue)]"
                >
                  {member.email}
                </a>
              </div>
            ) : null}

            {member.phone ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-muted)]">
                  <Phone className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                </div>
                <a
                  href={`tel:${member.phone}`}
                  className="transition-colors hover:text-[var(--color-fanini-blue)]"
                >
                  {member.phone}
                </a>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-muted)]">
                <Calendar className="h-4 w-4 text-[var(--color-muted-foreground)]" />
              </div>
              <span>
                Mitglied seit{' '}
                {new Date(member.memberSince).toLocaleDateString('de-DE', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Verantwortlichkeiten */}
          {member.responsibilities.length > 0 && (
            <div className="space-y-3 border-t pt-6">
              <h3 className="mb-3 font-semibold">Verantwortlichkeiten</h3>
              <ul className="space-y-2">
                {member.responsibilities.map(resp => (
                  <li key={resp} className="flex items-start">
                    <span className="mt-1.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-fanini-blue)]" />
                    <span className="text-[var(--color-muted-foreground)]">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
