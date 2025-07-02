import { Building, FileText, ScrollText, Users } from 'lucide-react';

import { BoardView } from '@/features/public/organization-board';
import { DocumentsView } from '@/features/public/organization-documents';
import { StructureView } from '@/features/public/organization-structure';

import { ModernTabs, PageHeader, PageSection } from '@/shared/ui';

export const AboutWidget = () => {
  const tabs = [
    {
      value: 'structure',
      label: 'Struktur',
      icon: Building,
      content: <StructureView />,
    },
    {
      value: 'board',
      label: 'Vorstand',
      icon: Users,
      content: <BoardView />,
    },
    {
      value: 'statutes',
      label: 'Satzung',
      icon: ScrollText,
      content: <DocumentsView filterType="satzung" />,
    },
    {
      value: 'documents',
      label: 'Dokumente',
      icon: FileText,
      content: <DocumentsView />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Über die Faninitiative Spandau"
        description="Seit 2025 vereinen wir die Fans der Eintracht Spandau."
        variant="hero"
      />

      <PageSection>
        <ModernTabs items={tabs} defaultValue="structure" variant="default" />
      </PageSection>
    </>
  );
};
