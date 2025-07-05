// frontend/src/pages/intern/components.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Mail, Phone, User } from 'lucide-react';

import { ComponentCategory, ComponentShowcase } from '@/widgets/shared/componentShowcase';

import {
  AnimatedText,
  Button,
  DataField,
  EmailDisplay,
  EnumBadge,
  FloatingCard,
  ModernTabs,
  PhoneDisplay,
} from '@/shared/ui';

export const Route = createFileRoute('/intern/components')({
  component: ComponentsPage,
});

function ComponentsPage() {
  // Beispiel Enum für Badge Demo
  const StatusEnum = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
  } as const;

  const statusConfig = {
    variants: {
      ACTIVE: { label: 'Aktiv', variant: 'success' as const },
      INACTIVE: { label: 'Inaktiv', variant: 'error' as const },
      PENDING: { label: 'Ausstehend', variant: 'warning' as const },
    },
    enumObj: StatusEnum,
  };

  return (
    <div className="space-y-12 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-fanini-blue-700 text-3xl font-bold">Component Library</h1>
        <p className="text-muted-foreground mt-2">
          Übersicht aller verfügbaren UI-Komponenten für die Faninitiative Spandau
        </p>
      </div>

      {/* Buttons */}
      <ComponentCategory title="Buttons" description="Verschiedene Button-Varianten und Zustände">
        <ComponentShowcase
          title="Button Varianten"
          description="Primary, Secondary, Outline und Ghost Buttons"
          component={
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          }
          code={`<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>`}
        />

        <ComponentShowcase
          title="Button mit Loading State"
          description="Buttons mit Loading-Indikator"
          component={
            <div className="flex gap-4">
              <Button loading>Wird geladen...</Button>
              <Button variant="outline" loading>
                Speichern
              </Button>
            </div>
          }
          code={`<Button loading>Wird geladen...</Button>
<Button variant="outline" loading>Speichern</Button>`}
        />
      </ComponentCategory>

      {/* Display Components */}
      <ComponentCategory title="Display Components" description="Komponenten zur Anzeige von Daten">
        <ComponentShowcase
          title="Data Display"
          description="Strukturierte Datenanzeige mit Icons"
          component={
            <div className="space-y-4">
              <DataField label="Name" value="Max Mustermann" icon={<User />} />
              <DataField
                label="E-Mail"
                value={<EmailDisplay email="max@fanini.live" />}
                icon={<Mail />}
              />
              <DataField
                label="Telefon"
                value={<PhoneDisplay phone="+49 30 123456" />}
                icon={<Phone />}
              />
            </div>
          }
          code={`<DataField label="Name" value="Max Mustermann" icon={<User />} />
<DataField label="E-Mail" value={<EmailDisplay email="max@fanini.live" />} icon={<Mail />} />
<DataField label="Telefon" value={<PhoneDisplay phone="+49 30 123456" />} icon={<Phone />} />`}
        />

        <ComponentShowcase
          title="Enum Badge"
          description="Type-safe Badges für Enum-Werte"
          component={
            <div className="flex gap-2">
              <EnumBadge value="ACTIVE" config={statusConfig} />
              <EnumBadge value="INACTIVE" config={statusConfig} />
              <EnumBadge value="PENDING" config={statusConfig} />
            </div>
          }
          code={`const statusConfig = {
  variants: {
    ACTIVE: { label: 'Aktiv', variant: 'success' },
    INACTIVE: { label: 'Inaktiv', variant: 'error' },
    PENDING: { label: 'Ausstehend', variant: 'warning' }
  },
  enumObj: StatusEnum
};

<EnumBadge value="ACTIVE" config={statusConfig} />`}
        />
      </ComponentCategory>

      {/* Animation Components */}
      <ComponentCategory title="Animationen" description="Animierte Komponenten für bessere UX">
        <ComponentShowcase
          title="Animated Text"
          description="Text mit Fade-In Animation"
          component={
            <div className="space-y-4">
              <AnimatedText delay={0}>
                <h3 className="text-xl font-bold">Willkommen!</h3>
              </AnimatedText>
              <AnimatedText delay={0.2}>
                <p>Diese Texte erscheinen nacheinander</p>
              </AnimatedText>
              <AnimatedText delay={0.4} gradient>
                <p className="text-lg font-bold">Mit Gradient Effect</p>
              </AnimatedText>
            </div>
          }
          code={`<AnimatedText delay={0}>
  <h3 className="text-xl font-bold">Willkommen!</h3>
</AnimatedText>
<AnimatedText delay={0.2}>
  <p>Diese Texte erscheinen nacheinander</p>
</AnimatedText>
<AnimatedText delay={0.4} gradient>
  <p className="text-lg font-bold">Mit Gradient Effect</p>
</AnimatedText>`}
        />

        <ComponentShowcase
          title="Floating Card"
          description="3D Hover Effect Card"
          component={
            <FloatingCard className="max-w-sm">
              <div className="bg-card rounded-lg border p-6">
                <h4 className="mb-2 font-semibold">Hover me!</h4>
                <p className="text-muted-foreground text-sm">
                  Diese Karte bewegt sich beim Hovern in 3D
                </p>
              </div>
            </FloatingCard>
          }
          code={`<FloatingCard className="max-w-sm">
  <div className="rounded-lg border bg-card p-6">
    <h4 className="mb-2 font-semibold">Hover me!</h4>
    <p className="text-sm text-muted-foreground">
      Diese Karte bewegt sich beim Hovern in 3D
    </p>
  </div>
</FloatingCard>`}
        />
      </ComponentCategory>

      {/* Tabs */}
      <ComponentCategory title="Navigation" description="Navigations-Komponenten">
        <ComponentShowcase
          title="Modern Tabs"
          description="Moderne Tab-Navigation"
          component={
            <ModernTabs
              defaultValue="tab1"
              items={[
                {
                  value: 'tab1',
                  label: 'Übersicht',
                  content: <div className="py-4">Inhalt von Tab 1</div>,
                },
                {
                  value: 'tab2',
                  label: 'Details',
                  content: <div className="py-4">Inhalt von Tab 2</div>,
                },
                {
                  value: 'tab3',
                  label: 'Einstellungen',
                  content: <div className="py-4">Inhalt von Tab 3</div>,
                },
              ]}
            />
          }
          code={`<ModernTabs
  defaultValue="tab1"
  items={[
    {
      value: 'tab1',
      label: 'Übersicht',
      content: <div>Inhalt von Tab 1</div>
    },
    {
      value: 'tab2',
      label: 'Details',
      content: <div>Inhalt von Tab 2</div>
    }
  ]}
/>`}
        />
      </ComponentCategory>
    </div>
  );
}
