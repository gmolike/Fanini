// widgets/public/organization/documents/Viewer.tsx
import { useState } from 'react';
import { FileText, Download, ExternalLink, Eye, Grid2X2, List as ListIcon } from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/shadcn';
import { PdfViewer } from '@/shared/ui/document';
import { cn } from '@/shared/lib';
import type { Document } from '@/entities/public/organization';

type ViewerProps = {
  documents: Document[];
  className?: string;
};

/**
 * Dokumenten-Viewer mit PDF-Anzeige
 * @param documents - Liste der Dokumente
 * @param className - Zusätzliche CSS-Klassen
 */
export const Viewer = ({ documents, className }: ViewerProps) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'inline'>('list');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'satzung':
        return '📜';
      case 'geschaeftsordnung':
        return '📋';
      case 'protokoll':
        return '📝';
      default:
        return '📄';
    }
  };

  const getDocumentTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'satzung':
        return 'Satzung';
      case 'geschaeftsordnung':
        return 'Geschäftsordnung';
      case 'protokoll':
        return 'Protokoll';
      default:
        return 'Dokument';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={v => v && setViewMode(v as 'list' | 'inline')}
        >
          <ToggleGroupItem value="list" aria-label="Listenansicht">
            <ListIcon className="mr-2 h-4 w-4" />
            Liste
          </ToggleGroupItem>
          <ToggleGroupItem value="inline" aria-label="Vorschau">
            <Grid2X2 className="mr-2 h-4 w-4" />
            Vorschau
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Dokumenten-Anzeige */}
      {viewMode === 'list' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map(doc => (
            <Card key={doc.id} className="p-6 transition-all hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl">{getDocumentIcon(doc.type)}</div>

                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-semibold">{doc.title}</h3>

                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                    <Badge variant="secondary" className="shrink-0">
                      {getDocumentTypeLabel(doc.type)}
                    </Badge>
                    <span className="shrink-0">{formatFileSize(doc.fileSize)}</span>
                    <span className="shrink-0">
                      Aktualisiert: {new Date(doc.updatedAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => setSelectedDoc(doc)}
                      className="bg-[var(--color-fanini-blue)] hover:bg-[var(--color-fanini-blue)]/90"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Anzeigen
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.fileUrl} download={doc.title}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {documents.map(doc => (
            <div key={doc.id} className="space-y-2">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                <h3 className="text-lg font-semibold">{doc.title}</h3>
                <Badge variant="secondary">{formatFileSize(doc.fileSize)}</Badge>
              </div>
              <PdfViewer url={doc.fileUrl} title={doc.title} height="800px" />
            </div>
          ))}
        </div>
      )}

      {/* PDF Modal */}
      <Dialog open={!!selectedDoc} onOpenChange={open => !open && setSelectedDoc(null)}>
        <DialogContent className="h-[90vh] max-w-6xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedDoc && getDocumentIcon(selectedDoc.type)}</span>
              {selectedDoc?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6 pt-0">
            {selectedDoc && (
              <PdfViewer url={selectedDoc.fileUrl} title={selectedDoc.title} height="100%" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
