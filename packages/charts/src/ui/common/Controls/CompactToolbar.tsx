// shared/ui/charts/ui/common/Controls/CompactToolbar.tsx
import { memo, useCallback } from 'react';

import { useReactFlow } from '@xyflow/react';
import { Download, Maximize2, Minus, Plus } from 'lucide-react';

import { cn } from '@/shared/lib';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from '@/shared/shadcn';

type CompactToolbarProps = {
  onExport?: (format: 'png' | 'svg' | 'pdf') => void;
  showZoom?: boolean;
  showFitView?: boolean;
  showExport?: boolean;
  className?: string;
};

/**
 * Kompakte Chart-Toolbar nur mit Icons
 */
export const CompactToolbar = memo<CompactToolbarProps>(
  ({ onExport, showZoom = true, showFitView = true, showExport = true, className }) => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    const handleZoomIn = useCallback(() => {
      void zoomIn({ duration: 200 });
    }, [zoomIn]);

    const handleZoomOut = useCallback(() => {
      void zoomOut({ duration: 200 });
    }, [zoomOut]);

    const handleFitView = useCallback(() => {
      void fitView({ duration: 200, padding: 0.2 });
    }, [fitView]);

    return (
      <div
        className={cn(
          'absolute top-2 left-2 z-10 flex items-center gap-0.5',
          'bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur',
          'rounded-md border p-0.5 shadow-sm',
          className
        )}
      >
        {/* Zoom Controls */}
        {showZoom ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleZoomIn}
              title="Vergrößern"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleZoomOut}
              title="Verkleinern"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : null}

        {/* Fit View */}
        {showFitView ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleFitView}
            title="Ansicht anpassen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        ) : null}

        {/* Separator */}
        {(showZoom || showFitView) && showExport && onExport ? (
          <Separator orientation="vertical" className="h-4" />
        ) : null}

        {/* Export Menu */}
        {showExport && onExport ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" title="Exportieren">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {
                  onExport('png');
                }}
              >
                PNG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onExport('svg');
                }}
              >
                SVG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onExport('pdf');
                }}
              >
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    );
  }
);

CompactToolbar.displayName = 'CompactToolbar';
