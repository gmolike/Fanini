// frontend/src/shared/ui/display/Display.stories.tsx
import {
  AddressDisplay,
  BooleanDisplay,
  DateDisplay,
  EmailDisplay,
  PhoneDisplay,
  TextDisplay,
} from './index';

import type { StoryObj } from '@storybook/react';

const meta = {
  title: 'display',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

// Text Display Stories
export const Text: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <TextDisplay text="Normaler Text" className="" />
      <TextDisplay text={null} className="" placeholder="Kein Wert vorhanden" />
      <TextDisplay
        text="Sehr langer Text der abgeschnitten werden sollte wenn er zu lang ist"
        className="max-w-xs"
      />
    </div>
  ),
};

// Boolean Display Stories
export const BooleanValue: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span>Icon Variante:</span>
        <BooleanDisplay value />
        <BooleanDisplay value={false} />
        <BooleanDisplay value={null} />
      </div>

      <div className="flex items-center gap-4">
        <span>Text Variante:</span>
        <BooleanDisplay value variant="text" />
        <BooleanDisplay value={false} variant="text" />
      </div>

      <div className="flex items-center gap-4">
        <span>Custom Labels:</span>
        <BooleanDisplay value variant="text" trueLabel="Aktiv" falseLabel="Inaktiv" />
      </div>

      <div className="flex items-center gap-4">
        <span>Ohne Farbe:</span>
        <BooleanDisplay value withColor={false} />
        <BooleanDisplay value={false} withColor={false} />
      </div>
    </div>
  ),
};

// Date Display Stories
export const DateValue: StoryObj = {
  render: () => {
    const testDate = new Date('2024-03-15T10:30:00');

    return (
      <div className="space-y-4">
        <DateDisplay date={testDate} format="short" />
        <DateDisplay date={testDate} format="medium" withIcon />
        <DateDisplay date={testDate} format="long" />
        <DateDisplay date={null} placeholder="Kein Datum" />
      </div>
    );
  },
};

// Email Display Stories
export const Email: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <EmailDisplay email="info@faninitiative-spandau.de" />
      <EmailDisplay email="kontakt@eintracht-spandau.de" withIcon={false} />
      <EmailDisplay email="max.mustermann@example.com" asLink={false} />
      <EmailDisplay email={null} placeholder="Keine E-Mail" />
    </div>
  ),
};

// Phone Display Stories
export const Phone: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <PhoneDisplay phone="+49 30 12345678" />
      <PhoneDisplay phone="030 / 123 456 78" withIcon={false} />
      <PhoneDisplay phone="+491701234567" asLink={false} />
      <PhoneDisplay phone={null} placeholder="Keine Telefonnummer" />
    </div>
  ),
};

// Address Display Stories
export const Address: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Inline Format:</p>
        <AddressDisplay
          address={{
            street: 'Hauptstraße 123',
            postalCode: '13585',
            city: 'Berlin-Spandau',
            country: 'Deutschland',
          }}
        />
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">Multiline Format:</p>
        <AddressDisplay
          address={{
            street: 'Hauptstraße 123',
            postalCode: '13585',
            city: 'Berlin-Spandau',
            country: 'Deutschland',
          }}
          format="multiline"
        />
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">Teilweise Adresse:</p>
        <AddressDisplay
          address={{
            city: 'Berlin-Spandau',
          }}
        />
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">Keine Adresse:</p>
        <AddressDisplay address={null} />
      </div>
    </div>
  ),
};
