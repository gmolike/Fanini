// shared/ui/document/PdfViewer.tsx
import { useState } from 'react';

import { Download, ExternalLink, FileText, Loader2, X } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';

type PdfViewerProps = {
  url: string;
  title: string;
  className?: string;
};

/**
 * PDF Viewer Komponente mit Vorschau und Download-Optionen
 * @param url - URL des PDF-Dokuments
 * @param title - Titel des Dokuments
 * @param className - Zusätzliche CSS-Klassen
 * @param height - Höhe des Viewers (Standard: 600px)
 */
export const PdfViewer = ({ url, title, className }: PdfViewerProps) => {
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
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header mit Aktionen */}
      <div className="flex shrink-0 items-center justify-between border-b bg-[var(--color-muted)] px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--color-fanini-blue)]" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Download</span>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Neuer Tab</span>
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Container */}
      <div className="relative flex-1 bg-gray-100 dark:bg-gray-800">
        {loading && !error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-[var(--color-muted-foreground)]" />
            <p className="text-sm text-[var(--color-muted-foreground)]">PDF wird geladen...</p>
          </div>
        ) : null}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <X className="mb-4 h-8 w-8 text-[var(--color-destructive)]" />
            <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
              PDF konnte nicht geladen werden.
            </p>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Stattdessen herunterladen
            </Button>
          </div>
        ) : null}

        <iframe
          src={`${url}#view=FitH&toolbar=0`}
          className="h-full w-full border-0"
          onLoad={handleLoad}
          onError={handleError}
          title={title}
          style={{ display: error ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};
