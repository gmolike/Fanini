// frontend/src/features/public/team-history-detail/ui/NavigationBar.tsx
import { useEffect, useState } from 'react';

import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Gamepad2, Globe, Heart, MoreHorizontal, Users } from 'lucide-react';

import type { TeamHistoryYearResponse, TeamType } from '@/entities/public/team-history';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';

const TEAM_CONFIGS = {
  lol: { icon: Gamepad2, label: 'LoL' },
  baller: { icon: Users, label: 'Baller' },
  fanini: { icon: Heart, label: 'Fanini' },
  fern: { icon: Globe, label: 'Fern' },
  other: { icon: MoreHorizontal, label: 'Andere' },
} as const;

type NavigationBarProps = {
  yearData: TeamHistoryYearResponse;
  currentTeamType: TeamType;
  year: number;
};

export const NavigationBar = ({ yearData, currentTeamType, year }: NavigationBarProps) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400); // Erhöht auf 400 damit es später erscheint
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: isSticky ? 0 : -100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="border-border bg-background/95 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-4">
          {yearData.teams.map((team, index) => {
            const config = TEAM_CONFIGS[team.teamType as keyof typeof TEAM_CONFIGS];
            const Icon = config.icon;
            const isActive = currentTeamType === team.teamType;

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className={cn(
                    'flex-shrink-0 transition-all',
                    isActive &&
                      'bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]'
                  )}
                >
                  <Link
                    to="/historie/$year/$teamType"
                    params={{ year: String(year), teamType: team.teamType }}
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {config.label}
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
