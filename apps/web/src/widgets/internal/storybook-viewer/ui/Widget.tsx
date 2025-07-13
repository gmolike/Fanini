import { useState } from 'react';

import { motion } from 'framer-motion';
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

import { Button } from '@/shared/shadcn';
import { Container, GlassCard } from '@/shared/ui';

/**
 * StorybookViewer Widget
 * @description Embedded Storybook viewer mit Fullscreen-Option
 */
export const StorybookViewer = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const storybookUrl = '/storybook-static/index.html';

  return (
    <Container className={isFullscreen ? 'bg-background fixed inset-0 z-50' : 'py-8'}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Storybook</h1>
          <p className="text-[var(--color-muted-foreground)]">
            Komponenten-Katalog und interaktive Dokumentation
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
            }}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="mr-2 h-4 w-4" />
                Verkleinern
              </>
            ) : (
              <>
                <Maximize2 className="mr-2 h-4 w-4" />
                Vollbild
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(storybookUrl, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Neuer Tab
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={isFullscreen ? 'h-[calc(100vh-8rem)]' : 'h-[800px]'}
      >
        <GlassCard className="h-full overflow-hidden p-0">
          <iframe src={storybookUrl} className="h-full w-full border-0" title="Storybook" />
        </GlassCard>
      </motion.div>
    </Container>
  );
};
