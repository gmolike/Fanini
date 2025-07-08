// src/demo/ui/PersonSelectDialog.tsx
import { memo, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn';

import type { PersonInfo } from '../model/types';

/**
 * Dialog props
 */
type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (person: PersonInfo) => void;
  currentPersonId?: string;
};

/**
 * Person selection dialog with dummy data
 *
 * @component
 */
const Component = memo(({ open, onOpenChange, onSelect, currentPersonId }: DialogProps) => {
  // Dummy data for demo
  const dummyPersons: PersonInfo[] = [
    { id: '1', vorname: 'Max', nachname: 'Mustermann', gremium: 'Vorstand' },
    { id: '2', vorname: 'Anna', nachname: 'Schmidt', gremium: 'Beirat' },
    { id: '3', vorname: 'Peter', nachname: 'Weber', gremium: 'Team Event' },
  ];

  const [selectedId, setSelectedId] = useState(currentPersonId);

  const handleSave = () => {
    const person = dummyPersons.find(p => p.id === selectedId);
    if (person) {
      onSelect(person);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verantwortliche Person auswählen</DialogTitle>
          <DialogDescription>Wählen Sie eine Person aus der Liste aus.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {dummyPersons.map(person => (
            <button
              key={person.id}
              type="button"
              onClick={() => {
                setSelectedId(person.id);
              }}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                selectedId === person.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="font-medium">
                {person.vorname} {person.nachname}
              </div>
              <div className="text-muted-foreground text-sm">{person.gremium}</div>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSave} disabled={!selectedId}>
            Auswählen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

Component.displayName = 'PersonSelectDialog';
export const PersonSelectDialog = Component;
