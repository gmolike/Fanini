import { useState } from 'react';

import { useOrganizationDocuments } from '@/entities/public/organization';

import { cn } from '@/shared/lib';
import { Card } from '@/shared/shadcn';
import { PdfViewer } from '@/shared/ui/document';
import { LoadingState } from '@/shared/ui/feedback';

/**
 * DocumentsView Feature
 * @description Zeigt Dokumente mit direkter Vorschau
 */
export const DocumentsView = () => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const documentsQuery = useOrganizationDocuments();

  return (
    <LoadingState query={documentsQuery}>
      {response => {
        const satzung = response.data.find(doc => doc.type === 'satzung');
        const selectedDoc = selectedDocId
          ? response.data.find(d => d.id === selectedDocId)
          : satzung;

        return (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Dokumentenliste */}
            <div className="space-y-3">
              <h3 className="mb-4 text-lg font-semibold">Verfügbare Dokumente</h3>
              {response.data.map(doc => (
                <Card
                  key={doc.id}
                  className={cn(
                    'cursor-pointer p-4 transition-all',
                    'hover:bg-accent/5 hover:shadow-md',
                    selectedDoc?.id === doc.id && 'ring-primary ring-2'
                  )}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                  }}
                >
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-muted-foreground text-sm">
                    {new Date(doc.updatedAt).toLocaleDateString('de-DE')}
                  </div>
                </Card>
              ))}
            </div>

            {/* Direkte PDF-Vorschau */}
            <div className="lg:col-span-2">
              {selectedDoc ? (
                <Card className="overflow-hidden p-0">
                  <div className="bg-muted border-b px-4 py-3">
                    <h4 className="font-medium">{selectedDoc.title}</h4>
                  </div>
                  <PdfViewer
                    url={selectedDoc.fileUrl}
                    title={selectedDoc.title}
                    className="h-[600px]"
                  />
                </Card>
              ) : (
                <Card className="text-muted-foreground p-8 text-center">
                  Wähle ein Dokument aus der Liste
                </Card>
              )}
            </div>
          </div>
        );
      }}
    </LoadingState>
  );
};
