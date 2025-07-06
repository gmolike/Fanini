// frontend/src/features/public/document-list/ui/DocumentCard.tsx
import { useState } from 'react';

import { motion } from 'framer-motion';
import { Calendar, Download, Eye, FileText, RefreshCw } from 'lucide-react';

import { DocumentDetailModal } from '@/features/public/document-detail';

import {
  DOCUMENT_CATEGORY_CONFIG,
  type DocumentListItem,
  useDocumentDetail,
} from '@/entities/public/document';

import { Badge, Button } from '@/shared/shadcn';
import { GlassCard, HoverCard } from '@/shared/ui';

type DocumentCardProps = {
  document: DocumentListItem;
  onDownload: (id: string) => void;
};

export const DocumentCard = ({ document, onDownload }: DocumentCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const { data: fullDocument, isLoading } = useDocumentDetail(
    { documentId: document.id },
    {
      enabled: showDetail, // Query nur aktivieren wenn Modal offen ist
    }
  );
  const categoryConfig = DOCUMENT_CATEGORY_CONFIG[document.category];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${String(bytes)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
      >
        <HoverCard>
          <GlassCard className="group h-full p-6 transition-all hover:shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`rounded-lg bg-gradient-to-r ${categoryConfig.gradient} p-3 text-white shadow-lg`}
                >
                  <FileText className="h-6 w-6" />
                </motion.div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    {categoryConfig.label}
                  </Badge>
                  <h3 className="font-semibold transition-colors group-hover:text-[var(--color-fanini-blue)]">
                    {document.title}
                  </h3>
                </div>
              </div>
              {document.status === 'outdated' && (
                <Badge variant="secondary" className="text-orange-600">
                  Veraltet
                </Badge>
              )}
            </div>

            <div className="mb-4 space-y-2 text-sm text-[var(--color-muted-foreground)]">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(document.publishedAt).toLocaleDateString('de-DE')}
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5" />
                Version {document.version}
              </div>
            </div>

            {document.preview ? (
              <p className="mb-4 line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
                {document.preview}
              </p>
            ) : null}

            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-muted-foreground)]">
                {document.fileType.toUpperCase()} • {formatFileSize(document.fileSize)}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowDetail(true);
                }}
                className="group/btn flex-1"
              >
                <Eye className="mr-2 h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />
                Vorschau
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  onDownload(document.id);
                }}
                className="group/btn flex-1"
              >
                <Download className="mr-2 h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
                Download
              </Button>
            </div>
          </GlassCard>
        </HoverCard>
      </motion.div>

      <DocumentDetailModal
        document={fullDocument ?? null}
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
        }}
        isLoading={isLoading}
      />
    </>
  );
};
