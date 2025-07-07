// frontend/src/features/public/organization-structure/ui/StructureView.tsx
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Users } from 'lucide-react';

import {
  ORGANIZATION_NODE_CONFIG,
  type OrganizationNode,
} from '@/entities/public/organization-structure';

import { Badge, Button } from '@/shared/shadcn';
import { AnimatedValue, GlassCard } from '@/shared/ui';

type StructureViewProps = {
  data: OrganizationNode;
};

export const StructureView = ({ data }: StructureViewProps) => {
  const renderNode = (node: OrganizationNode, level = 0) => {
    const config = ORGANIZATION_NODE_CONFIG[node.type];

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: level * 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1 }}
        className={level > 0 ? 'mt-4 ml-8' : ''}
      >
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {node.logo ? (
                <img
                  src={node.logo}
                  alt={node.name}
                  className="h-12 w-12 rounded-lg object-contain"
                />
              ) : (
                <div className={`rounded-lg bg-gradient-to-r ${config.color} p-3 text-white`}>
                  <span className="text-2xl">{config.icon}</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{node.name}</h3>
                  {node.isExternal ? (
                    <Badge variant="outline" className="text-xs">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Extern
                    </Badge>
                  ) : null}
                </div>

                {node.description ? (
                  <p className="text-sm text-[var(--color-muted-foreground)]">{node.description}</p>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                  {node.memberCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <AnimatedValue
                        value={node.memberCount}
                        format={n => `${String(n)} Mitglieder`}
                      />
                    </span>
                  )}

                  {node.lead ? (
                    <span className="text-[var(--color-muted-foreground)]">
                      Leitung: {node.lead}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {node.email ? (
                <Button size="sm" variant="ghost" asChild>
                  <a href={`mailto:${node.email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}

              {node.link ? (
                <Button size="sm" variant="ghost" asChild>
                  <a href={node.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </GlassCard>

        {node.children && node.children.length > 0 ? (
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-0 left-6 h-full w-0.5 bg-gradient-to-b from-[var(--color-fanini-blue)] to-transparent" />
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="mb-4 text-3xl font-bold">Vereinsstruktur</h2>
        <p className="mx-auto max-w-2xl text-[var(--color-muted-foreground)]">
          Unsere Organisation besteht aus verschiedenen Teams und Partnervereinen, die gemeinsam für
          Eintracht Spandau aktiv sind.
        </p>
      </motion.div>

      {renderNode(data)}
    </div>
  );
};
