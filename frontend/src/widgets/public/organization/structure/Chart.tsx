import { useEffect, useRef, useState } from 'react';

import * as d3 from 'd3';

import type { OrganizationNode } from '@/entities/public/organization';

import { cn } from '@/shared/lib';
import { Badge, Button, Card } from '@/shared/shadcn';

type ChartProps = {
  data: OrganizationNode;
  className?: string;
};

// Explizite D3 Types
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface D3HierarchyNode extends d3.HierarchyPointNode<OrganizationNode> {
  x: number;
  y: number;
}

/**
 * Interaktives Organigramm zur Darstellung der Vereinsstruktur
 * @param data - Hierarchische Struktur
 * @param className - CSS-Klassen
 */
export const Chart = ({ data, className }: ChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<OrganizationNode | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1200;
    const height = 600;
    const nodeWidth = 240;
    const nodeHeight = 80;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Clear previous chart
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Setup SVG
    svg
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create container group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left.toString()},${margin.top.toString()})`);

    // Create hierarchy
    const hierarchy = d3.hierarchy(data);

    // Create tree layout
    const treeLayout = d3
      .tree<OrganizationNode>()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      .separation(() => 1.5);

    // Generate the tree
    const root = treeLayout(hierarchy) as D3HierarchyNode;

    // Create link path generator
    const linkPath = d3
      .linkVertical<d3.HierarchyPointLink<OrganizationNode>, D3HierarchyNode>()
      .x((d: D3HierarchyNode) => d.x)
      .y((d: D3HierarchyNode) => d.y);

    // Create links
    g.selectAll<SVGPathElement, d3.HierarchyPointLink<OrganizationNode>>('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkPath)
      .style('fill', 'none')
      .style('stroke', 'var(--color-border)')
      .style('stroke-width', 2);

    // Create nodes
    const nodeGroups = g
      .selectAll<SVGGElement, D3HierarchyNode>('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: D3HierarchyNode) => `translate(${d.x.toString()},${d.y.toString()})`);

    // Add rectangles for nodes
    nodeGroups
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('x', -nodeWidth / 2)
      .attr('y', -nodeHeight / 2)
      .attr('rx', 8)
      .style('fill', (d: D3HierarchyNode) => {
        switch (d.data.type) {
          case 'board':
            return 'var(--color-fanini-blue)';
          case 'advisory':
            return 'var(--color-fanini-red)';
          case 'audit':
            return 'var(--color-warning)';
          default:
            return 'var(--color-muted)';
        }
      })
      .style('stroke', '#fff')
      .style('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', function (event: MouseEvent, d: D3HierarchyNode) {
        event.stopPropagation();
        setSelectedNode(d.data);
      });

    // Add main text
    nodeGroups
      .append('text')
      .attr('dy', '-0.2em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .text((d: D3HierarchyNode) => d.data.name);

    // Add level text
    nodeGroups
      .filter((d: D3HierarchyNode) => d.data.level !== undefined)
      .append('text')
      .attr('dy', '1.2em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('opacity', 0.8)
      .style('pointer-events', 'none')
      .text((d: D3HierarchyNode) => `Ebene ${(d.data.level + 1).toString()}`);

    // Click outside to deselect
    svg.on('click', () => {
      setSelectedNode(null);
    });
  }, [data]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="space-y-4 p-6">
        {/* Legend */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-[var(--color-muted-foreground)]">
            Klicke auf ein Element für mehr Details
          </h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[var(--color-fanini-blue)]" />
              <span>Vorstand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[var(--color-fanini-red)]" />
              <span>Beirat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[var(--color-warning)]" />
              <span>Prüfung</span>
            </div>
          </div>
        </div>

        {/* SVG Container */}
        <div className="rounded-lg bg-[var(--color-muted)] p-4">
          <svg ref={svgRef} className="w-full" style={{ height: '500px' }} />
        </div>

        {/* Selected Node Details */}
        {selectedNode !== null && (
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
                {selectedNode.description !== undefined && (
                  <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                    {selectedNode.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedNode(null);
                }}
              >
                Schließen
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
