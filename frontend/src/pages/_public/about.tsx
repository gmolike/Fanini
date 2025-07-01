// pages/_public/about.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Building, FileText, ScrollText, Users } from 'lucide-react';

import {
  Chart as OrgChart,
  List as BoardList,
  Viewer as DocsViewer,
} from '@/widgets/public/organization';

import {
  type OrganizationNode,
  useBoardMembers,
  useOrganizationDocuments,
  useOrganizationStructure,
} from '@/entities/public/organization';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn';
import { LoadingState } from '@/shared/ui/feedback';
import { Container } from '@/shared/ui/layout';

export const Route = createFileRoute('/_public/about')({
  component: AboutPage,
});

function AboutPage() {
  const boardQuery = useBoardMembers();
  const structureQuery = useOrganizationStructure();
  const documentsQuery = useOrganizationDocuments();

  return (
    <Container className="py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 font-[Bebas_Neue] text-4xl text-[var(--color-fanini-blue)]">
          Über die Faninitiative Spandau
        </h1>
        <p className="max-w-3xl text-lg text-[var(--color-muted-foreground)]">
          Seit 2025 vereinen wir die Fans der Eintracht Spandau.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="structure" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="structure">
            <Building className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Struktur</span>
          </TabsTrigger>
          <TabsTrigger value="board">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Vorstand</span>
          </TabsTrigger>
          <TabsTrigger value="statutes">
            <ScrollText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Satzung</span>
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Dokumente</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure">
          <h2 className="mb-6 text-2xl font-semibold">Organisationsstruktur</h2>
          <LoadingState query={structureQuery}>
            {response => <OrgChart data={response.data as OrganizationNode[]} />}
          </LoadingState>
        </TabsContent>

        <TabsContent value="board">
          <h2 className="mb-6 text-2xl font-semibold">Unser Vorstand</h2>
          <LoadingState query={boardQuery}>
            {response => <BoardList members={response.data} />}
          </LoadingState>
        </TabsContent>

        <TabsContent value="statutes">
          <h2 className="mb-6 text-2xl font-semibold">Vereinssatzung</h2>
          <LoadingState query={documentsQuery}>
            {response => {
              const satzung = response.data.find(doc => doc.type === 'satzung');
              return satzung ? (
                <DocsViewer documents={[satzung]} />
              ) : (
                <p className="text-[var(--color-muted-foreground)]">
                  Die Satzung ist derzeit nicht verfügbar.
                </p>
              );
            }}
          </LoadingState>
        </TabsContent>

        <TabsContent value="documents">
          <h2 className="mb-6 text-2xl font-semibold">Vereinsdokumente</h2>
          <LoadingState query={documentsQuery}>
            {response => <DocsViewer documents={response.data} />}
          </LoadingState>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
