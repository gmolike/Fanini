// frontend/src/shared/ui/layout/Layout.stories.tsx
import { Plus, Settings } from 'lucide-react';

import { Button } from '../button/Button';

import { PageHeader, PageSection } from './index';

import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'layout',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

// Breadcrumb Component für Demo
const Breadcrumb = () => (
  <nav className="flex items-center space-x-2 text-sm">
    <a href="#" className="text-muted-foreground hover:text-foreground">
      Start
    </a>
    <span className="text-muted-foreground">/</span>
    <a href="#" className="text-muted-foreground hover:text-foreground">
      Events
    </a>
    <span className="text-muted-foreground">/</span>
    <span>Sommerfest 2024</span>
  </nav>
);

export const Headers = {
  render: () => (
    <div className="space-y-8">
      <PageHeader
        title="Events verwalten"
        description="Erstelle und verwalte Vereinsveranstaltungen"
        variant="default"
      />

      <PageHeader
        title="Willkommen bei der Faninitiative Spandau"
        description="Gemeinsam für unseren Verein"
        variant="hero"
      />

      <PageHeader title="Minimaler Header" variant="minimal" />
    </div>
  ),
};

export const HeaderWithActions = {
  render: () => (
    <PageHeader
      title="Mitgliederverwaltung"
      description="847 aktive Mitglieder"
      breadcrumb={<Breadcrumb />}
      actions={
        <>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Neues Mitglied
          </Button>
        </>
      }
    />
  ),
};

export const Sections = {
  render: () => (
    <div>
      <PageSection>
        <h2 className="mb-4 text-2xl font-bold">Standard Section</h2>
        <p className="text-muted-foreground">
          Dies ist eine Standard-Sektion mit normalem Hintergrund.
        </p>
      </PageSection>

      <PageSection variant="muted">
        <h2 className="mb-4 text-2xl font-bold">Muted Section</h2>
        <p className="text-muted-foreground">
          Diese Sektion hat einen dezenten Hintergrund für bessere visuelle Trennung.
        </p>
      </PageSection>

      <PageSection variant="accent">
        <h2 className="mb-4 text-2xl font-bold">Accent Section</h2>
        <p className="text-muted-foreground">
          Eine Sektion mit Akzent-Hintergrund für besondere Inhalte.
        </p>
      </PageSection>
    </div>
  ),
};

export const CompletePage = {
  render: () => (
    <div>
      <PageHeader
        title="Event Details"
        description="Sommerfest 2024"
        breadcrumb={<Breadcrumb />}
        actions={<Button>Event bearbeiten</Button>}
      />

      <PageSection>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Über das Event</h3>
            <p className="text-muted-foreground">
              Unser jährliches Sommerfest findet dieses Jahr im Vereinsheim statt. Alle Mitglieder
              und deren Familien sind herzlich eingeladen.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-muted-foreground text-sm">Datum</dt>
                <dd className="font-medium">15. Juli 2024</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Ort</dt>
                <dd className="font-medium">Vereinsheim Spandau</dd>
              </div>
            </dl>
          </div>
        </div>
      </PageSection>

      <PageSection variant="muted">
        <h3 className="mb-4 text-lg font-semibold">Angemeldete Teilnehmer</h3>
        <p className="text-muted-foreground">42 Mitglieder haben sich bereits angemeldet.</p>
      </PageSection>
    </div>
  ),
};
