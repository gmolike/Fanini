// frontend/src/widgets/public/document/ui/Widget.tsx
import { useState } from 'react';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

import { CategoryFilter, DocumentCard } from '@/features/public/document-list';

import { type DocumentCategory, useDocumentList } from '@/entities/public/document';

import { AnimatedValue, GlassCard, LoadingState } from '@/shared/ui';

export const DocumentWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);

  const documentsQuery = useDocumentList();

  const handleDownload = (documentId: string) => {
    // TODO: Implement download logic
    console.log('Download document:', documentId);
  };

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
              Dokumente & Downloads
            </h1>
          </AnimatedValue>

          <AnimatedValue delay={0.3}>
            <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
              Alle wichtigen Vereinsdokumente zentral an einem Ort. Von der Satzung über Protokolle
              bis zu Formularen.
            </p>
          </AnimatedValue>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-20">
        <CategoryFilter
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />

        <LoadingState query={documentsQuery}>
          {response => {
            const documents = response.data.filter(doc => {
              const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesCategory = !selectedCategory || doc.category === selectedCategory;
              return matchesSearch && matchesCategory;
            });

            if (documents.length === 0) {
              return (
                <GlassCard className="p-12 text-center">
                  <p className="text-[var(--color-muted-foreground)]">Keine Dokumente gefunden.</p>
                </GlassCard>
              );
            }

            return (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {documents.map(document => (
                  <DocumentCard key={document.id} document={document} onDownload={handleDownload} />
                ))}
              </motion.div>
            );
          }}
        </LoadingState>
      </div>
    </div>
  );
};
