// frontend/src/features/public/document-viewer/ui/InlineViewer.tsx
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

import { type Document } from '@/entities/public/document';

import { Alert, AlertDescription } from '@/shared/shadcn';
import { GlassCard, ParallaxCard, PdfViewer } from '@/shared/ui';

type InlineDocumentViewerProps = {
  document: Document;
  showInfo?: boolean;
};

export const InlineDocumentViewer = ({ document, showInfo = true }: InlineDocumentViewerProps) => {
  return (
    <ParallaxCard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="overflow-hidden">
          {/* Info Alert */}
          {showInfo ? (
            <Alert className="m-6 mb-0">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Dies ist die aktuelle Version {document.version} vom{' '}
                {new Date(document.publishedAt).toLocaleDateString('de-DE')}.
                {document.downloads > 0 &&
                  ` Bereits ${String(document.downloads)}x heruntergeladen.`}
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Enhanced PDF Viewer */}
          <div className="p-6">
            <div className="overflow-hidden rounded-lg border border-[var(--color-border)] shadow-lg">
              <PdfViewer url={document.fileUrl} title={document.title} className="h-[800px]" />
            </div>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 ? (
            <div className="border-t px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-muted-foreground)]">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map(tag => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </GlassCard>
      </motion.div>
    </ParallaxCard>
  );
};
