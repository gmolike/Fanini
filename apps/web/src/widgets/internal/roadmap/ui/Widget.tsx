import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';

import { Badge, Progress } from '@/shared/shadcn';
import { Container, GlassCard } from '@/shared/ui';

type RoadmapPhase = {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  startDate: string;
  endDate: string;
  features: {
    title: string;
    completed: boolean;
  }[];
};

const roadmapData: RoadmapPhase[] = [
  {
    id: '1',
    title: 'Phase 1: Grundfunktionen',
    description: 'Basis-Features für die Mitgliederverwaltung',
    status: 'completed',
    progress: 100,
    startDate: '2025-06',
    endDate: '20245-08',
    features: [
      { title: 'Login/Logout', completed: true },
      { title: 'Mitgliederliste', completed: true },
      { title: 'Event-Übersicht', completed: true },
      { title: 'Dashboard', completed: true },
    ],
  },
  {
    id: '2',
    title: 'Phase 2: Event Management',
    description: 'Vollständige Event-Verwaltung mit Anmeldungen',
    status: 'in-progress',
    progress: 65,
    startDate: '2024-07',
    endDate: '2024-09',
    features: [
      { title: 'Event erstellen/bearbeiten', completed: true },
      { title: 'Anmeldesystem', completed: true },
      { title: 'Aufgabenverwaltung', completed: false },
      { title: 'Budget-Tracking', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Phase 3: Kommunikation',
    description: 'Interne Kommunikation und Benachrichtigungen',
    status: 'planned',
    progress: 0,
    startDate: '2024-09',
    endDate: '2024-10',
    features: [
      { title: 'Benachrichtigungssystem', completed: false },
      { title: 'Kommentarfunktion', completed: false },
      { title: 'Team-Chat', completed: false },
      { title: 'Email-Integration', completed: false },
    ],
  },
];

/**
 * RoadmapWidget
 * @description Zeigt die Entwicklungs-Roadmap mit Timeline
 */
export const RoadmapWidget = () => {
  return (
    <Container className="py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-3">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Entwicklungs-Roadmap</h1>
            <p className="text-[var(--color-muted-foreground)]">
              Geplante Features und Entwicklungsphasen
            </p>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-8">
        {roadmapData.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Timeline Line */}
            {index < roadmapData.length - 1 && (
              <div className="absolute top-12 left-6 h-full w-0.5 bg-[var(--color-border)]" />
            )}

            <div className="flex gap-4">
              {/* Timeline Dot */}
              <div className="relative z-10">
                {(() => {
                  let bgColor = '';
                  let IconComponent;
                  if (phase.status === 'completed') {
                    bgColor = 'bg-green-500';
                    IconComponent = CheckCircle2;
                  } else if (phase.status === 'in-progress') {
                    bgColor = 'bg-yellow-500';
                    IconComponent = Clock;
                  } else {
                    bgColor = 'bg-gray-400';
                    IconComponent = Circle;
                  }
                  return (
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor}`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  );
                })()}
              </div>

              {/* Content */}
              <GlassCard className="flex-1 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-xl font-semibold">{phase.title}</h3>
                    <p className="text-[var(--color-muted-foreground)]">{phase.description}</p>
                  </div>
                  {(() => {
                    let badgeVariant: 'default' | 'secondary' | 'outline';
                    let badgeLabel: string;
                    if (phase.status === 'completed') {
                      badgeVariant = 'default';
                      badgeLabel = 'Abgeschlossen';
                    } else if (phase.status === 'in-progress') {
                      badgeVariant = 'secondary';
                      badgeLabel = 'In Arbeit';
                    } else {
                      badgeVariant = 'outline';
                      badgeLabel = 'Geplant';
                    }
                    return <Badge variant={badgeVariant}>{badgeLabel}</Badge>;
                  })()}
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)]">
                      {phase.startDate} - {phase.endDate}
                    </span>
                    <span className="font-medium">{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {phase.features.map(feature => (
                    <div key={feature.title} className="flex items-center gap-2 text-sm">
                      {feature.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                      )}
                      <span
                        className={
                          feature.completed
                            ? 'text-[var(--color-muted-foreground)] line-through'
                            : ''
                        }
                      >
                        {feature.title}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};
