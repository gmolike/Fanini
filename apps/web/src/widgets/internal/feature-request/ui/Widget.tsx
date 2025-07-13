import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  MessageSquare,
  Plus,
  Rocket,
  Tag,
  ThumbsUp,
} from 'lucide-react';

import { cn } from '@/shared/lib';
import { Badge, Button, Tabs, TabsList, TabsTrigger } from '@/shared/shadcn';
import { Container, GlassCard } from '@/shared/ui';

type FeatureStatus = 'proposed' | 'planned' | 'in-progress' | 'completed' | 'rejected';
type FeatureCategory = 'frontend' | 'backend' | 'design' | 'infrastructure' | 'other';

type Feature = {
  id: string;
  title: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  votes: number;
  comments: number;
  author: string;
  createdAt: string;
  tags: string[];
};

const mockFeatures: Feature[] = [
  {
    id: '1',
    title: 'Push-Benachrichtigungen',
    description: 'Mobile Push-Notifications für wichtige Updates',
    category: 'frontend',
    status: 'planned',
    votes: 23,
    comments: 5,
    author: 'Sarah Schmidt',
    createdAt: '2024-01-15',
    tags: ['mobile', 'notifications'],
  },
  {
    id: '2',
    title: 'Darkmode Verbesserungen',
    description: 'Optimierung der Farbkontraste im Darkmode',
    category: 'design',
    status: 'in-progress',
    votes: 18,
    comments: 12,
    author: 'Tom Müller',
    createdAt: '2024-01-10',
    tags: ['ui', 'accessibility'],
  },
];

const statusConfig = {
  proposed: { label: 'Vorgeschlagen', color: 'bg-gray-500', icon: Circle },
  planned: { label: 'Geplant', color: 'bg-blue-500', icon: Clock },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'in-progress': { label: 'In Arbeit', color: 'bg-yellow-500', icon: AlertCircle },
  completed: { label: 'Fertig', color: 'bg-green-500', icon: CheckCircle2 },
  rejected: { label: 'Abgelehnt', color: 'bg-red-500', icon: Circle },
} as const;

const categoryConfig = {
  frontend: { label: 'Frontend', color: 'text-blue-600 bg-blue-100' },
  backend: { label: 'Backend', color: 'text-green-600 bg-green-100' },
  design: { label: 'Design', color: 'text-purple-600 bg-purple-100' },
  infrastructure: { label: 'Infrastruktur', color: 'text-orange-600 bg-orange-100' },
  other: { label: 'Sonstiges', color: 'text-gray-600 bg-gray-100' },
} as const;

/**
 * FeatureRequestWidget
 * @description Widget zur Verwaltung von Feature Requests
 */
export const FeatureRequestWidget = () => {
  const [filter, setFilter] = useState<FeatureStatus | 'all'>('all');
  const [features] = useState<Feature[]>(mockFeatures);

  const filteredFeatures = filter === 'all' ? features : features.filter(f => f.status === filter);

  return (
    <Container className="py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Feature Requests</h1>
              <p className="text-[var(--color-muted-foreground)]">
                Vorschläge und Ideen für neue Features
              </p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="mr-2 h-4 w-4" />
            Neuer Vorschlag
          </Button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger
            value="all"
            onClick={() => {
              setFilter('all');
            }}
          >
            Alle ({features.length})
          </TabsTrigger>
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = features.filter(f => f.status === key).length;
            return (
              <TabsTrigger
                key={key}
                value={key}
                onClick={() => {
                  setFilter(key as FeatureStatus);
                }}
              >
                {config.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Feature List */}
      <div className="space-y-4">
        {filteredFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="p-6 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <Badge className={cn('text-xs', categoryConfig[feature.category].color)}>
                      {categoryConfig[feature.category].label}
                    </Badge>
                    <StatusBadge status={feature.status} />
                  </div>
                  <p className="mb-3 text-[var(--color-muted-foreground)]">{feature.description}</p>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
                    <span>von {feature.author}</span>
                    <span>•</span>
                    <span>{new Date(feature.createdAt).toLocaleDateString('de-DE')}</span>
                    <span>•</span>
                    <div className="flex gap-2">
                      {feature.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    {feature.votes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {feature.comments}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

type StatusBadgeProps = {
  status: FeatureStatus;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className="text-xs">
      <Icon className={cn('mr-1 h-3 w-3', config.color)} />
      {config.label}
    </Badge>
  );
};
