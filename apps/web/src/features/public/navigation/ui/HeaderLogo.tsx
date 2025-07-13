// frontend/src/features/navigation/header-logo/HeaderLogo.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

export const HeaderLogo = () => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link to="/" className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] opacity-50 blur-md" />
          <img
            src="/images/logo.png"
            alt="Faninitiative Spandau e.V."
            className="relative h-10 w-10 object-contain"
          />
        </div>
        <span className="hidden bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text font-[Bebas_Neue] text-xl text-transparent sm:block">
          Faninitiative Spandau
        </span>
      </Link>
    </motion.div>
  );
};
