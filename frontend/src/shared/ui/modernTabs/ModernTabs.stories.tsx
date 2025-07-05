// frontend/src/shared/ui/modernTabs/ModernTabs.stories.tsx
import { Calendar, FileText, Settings, Users } from 'lucide-react';

import { ModernTabs } from './ModernTabs';

import type { ModernTabItem } from './model/types';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'modernTabs',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => {
    const items: ModernTabItem[] = [
      {
        value: 'overview',
        label: 'Übersicht',
        content: (
          <div className="py-4">
            <h3 className="mb-2 text-lg font-semibold">Event Übersicht</h3>
            <p className="text-muted-foreground">
              Hier findest du alle wichtigen Informationen zum Event auf einen Blick.
            </p>
          </div>
        ),
      },
      {
        value: 'participants',
        label: 'Teilnehmer',
        icon: Users,
        content: (
          <div className="py-4">
            <h3 className="mb-2 text-lg font-semibold">Angemeldete Teilnehmer</h3>
            <p className="text-muted-foreground">42 Mitglieder haben sich angemeldet.</p>
          </div>
        ),
      },
      {
        value: 'schedule',
        label: 'Programm',
        icon: Calendar,
        content: (
          <div className="py-4">
            <h3 className="mb-2 text-lg font-semibold">Veranstaltungsprogramm</h3>
            <p className="text-muted-foreground">Das detaillierte Programm für den Tag.</p>
          </div>
        ),
      },
      {
        value: 'documents',
        label: 'Dokumente',
        icon: FileText,
        content: (
          <div className="py-4">
            <h3 className="mb-2 text-lg font-semibold">Relevante Dokumente</h3>
            <p className="text-muted-foreground">Einladungen, Pläne und weitere Unterlagen.</p>
          </div>
        ),
      },
    ];

    return (
      <div className="w-full max-w-4xl">
        <ModernTabs items={items} defaultValue="overview" />
      </div>
    );
  },
};

export const Pills = {
  render: () => {
    const items: ModernTabItem[] = [
      {
        value: 'general',
        label: 'Allgemein',
        icon: Settings,
        content: <div className="py-4">Allgemeine Einstellungen</div>,
      },
      {
        value: 'notifications',
        label: 'Benachrichtigungen',
        content: <div className="py-4">Benachrichtigungseinstellungen</div>,
      },
      {
        value: 'privacy',
        label: 'Datenschutz',
        content: <div className="py-4">Datenschutzeinstellungen</div>,
      },
    ];

    return (
      <div className="w-full max-w-2xl">
        <ModernTabs items={items} defaultValue="general" variant="pills" />
      </div>
    );
  },
};

export const ManyTabs = {
  render: () => {
    const items: ModernTabItem[] = [
      { value: '2020', label: '2020', content: <div className="py-4">Events aus 2020</div> },
      { value: '2021', label: '2021', content: <div className="py-4">Events aus 2021</div> },
      { value: '2022', label: '2022', content: <div className="py-4">Events aus 2022</div> },
      { value: '2023', label: '2023', content: <div className="py-4">Events aus 2023</div> },
      { value: '2024', label: '2024', content: <div className="py-4">Events aus 2024</div> },
      { value: '2025', label: '2025', content: <div className="py-4">Events aus 2025</div> },
    ];

    return (
      <div className="w-full">
        <h3 className="mb-4 text-lg font-semibold">Tabs passen sich automatisch an</h3>
        <ModernTabs items={items} defaultValue="2024" />
      </div>
    );
  },
};

export const WithShortLabels = {
  render: () => {
    const items: ModernTabItem[] = [
      {
        value: 'mon',
        label: 'Montag',
        shortLabel: 'Mo',
        content: <div className="py-4">Montag Programm</div>,
      },
      {
        value: 'tue',
        label: 'Dienstag',
        shortLabel: 'Di',
        content: <div className="py-4">Dienstag Programm</div>,
      },
      {
        value: 'wed',
        label: 'Mittwoch',
        shortLabel: 'Mi',
        content: <div className="py-4">Mittwoch Programm</div>,
      },
      {
        value: 'thu',
        label: 'Donnerstag',
        shortLabel: 'Do',
        content: <div className="py-4">Donnerstag Programm</div>,
      },
      {
        value: 'fri',
        label: 'Freitag',
        shortLabel: 'Fr',
        content: <div className="py-4">Freitag Programm</div>,
      },
    ];

    return (
      <div className="w-full max-w-2xl">
        <p className="text-muted-foreground mb-4 text-sm">
          Auf mobilen Geräten werden kurze Labels angezeigt
        </p>
        <ModernTabs items={items} defaultValue="mon" />
      </div>
    );
  },
};
