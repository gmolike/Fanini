// frontend/src/features/navigation/mobile-menu-trigger/MobileMenuTrigger.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

type MobileMenuTriggerProps = {
  isOpen: boolean;
  className?: string;
};

export const MobileMenuTrigger = ({ isOpen, className }: MobileMenuTriggerProps) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={className}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Menü öffnen</span>
    </motion.div>
  );
};
