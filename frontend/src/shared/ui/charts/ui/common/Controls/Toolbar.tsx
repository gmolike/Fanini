// shared/ui/charts/components/common/Controls/Toolbar.tsx
import { memo, useCallback } from 'react';

import { useReactFlow } from '@xyflow/react';
import { Download, Maximize2, Minus, Plus, Redo, Save, Undo } from 'lucide-react';

import { cn } from '@/shared/lib';
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from '@/shared/shadcn';

type ToolbarProps = {
  onExport?: (format: 'png' | 'svg' | 'pdf') => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  className?: string;
};

/**
 * Chart-Toolbar mit Zoom-, Export- und Bearbeitungsfunktionen
 */
export const ChartToolbar = memo<ToolbarProps>(
  ({ onExport, canUndo, canRedo, onUndo, onRedo, onSave, className }) => {
    const { zoomIn, zoomOut, fitView } = useReactFlow() as {
      zoomIn: (options?: { duration?: number }) => void;
      zoomOut: (options?: { duration?: number }) => void;
      fitView: (options?: { duration?: number; padding?: number }) => void;
    };

    const handleZoomIn = useCallback(() => {
      zoomIn({ duration: 200 });
    }, [zoomIn]);

    const handleZoomOut = useCallback(() => {
      zoomOut({ duration: 200 });
    }, [zoomOut]);

    const handleFitView = useCallback(() => {
      fitView({ duration: 200, padding: 0.2 });
    }, [fitView]);

    return (
      <Card className={cn('absolute top-4 left-4 z-10', className)}>
        <div className="flex items-center gap-1 p-2">
          {/* Zoom Controls */}
          <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Vergrößern">
            <Plus className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Verkleinern">
            <Minus className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleFitView} title="Ansicht anpassen">
            <Maximize2 className="h-4 w-4" />
          </Button>

          {onUndo || onRedo || onSave ? (
            <>
              <Separator orientation="vertical" className="mx-1 h-6" />

              {onUndo ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUndo}
                  disabled={!canUndo}
                  title="Rückgängig"
                >
                  <Undo className="h-4 w-4" />
                </Button>
              ) : null}

              {onRedo ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRedo}
                  disabled={!canRedo}
                  title="Wiederholen"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              ) : null}

              {onSave ? (
                <Button variant="ghost" size="icon" onClick={onSave} title="Speichern">
                  <Save className="h-4 w-4" />
                </Button>
              ) : null}
            </>
          ) : null}

          {onExport ? (
            <>
              <Separator orientation="vertical" className="mx-1 h-6" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title="Exportieren">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => {
                      onExport('png');
                    }}
                  >
                    Als PNG exportieren
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onExport('svg');
                    }}
                  >
                    Als SVG exportieren
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onExport('pdf');
                    }}
                  >
                    Als PDF exportieren
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </Card>
    );
  }
);

ChartToolbar.displayName = 'ChartToolbar';
