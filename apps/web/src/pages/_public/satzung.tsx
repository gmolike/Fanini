// frontend/src/pages/_public/satzung.tsx
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

import { InlineDocumentViewer } from '@/features/public/document-viewer';

import { useDocumentDetail } from '@/entities/public/document';

import { AnimatedValue, LoadingState } from '@/shared/ui';

export const Route = createFileRoute('/_public/satzung')({
  component: SatzungPage,
});

function SatzungPage() {
  const satzungQuery = useDocumentDetail({ documentId: 'doc-satzung' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-fanini-blue)]/5 via-transparent to-[var(--color-fanini-red)]/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-blue)]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-red)]/10 blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="mb-6 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-5"
          >
            <FileText className="h-12 w-12 text-white" />
          </motion.div>

          <AnimatedValue delay={0.2}>
            <h1 className="mb-4 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              Vereinssatzung
            </h1>
          </AnimatedValue>

          <AnimatedValue delay={0.3}>
            <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
              Die rechtliche Grundlage der Faninitiative Spandau e.V.
            </p>
          </AnimatedValue>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-20">
        <LoadingState query={satzungQuery}>
          {document => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto max-w-5xl"
            >
              <InlineDocumentViewer document={document.data} showInfo />
            </motion.div>
          )}
        </LoadingState>
      </div>
    </div>
  );
}
