// frontend/src/features/public/team-history-detail/ui/TeamDetailCard.tsx
import { motion } from 'framer-motion';

import type { TeamHistoryEntry } from '@/entities/public/team-history';

import { BallerDetailSection } from './sections/BallerDetailSection';
import { FaniniDetailSection } from './sections/FaniniDetailSection';
import { FernDetailSection } from './sections/FernDetailSection';
import { LolDetailSection } from './sections/LolDetailSection';
import { OtherDetailSection } from './sections/OtherDetailSection';

type TeamDetailCardProps = {
  team: TeamHistoryEntry;
  year: number;
};

export const TeamDetailCard = ({ team, year }: TeamDetailCardProps) => {
  const renderSection = () => {
    switch (team.teamType) {
      case 'lol':
        return <LolDetailSection team={team} year={year} />;
      case 'baller':
        return <BallerDetailSection team={team} year={year} />;
      case 'fanini':
        return <FaniniDetailSection team={team} year={year} />;
      case 'fern':
        return <FernDetailSection team={team} year={year} />;
      case 'other':
        return <OtherDetailSection team={team} year={year} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {renderSection()}
    </motion.div>
  );
};
