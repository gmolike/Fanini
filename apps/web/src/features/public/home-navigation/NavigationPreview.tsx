// frontend/src/features/public/home-navigation/NavigationPreview.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  Calendar,
  FileText,
  Image,
  type LucideIcon,
  Mail,
  Shield,
  Trophy,
  Users,
} from 'lucide-react';

import { Badge } from '@/shared/shadcn';
import { AnimatedValue, FloatingCard, GlassCard } from '@/shared/ui';

type NavigationItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  gradient: string;
};

/**
 * Navigation Preview für die Homepage
 * @description Zeigt alle wichtigen Bereiche der Anwendung
 */
export const NavigationPreview = () => {
  const navigationItems: NavigationItem[] = [
    {
      title: 'Events',
      description: 'Alle Veranstaltungen und Termine auf einen Blick',
      icon: Calendar,
      href: '/events',
      badge: 'Wichtig',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Newsletter',
      description: 'Aktuelle News und Updates aus dem Verein',
      icon: Mail,
      href: '/newsletter',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Über uns',
      description: 'Erfahre mehr über die Faninitiative',
      icon: Users,
      href: '/about',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      title: 'Satzung',
      description: 'Unsere Vereinssatzung und rechtliche Dokumente',
      icon: FileText,
      href: '/satzung',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Creator',
      description: 'Künstler und kreative Köpfe der Community',
      icon: Image,
      href: '/kreativ',
      gradient: 'from-pink-500 to-purple-500',
    },
    {
      title: 'History',
      description: 'EINTRACHT Spandau im Wandel der Zeit',
      icon: Trophy,
      href: '/historie',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-fanini-blue)]/5 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <AnimatedValue gradient>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Entdecke die Faninitiative</h2>
          </AnimatedValue>
          <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
            Alle Bereiche unserer Community auf einen Blick
          </p>
        </motion.div>

        {/* Navigation Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={item.href} className="block h-full">
                  <FloatingCard className="h-full">
                    <GlassCard className="group h-full cursor-pointer p-6 transition-all hover:scale-105">
                      <div className="mb-4 flex items-start justify-between">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`rounded-lg bg-gradient-to-br ${item.gradient} p-3`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </motion.div>
                        {item.badge ? (
                          <Badge variant={item.badge === 'Bald' ? 'secondary' : 'default'}>
                            {item.badge}
                          </Badge>
                        ) : null}
                      </div>

                      <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-[var(--color-fanini-blue)]">
                        {item.title}
                      </h3>
                      <p className="text-[var(--color-muted-foreground)]">{item.description}</p>

                      <motion.div className="mt-4 text-sm font-medium text-[var(--color-fanini-blue)] opacity-0 transition-opacity group-hover:opacity-100">
                        Mehr erfahren →
                      </motion.div>
                    </GlassCard>
                  </FloatingCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Member Area CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <FloatingCard>
            <Link to="/app">
              <GlassCard className="group inline-flex cursor-pointer items-center gap-4 p-8 transition-all hover:scale-105">
                <div className="rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-3">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="mb-1 text-xl font-semibold">Mitgliederbereich</h3>
                  <p className="text-[var(--color-muted-foreground)]">
                    Exklusiver Zugang für Vereinsmitglieder
                  </p>
                </div>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl"
                >
                  →
                </motion.span>
              </GlassCard>
            </Link>
          </FloatingCard>
        </motion.div>
      </div>
    </section>
  );
};
