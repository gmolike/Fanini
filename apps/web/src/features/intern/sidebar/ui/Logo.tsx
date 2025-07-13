// features/sidebar/ui/Logo.tsx
import { Link } from '@tanstack/react-router';

/**
 * Logo component for the sidebar
 * @returns Logo with Faninitiative branding
 */
export const Logo = () => {
  return (
    <div className="flex h-16 items-center border-b px-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] font-bold text-white">
          F
        </div>
        <span className="font-[Bebas_Neue] text-xl">Faninitiative</span>
      </Link>
    </div>
  );
};
