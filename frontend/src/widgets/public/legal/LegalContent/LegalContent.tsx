// frontend/src/widgets/public/legal/LegalContent/LegalContent.tsx
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Loader2 } from 'lucide-react';

import { Container } from '@/shared/ui';

type LegalContentProps = {
  type: 'impressum' | 'datenschutz';
};

/**
 * LegalContent Widget
 * @description Lädt und zeigt rechtliche Inhalte (Impressum/Datenschutz) aus Markdown-Dateien
 */
export const LegalContent = ({ type }: LegalContentProps) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/content/legal/${type}.md`);
        if (!response.ok) {
          throw new Error('Datei nicht gefunden');
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Failed to load legal content:', err);
        setError('Der Inhalt konnte nicht geladen werden.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadContent();
  }, [type]);

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-muted-foreground)]" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-16">
        <div className="text-center text-[var(--color-destructive)]">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <article className="prose prose-lg dark:prose-invert prose-headings:font-[Bebas_Neue] prose-h1:text-[var(--color-fanini-blue)] prose-h2:text-[var(--color-fanini-blue)] prose-a:text-[var(--color-fanini-blue)] prose-a:no-underline hover:prose-a:underline max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </Container>
  );
};
