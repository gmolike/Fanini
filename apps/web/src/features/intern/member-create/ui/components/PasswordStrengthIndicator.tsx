// apps/web/src/features/intern/member-create/ui/components/PasswordStrengthIndicator.tsx
import { useMemo } from 'react';

import { cn } from '@/shared/lib';

import { validatePassword } from '../../lib/password-utils';

type PasswordStrengthIndicatorProps = {
  password: string;
};

/**
 * PasswordStrengthIndicator Component
 *
 * @description Zeigt die Stärke des eingegebenen Passworts
 */
export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const { strength, errors } = useMemo(() => validatePassword(password), [password]);

  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  const strengthLabels = {
    weak: 'Schwach',
    medium: 'Mittel',
    strong: 'Stark',
  };

  // Determine width based on strength
  let width = '100%';
  if (strength === 'weak') {
    width = '33%';
  } else if (strength === 'medium') {
    width = '66%';
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
          <div
            className={cn('h-full transition-all duration-300', strengthColors[strength])}
            style={{
              width,
            }}
          />
        </div>
        <span className="text-sm font-medium">{strengthLabels[strength]}</span>
      </div>

      {errors.length > 0 && (
        <ul className="text-muted-foreground space-y-1 text-sm">
          {errors.map(error => (
            <li key={error}>• {error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
