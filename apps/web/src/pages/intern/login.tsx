// src/pages/intern/login.tsx
import { useState } from 'react';

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { LogIn, Shield, Users } from 'lucide-react';

import { Button } from '@/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import { Checkbox } from '@/shared/shadcn/checkbox';
import { Input } from '@/shared/shadcn/input';
import { Label } from '@/shared/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/select';

export const Route = createFileRoute('/intern/login')({
  component: LoginPage,
});

type TestUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  roleType: 'admin' | 'vorstand' | 'beirat' | 'team' | 'member';
  teams?: string[];
};

const TEST_USERS: TestUser[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@fanini.test',
    role: 'Administrator',
    roleType: 'admin',
  },
  {
    id: 'vorstand-1',
    name: 'Max Mustermann',
    email: 'vorstand@fanini.test',
    role: 'Vorstand',
    roleType: 'vorstand',
  },
  {
    id: 'beirat-1',
    name: 'Sarah Schmidt',
    email: 'beirat@fanini.test',
    role: 'Beirat',
    roleType: 'beirat',
  },
  {
    id: 'team-event-1',
    name: 'Tom Krause',
    email: 'team.event@fanini.test',
    role: 'Team Event',
    roleType: 'team',
    teams: ['event'],
  },
  {
    id: 'team-medien-1',
    name: 'Anna Meyer',
    email: 'team.medien@fanini.test',
    role: 'Team Medien',
    roleType: 'team',
    teams: ['medien'],
  },
  {
    id: 'member-1',
    name: 'Lisa Fischer',
    email: 'member@fanini.test',
    role: 'Mitglied',
    roleType: 'member',
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    const user = TEST_USERS.find(u => u.id === selectedUser);
    if (!user) return;

    // Store mock auth in localStorage
    const authData = {
      user,
      token: `mock-token-${user.id}`,
      expiresAt: rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    localStorage.setItem('fanini-auth', JSON.stringify(authData));

    // Navigate to dashboard
    navigate({ to: '/intern' });
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
            <CardDescription>Faninitiative Spandau e.V. - Interner Bereich</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Test User Selection */}
              <div className="space-y-2">
                <Label htmlFor="user">Test-Benutzer wählen</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger id="user">
                    <SelectValue placeholder="Wähle einen Test-Benutzer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_USERS.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          {user.roleType === 'admin' && (
                            <Shield className="h-4 w-4 text-purple-600" />
                          )}
                          {user.roleType === 'vorstand' && (
                            <Shield className="h-4 w-4 text-amber-600" />
                          )}
                          {user.roleType === 'beirat' && (
                            <Shield className="h-4 w-4 text-blue-600" />
                          )}
                          {user.roleType === 'team' && <Users className="h-4 w-4 text-green-600" />}
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground text-xs">
                              {user.role} - {user.email}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mock Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Passwort (Mock)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Beliebiges Passwort..."
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                />
                <p className="text-muted-foreground text-xs">
                  In Phase 1 wird jedes Passwort akzeptiert
                </p>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={checked => {
                    setRememberMe(checked as boolean);
                  }}
                />
                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                  Angemeldet bleiben
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] hover:opacity-90"
                disabled={!selectedUser}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Anmelden
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-950">
              <p className="mb-1 font-medium text-blue-900 dark:text-blue-100">
                🧪 Test-Modus (Phase 1)
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Dies ist eine Mock-Authentifizierung für Entwicklungszwecke. Die
                EasyVerein-Integration folgt in Phase 2.
              </p>
            </div>

            {/* Back to Public */}
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => navigate({ to: '/' })} className="text-sm">
                Zurück zur öffentlichen Seite
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
