import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Code2,
  GitBranch,
  Layers,
  Package,
  Palette,
  Rocket,
} from 'lucide-react';

import { AnimatedValue, Container, GlassCard } from '@/shared/ui';

const stats = [
  { label: 'Frontend Entities', value: 19, icon: Layers, color: 'text-blue-500' },
  { label: 'Backend Entities', value: 15, icon: Package, color: 'text-green-500' },
  { label: 'Shared Components', value: 42, icon: Palette, color: 'text-purple-500' },
  { label: 'Features', value: 28, icon: Rocket, color: 'text-orange-500' },
] as const;

const quickLinks = [
  {
    title: 'Storybook',
    description: 'Komponenten-Katalog und Playground',
    icon: Palette,
    href: '/intern/dev/storybook',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Feature Requests',
    description: 'Neue Features vorschlagen und verwalten',
    icon: Rocket,
    href: '/intern/dev/features',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Roadmap',
    description: 'Geplante Features und Timeline',
    icon: Calendar,
    href: '/intern/dev/roadmap',
    color: 'from-green-500 to-emerald-500',
  },
] as const;

/**
 * DevDashboard Widget
 * @description Dashboard für Entwickler mit Übersicht über Frontend/Backend Status
 */
export const DevDashboard = () => {
  return (
    <Container className="py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-3">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-[var(--color-muted-foreground)]">
              Übersicht über die Faninitiative Webseite Entwicklung
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <GlassCard className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <AnimatedValue value={stat.value} className="text-2xl font-bold" />
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)]">{stat.label}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 grid gap-6 lg:grid-cols-3"
      >
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link to={link.href}>
                <GlassCard className="group p-6 transition-all hover:shadow-lg">
                  <div className={`inline-flex rounded-lg bg-gradient-to-r p-3 ${link.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-[var(--color-fanini-blue)]">
                    {link.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{link.description}</p>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Architecture Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Frontend Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Frontend Status</h2>
            </div>
            <div className="space-y-3">
              <StatusItem label="Public Pages" status="complete" count={12} />
              <StatusItem label="Internal Pages" status="in-progress" count={8} />
              <StatusItem label="Shared Components" status="complete" count={42} />
              <StatusItem label="Features" status="in-progress" count={28} />
              <StatusItem label="Entities" status="complete" count={19} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Backend Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-semibold">Backend Status</h2>
            </div>
            <div className="space-y-3">
              <StatusItem label="Domain Entities" status="complete" count={5} />
              <StatusItem label="Use Cases" status="in-progress" count={12} />
              <StatusItem label="API Endpoints" status="in-progress" count={18} />
              <StatusItem label="External Integrations" status="partial" count={3} />
              <StatusItem label="Infrastructure" status="complete" count={8} />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Container>
  );
};

type StatusItemProps = {
  label: string;
  status: 'complete' | 'in-progress' | 'partial';
  count: number;
};

const StatusItem = ({ label, status, count }: StatusItemProps) => {
  const statusConfig = {
    complete: { color: 'text-green-500', icon: CheckCircle2, text: 'Fertig' },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'in-progress': { color: 'text-yellow-500', icon: Code2, text: 'In Arbeit' },
    partial: { color: 'text-orange-500', icon: GitBranch, text: 'Teilweise' },
  } as const;

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{count}</span>
        <Icon className={`h-4 w-4 ${config.color}`} />
        <span className={`text-xs ${config.color}`}>{config.text}</span>
      </div>
    </div>
  );
};
