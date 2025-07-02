import { Building, FileText, ScrollText, Users } from 'lucide-react';

import { BoardView } from '@/features/public/organization-board';
import { DocumentsView } from '@/features/public/organization-documents';
import { StructureView } from '@/features/public/organization-structure';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn';
import { PageHeader, PageSection } from '@/shared/ui/layout';

/**
 * AboutWidget
 * @description Komposition der About-Seite aus Features
 */
export const AboutWidget = () => {
  return (
    <>
      <PageHeader
        title="Über die Faninitiative Spandau"
        description="Seit 2025 vereinen wir die Fans der Eintracht Spandau."
        variant="hero"
      />

      <PageSection>
        <Tabs defaultValue="structure" className="space-y-6">
          <TabsList className="bg-muted mx-auto grid h-auto w-full max-w-2xl grid-cols-4 p-1">
            <TabsTrigger
              value="structure"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Building className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Struktur</span>
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Vorstand</span>
            </TabsTrigger>
            <TabsTrigger
              value="statutes"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ScrollText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Satzung</span>
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Dokumente</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="structure">
            <StructureView />
          </TabsContent>

          <TabsContent value="board">
            <BoardView />
          </TabsContent>

          <TabsContent value="statutes">
            <DocumentsView filterType="satzung" />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsView />
          </TabsContent>
        </Tabs>
      </PageSection>
    </>
  );
};
