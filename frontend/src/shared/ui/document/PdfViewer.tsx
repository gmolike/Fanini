// shared/ui/document/PdfViewer.tsx
import { useState } from 'react';
import { Download, ExternalLink, FileText, Loader2, X } from 'lucide-react';
import { Button, Card } from '@/shared/shadcn';
import { cn } from '@/shared/lib';

type PdfViewerProps = {
  url: string;
  title: string;
  className?: string;
  height?: string;
};

/**
 * PDF Viewer Komponente mit Vorschau und Download-Optionen
 * @param url - URL des PDF-Dokuments
 * @param title - Titel des Dokuments
 * @param className - Zusätzliche CSS-Klassen
 * @param height - Höhe des Viewers (Standard: 600px)
 */
export const PdfViewer = ({ url, title, className, height = '600px' }: PdfViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    link.click();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b bg-[var(--color-muted)] p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--color-fanini-blue)]" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="transition-colors hover:bg-[var(--color-fanini-blue)] hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="transition-colors hover:bg-[var(--color-fanini-blue)] hover:text-white"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Neuer Tab
            </a>
          </Button>
        </div>
      </div>

      <div className="relative bg-gray-50" style={{ height }}>
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-muted)]">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-[var(--color-muted-foreground)]" />
            <p className="text-sm text-[var(--color-muted-foreground)]">PDF wird geladen...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-muted)]">
            <X className="mb-4 h-8 w-8 text-[var(--color-destructive)]" />
            <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
              PDF konnte nicht geladen werden.
            </p>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Stattdessen herunterladen
            </Button>
          </div>
        )}

        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
          className="h-full w-full border-0"
          onLoad={handleLoad}
          onError={handleError}
          title={title}
          style={{ display: error ? 'none' : 'block' }}
        />
      </div>
    </Card>
  );
};
