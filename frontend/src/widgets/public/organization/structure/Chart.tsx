// widgets/public/organization/structure/Chart.tsx
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, Badge } from '@/shared/shadcn';
import { cn } from '@/shared/lib';
import type { OrganizationNode } from '@/entities/public/organization';

type ChartProps = {
  data: OrganizationNode;
  className?: string;
};

/**
 * Interaktives Organigramm zur Darstellung der Vereinsstruktur
 * @param data - Hierarchische Struktur
 * @param className - CSS-Klassen
 */
export const Chart = ({ data, className }: ChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<OrganizationNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 1200;
    const height = 600;
    const nodeWidth = 220;
    const nodeHeight = 80;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create container for zoom
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create tree layout
    const root = d3.hierarchy(data);
    const treeLayout = d3
      .tree<OrganizationNode>()
      .size([width - 200, height - 150])
      .nodeSize([nodeWidth + 40, nodeHeight + 60]);

    treeLayout(root);

    // Create gradient definitions
    const defs = svg.append('defs');

    // Board gradient
    const boardGradient = defs
      .append('linearGradient')
      .attr('id', 'board-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    boardGradient
      .append('stop')
      .attr('offset', '0%')
      .style('stop-color', 'var(--color-fanini-blue)')
      .style('stop-opacity', 1);

    boardGradient
      .append('stop')
      .attr('offset', '100%')
      .style('stop-color', 'var(--color-fanini-blue)')
      .style('stop-opacity', 0.8);

    // Create links with animation
    const links = g
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr(
        'd',
        d3
          .linkVertical()
          .x((d: any) => d.x + width / 2)
          .y((d: any) => d.y + 50)
      )
      .style('fill', 'none')
      .style('stroke', 'var(--color-border)')
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5,5')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);

    // Create node groups
    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x + width / 2 - nodeWidth / 2},${d.y})`)
      .style('opacity', 0);

    // Add shadows
    const filter = defs
      .append('filter')
      .attr('id', 'shadow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur').attr('in', 'SourceAlpha').attr('stdDeviation', 3);

    filter.append('feOffset').attr('dx', 2).attr('dy', 2).attr('result', 'offsetblur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'offsetblur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Add rectangles with hover effects
    nodes
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 8)
      .style('fill', (d: any) => {
        switch (d.data.type) {
          case 'board':
            return 'url(#board-gradient)';
          case 'advisory':
            return 'var(--color-fanini-red)';
          case 'audit':
            return 'var(--color-warning)';
          default:
            return 'var(--color-muted)';
        }
      })
      .style('filter', 'url(#shadow)')
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d.data);
      })
      .on('mouseenter', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style('transform', 'scale(1.05)')
          .style('filter', 'url(#shadow) brightness(1.1)');
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style('transform', 'scale(1)')
          .style('filter', 'url(#shadow) brightness(1)');
      });

    // Add main text
    nodes
      .append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight / 2 - 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .text((d: any) => d.data.name);

    // Add level/description text
    nodes
      .filter((d: any) => d.data.description || d.data.level !== undefined)
      .append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight / 2 + 10)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('opacity', 0.8)
      .style('pointer-events', 'none')
      .text((d: any) => d.data.description || `Ebene ${d.data.level + 1}`);

    // Animate nodes appearing
    nodes
      .transition()
      .duration(500)
      .delay((d: any) => d.depth * 100)
      .style('opacity', 1);

    // Click outside to deselect
    svg.on('click', () => setSelectedNode(null));
  }, [data]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="space-y-4 p-6">
        {/* Legend */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-[var(--color-muted-foreground)]">
            Klicke auf ein Element für mehr Details • Scrolle zum Zoomen
          </h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{
                  background:
                    'linear-gradient(var(--color-fanini-blue), var(--color-fanini-blue) 80%)',
                }}
              />
              <span>Vorstand</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: 'var(--color-fanini-red)' }}
              />
              <span>Beirat</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: 'var(--color-warning)' }}
              />
              <span>Prüfung</span>
            </div>
          </div>
        </div>

        {/* SVG Container */}
        <div className="rounded-lg bg-[var(--color-muted)]">
          <svg ref={svgRef} className="h-[600px] w-full" />
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className="animate-in slide-in-from-bottom-2 rounded-lg bg-[var(--color-muted)] p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="flex items-center gap-2 text-lg font-semibold">
                  {selectedNode.name}
                  <Badge variant="secondary" className="text-xs">
                    {selectedNode.type === 'board' && 'Vorstand'}
                    {selectedNode.type === 'advisory' && 'Beirat'}
                    {selectedNode.type === 'audit' && 'Prüfung'}
                    {selectedNode.type === 'team' && 'Team'}
                  </Badge>
                </h4>
                {selectedNode.description && (
                  <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                    {selectedNode.description}
                  </p>
                )}
                {selectedNode.level !== undefined && (
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    Hierarchieebene: {selectedNode.level + 1}
                  </p>
                )}
                {selectedNode.members && selectedNode.members.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                    {selectedNode.members.length} Mitglieder
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                Schließen
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
