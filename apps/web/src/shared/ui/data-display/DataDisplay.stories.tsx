// frontend/src/shared/ui/data-display/DataDisplay.stories.tsx
import { Calendar, Mail, Phone, User } from 'lucide-react';

import { DataField, DataGrid } from './index';

import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'data-display',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Field = {
  render: () => (
    <div className="w-64 space-y-4">
      <DataField label="Name" value="Max Mustermann" />
      <DataField label="Mitglied" value="Max Mustermann" icon={<User className="h-4 w-4" />} />
      <DataField label="Telefon" value={null} icon={<Phone className="h-4 w-4" />} highlightEmpty />
    </div>
  ),
};

export const Grid = {
  render: () => (
    <div className="w-full max-w-4xl space-y-4">
      <DataGrid columns={2}>
        <DataField label="Name" value="Max Mustermann" icon={<User className="h-4 w-4" />} />
        <DataField label="E-Mail" value="max@example.com" icon={<Mail className="h-4 w-4" />} />
        <DataField label="Telefon" value="+49 30 123456" icon={<Phone className="h-4 w-4" />} />
        <DataField
          label="Mitglied seit"
          value="01.01.2020"
          icon={<Calendar className="h-4 w-4" />}
        />
      </DataGrid>

      <DataGrid columns={3} bordered={false}>
        <DataField label="Events" value="12" />
        <DataField label="Aufgaben" value="5" />
        <DataField label="Status" value="Aktiv" />
      </DataGrid>

      <DataGrid columns={1}>
        <DataField
          label="Beschreibung"
          value="Langjähriges Mitglied und aktiver Helfer bei Events"
        />
        <DataField label="Notizen" value={null} highlightEmpty />
      </DataGrid>
    </div>
  ),
};
