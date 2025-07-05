// shared/ui/charts/utils/export.ts
import { type ReactFlowInstance } from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Exportiert Chart in verschiedene Formate
 */
export const exportChart = async (
  reactFlowInstance: ReactFlowInstance,
  format: 'png' | 'svg' | 'pdf',
  filename = 'chart'
): Promise<void> => {
  const viewport = reactFlowInstance.getViewport();
  const nodes = reactFlowInstance.getNodes();

  // Berechne Bounding Box
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  nodes.forEach(node => {
    const { position } = node;
    const width = node.width ?? 200;
    const height = node.height ?? 100;
    minX = Math.min(minX, position.x);
    minY = Math.min(minY, position.y);
    maxX = Math.max(maxX, position.x + width);
    maxY = Math.max(maxY, position.y + height);
  });

  const padding = 50;
  const width = (maxX - minX + padding * 2) * viewport.zoom;
  const height = (maxY - minY + padding * 2) * viewport.zoom;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const element = document.querySelector('.react-flow__viewport') as HTMLElement | null;
  if (!element) {
    throw new Error('Chart element not found');
  }

  const exportOptions = {
    backgroundColor: '#ffffff',
    width,
    height,
    style: {
      transform: `translate(${(-minX + padding).toString()}px, ${(-minY + padding).toString()}px) scale(${viewport.zoom.toString()})`,
    },
  };

  try {
    switch (format) {
      case 'png': {
        const dataUrl = await toPng(element, exportOptions);
        downloadFile(dataUrl, `${filename}.png`);
        break;
      }

      case 'svg': {
        const dataUrl = await toSvg(element, exportOptions);
        downloadFile(dataUrl, `${filename}.svg`);
        break;
      }

      case 'pdf': {
        const imgData = await toPng(element, {
          ...exportOptions,
          width: width * 2,
          height: height * 2,
        });

        const pdf = new jsPDF({
          orientation: width > height ? 'l' : 'p',
          unit: 'px',
          format: [width, height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`${filename}.pdf`);
        break;
      }
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export chart as ${format}`);
  }
};

const downloadFile = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
