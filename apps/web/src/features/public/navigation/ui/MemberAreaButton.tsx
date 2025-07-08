// frontend/src/features/navigation/member-area-button/MemberAreaButton.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

import { Button } from '@/shared/shadcn';

export const MemberAreaButton = () => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        className="border-0 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-white hover:opacity-90"
        asChild
      >
        <Link to="/app">
          <Users className="mr-2 h-4 w-4" />
          Mitgliederbereich
        </Link>
      </Button>
    </motion.div>
  );
};
