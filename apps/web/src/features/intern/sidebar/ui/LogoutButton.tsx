// features/sidebar/ui/LogoutButton.tsx
import { LogOut } from 'lucide-react';

import { Button } from '@/shared/shadcn/button';

type LogoutButtonProps = {
  onLogout: () => void;
};

/**
 * Logout button for the sidebar
 * @param onLogout - Callback when logout is clicked
 * @returns Styled logout button
 */
export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <div className="border-t p-4">
      <Button
        onClick={onLogout}
        variant="ghost"
        className="w-full justify-start text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10 hover:text-[var(--color-destructive)]"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Abmelden
      </Button>
    </div>
  );
};
