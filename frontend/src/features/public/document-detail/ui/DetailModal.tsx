// frontend/src/features/public/document-detail/ui/DetailModal.tsx
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, FileText, Loader2, RefreshCw, User, X } from 'lucide-react';

import { type Document, DOCUMENT_CATEGORY_CONFIG } from '@/entities/public/document';

import { Badge, Button } from '@/shared/shadcn';
import { GlassCard, PdfViewer } from '@/shared/ui';

type DocumentDetailModalProps = {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
};

export const DocumentDetailModal = ({
  document,
  isOpen,
  onClose,
  isLoading = false,
}: DocumentDetailModalProps) => {
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isOpen && document) {
      timer = setTimeout(() => {
        setShowPdf(true);
      }, 300);
    } else {
      setShowPdf(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, document]);

  if (!isOpen) return null;

  const categoryConfig = document ? DOCUMENT_CATEGORY_CONFIG[document.category] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative z-10 w-full max-w-6xl"
        >
          <GlassCard className="overflow-hidden">
            {isLoading || !document ? (
              <div className="flex h-[70vh] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[var(--color-fanini-blue)]" />
                  <p className="text-[var(--color-muted-foreground)]">Dokument wird geladen...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b bg-gradient-to-r from-[var(--color-fanini-blue)]/10 to-[var(--color-fanini-red)]/10 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg bg-gradient-to-r ${categoryConfig?.gradient ?? ''} p-3 text-white`}
                      >
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <h2 className="text-2xl font-bold">{document.title}</h2>
                          {document.status === 'outdated' && (
                            <Badge variant="secondary" className="text-orange-600">
                              Veraltet
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
                          <Badge variant="outline">{categoryConfig?.label}</Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(document.publishedAt).toLocaleDateString('de-DE')}
                          </span>
                          <span className="flex items-center gap-1">
                            <RefreshCw className="h-3.5 w-3.5" />
                            Version {document.version}
                          </span>
                          {document.author ? (
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {document.author}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={onClose}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {document.description ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 text-[var(--color-muted-foreground)]"
                    >
                      {document.description}
                    </motion.p>
                  ) : null}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showPdf ? 1 : 0 }}
                  transition={{ delay: 0.3 }}
                  className="h-[70vh]"
                >
                  {showPdf ? (
                    <PdfViewer url={document.fileUrl} title={document.title} className="h-full" />
                  ) : null}
                </motion.div>
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
