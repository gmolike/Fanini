// frontend/src/features/public/team-history-detail/ui/DetailHero.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Globe,
  Heart,
  MoreHorizontal,
  Users,
} from 'lucide-react';

import type { TeamHistoryEntry, TeamHistoryYearResponse } from '@/entities/public/team-history';

import { cn } from '@/shared/lib';
import { Badge, Button } from '@/shared/shadcn';
import { AnimatedNumber } from '@/shared/ui';

const TEAM_CONFIGS = {
  lol: {
    title: 'League of Legends',
    gradient: 'from-purple-500 to-pink-500',
    icon: Gamepad2,
  },
  baller: {
    title: 'Baller Liga',
    gradient: 'from-green-500 to-blue-500',
    icon: Users,
  },
  fanini: {
    title: 'Faninitiative',
    gradient: 'from-red-500 to-orange-500',
    icon: Heart,
  },
  fern: {
    title: 'Ferninitiative',
    gradient: 'from-blue-500 to-cyan-500',
    icon: Globe,
  },
  other: {
    title: 'Weitere Teams',
    gradient: 'from-gray-500 to-slate-500',
    icon: MoreHorizontal,
  },
} as const;

type DetailHeroProps = {
  team: TeamHistoryEntry;
  year: number;
  yearData?: TeamHistoryYearResponse; // Neu: für Team-Navigation
};

export const DetailHero = ({ team, year, yearData }: DetailHeroProps) => {
  const config =
    team.teamType in TEAM_CONFIGS
      ? TEAM_CONFIGS[team.teamType as keyof typeof TEAM_CONFIGS]
      : TEAM_CONFIGS.other;
  const Icon = config.icon;

  // Team-Navigation vorbereiten
  const teams = yearData?.teams ?? [];
  const currentIndex = teams.findIndex(t => t.teamType === team.teamType);
  const prevTeam = currentIndex > 0 ? teams[currentIndex - 1] : null;
  const nextTeam = currentIndex < teams.length - 1 ? teams[currentIndex + 1] : null;

  return (
    <motion.div
      className="relative min-h-[50vh] overflow-hidden"
      key={`hero-${team.teamType}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Gradient mit Animation */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-20`}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.8 }}
      />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex min-h-[50vh] items-center">
          <div className="w-full space-y-6">
            {/* Icon mit Bounce Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="flex justify-center"
            >
              <div className={`rounded-2xl bg-gradient-to-r p-6 ${config.gradient} shadow-2xl`}>
                <Icon className="h-16 w-16 text-white" />
              </div>
            </motion.div>

            {/* Title mit Text Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-center text-5xl font-bold text-transparent md:text-7xl`}
            >
              {config.title}
            </motion.h1>

            {/* Year Badge mit Slide Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center"
            >
              <Badge className="px-6 py-3 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                <AnimatedNumber value={year} />
              </Badge>
            </motion.div>

            {/* Team Navigation - NEU! */}
            {yearData && teams.length > 1 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                {/* Previous Team Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!prevTeam}
                  asChild={!!prevTeam}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  {prevTeam ? (
                    <Link
                      to="/historie/$year/$teamType"
                      params={{ year: String(year), teamType: prevTeam.teamType }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Link>
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </Button>

                {/* Team Pills */}
                <div className="flex items-center gap-2">
                  {teams.map(t => {
                    const isActive = t.teamType === team.teamType;
                    const teamConfig = TEAM_CONFIGS[t.teamType as keyof typeof TEAM_CONFIGS];
                    const TeamIcon = teamConfig.icon;

                    return (
                      <Link
                        key={t.id}
                        to="/historie/$year/$teamType"
                        params={{ year: String(year), teamType: t.teamType }}
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                          isActive
                            ? 'scale-110 bg-white/30 backdrop-blur-sm'
                            : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                        )}
                      >
                        <TeamIcon
                          className={cn('h-5 w-5', isActive ? 'text-white' : 'text-white/70')}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* Next Team Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!nextTeam}
                  asChild={!!nextTeam}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  {nextTeam ? (
                    <Link
                      to="/historie/$year/$teamType"
                      params={{ year: String(year), teamType: nextTeam.teamType }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
