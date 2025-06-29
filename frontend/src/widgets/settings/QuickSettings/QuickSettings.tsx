// frontend/src/widgets/settings/QuickSettings/QuickSettings.tsx
// Quick settings dropdown

import { Settings } from 'lucide-react';

import { useSettings } from '@/entities/settings';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn';

export const QuickSettings = () => {
  const { data: settings } = useSettings();

  if (settings == null) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Settings className='h-5 w-5' />
          <span className='sr-only'>Einstellungen öffnen</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>Quick Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem checked={settings.features.events}>
          Events aktiviert
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem checked={settings.features.members}>
          Mitglieder aktiviert
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem checked={settings.features.gallery}>
          Galerie aktiviert
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className='text-muted-foreground text-xs'>
          Für mehr Optionen: Einstellungen → Features
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
