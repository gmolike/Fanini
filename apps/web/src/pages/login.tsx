/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// apps/web/src/pages/login.tsx
// eslint-disable-next-line simple-import-sort/imports
import { useState } from 'react';

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { AlertCircle, LogIn, Shield } from 'lucide-react';

import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
} from '@/shared/shadcn';
import { loginWithCredentials } from '@/features/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = (await loginWithCredentials({ email, password })) as {
        accessToken: string;
        refreshToken?: string;
        user: {
          rollen: { name: string }[];
          [key: string]: unknown;
        };
      };

      // Token speichern
      localStorage.setItem('fanini-token', response.accessToken);
      if (rememberMe && response.refreshToken) {
        localStorage.setItem('fanini-refresh', response.refreshToken);
      }

      // User Daten speichern
      localStorage.setItem('fanini-user', JSON.stringify(response.user));

      // Redirect basierend auf Rolle

      void navigate({ to: '/intern' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-fanini-blue)]/5 via-transparent to-[var(--color-fanini-red)]/5 p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-blue)]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-red)]/10 blur-3xl delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Mitgliederbereich</CardTitle>
            <p className="text-muted-foreground">Faninitiative Spandau e.V. - Interner Bereich</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Alert */}
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </Alert>
              ) : null}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Dein Passwort"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={checked => {
                    setRememberMe(!!checked);
                  }}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="cursor-pointer">
                  Angemeldet bleiben
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Anmelden...</>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Anmelden
                  </>
                )}
              </Button>
            </form>

            {/* Info Boxes */}
            <div className="mt-6 space-y-3">
              {/* EasyVerein Info */}
              <div className="rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-950">
                <p className="font-medium text-blue-900 dark:text-blue-100">🔐 EasyVerein Login</p>
                <p className="mt-1 text-blue-700 dark:text-blue-300">
                  Verwende deine EasyVerein Zugangsdaten für die Anmeldung.
                </p>
              </div>

              {/* Dev Info - nur in Development */}
              {process.env['NODE_ENV'] === 'development' && (
                <div className="rounded-lg bg-amber-50 p-4 text-sm dark:bg-amber-950">
                  <p className="font-medium text-amber-900 dark:text-amber-100">
                    🧪 Test-Account (Dev)
                  </p>
                  <p className="mt-1 font-mono text-xs text-amber-700 dark:text-amber-300">
                    admin@fanini-spandau.de
                    <br />
                    FaniniAdmin2025!Secure#123
                  </p>
                </div>
              )}
            </div>

            {/* Back to Public */}
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => void navigate({ to: '/' })}
                className="text-sm"
                disabled={isLoading}
              >
                Zurück zur öffentlichen Seite
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
