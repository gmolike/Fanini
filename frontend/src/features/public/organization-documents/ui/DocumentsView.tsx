import { useState } from 'react';

import { type Document, useOrganizationDocuments } from '@/entities/public/organization';

import { cn } from '@/shared/lib';
import { Card } from '@/shared/shadcn';
import { PdfViewer } from '@/shared/ui/document';
import { LoadingState } from '@/shared/ui/feedback';

type DocumentsViewProps = {
  filterType?: Document['type'];
};

/**
 * DocumentsView Feature
 * @description Zeigt Dokumente mit direkter PDF-Vorschau
 */
export const DocumentsView = ({ filterType }: DocumentsViewProps) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const documentsQuery = useOrganizationDocuments();

  return (
    <LoadingState query={documentsQuery}>
      {response => {
        const documents = filterType
          ? response.data.filter(doc => doc.type === filterType)
          : response.data;

        const defaultDoc = documents.find(doc => doc.type === 'satzung') ?? documents[0];
        const selectedDoc = selectedDocId
          ? documents.find(d => d.id === selectedDocId)
          : defaultDoc;

        return (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Dokumentenliste */}
            <div className="space-y-3">
              <h3 className="mb-4 text-lg font-semibold">Verfügbare Dokumente</h3>
              {documents.map(doc => (
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
                <Card className="h-[1000px] overflow-hidden p-0">
                  {' '}
                  {/* Erhöht von 600px auf 800px */}
                  <div className="bg-muted border-b px-4 py-3">
                    <h4 className="font-medium">{selectedDoc.title}</h4>
                  </div>
                  <PdfViewer
                    url={selectedDoc.fileUrl}
                    title={selectedDoc.title}
                    className="h-[calc(100%-53px)]"
                  />
                </Card>
              ) : (
                <Card className="text-muted-foreground p-8 text-center">
                  Keine Dokumente verfügbar
                </Card>
              )}
            </div>
          </div>
        );
      }}
    </LoadingState>
  );
};
