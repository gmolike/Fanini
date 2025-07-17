// features/auth/ui/LoginForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle, LogIn, Shield } from 'lucide-react';

import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
} from '@/shared/shadcn';
import { Button } from '@/shared/ui';

import { loginWithCredentials } from '../api/authApi';

import type { LoginCredentials } from '../model/types';

/**
 * Login-Formular für EasyVerein Authentifizierung
 * Verwendet eigene Maske statt OAuth Redirect
 */
export const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const loginMutation = useMutation({
    mutationFn: loginWithCredentials,
    onSuccess: data => {
      // Token speichern
      localStorage.setItem('fanini-token', data.accessToken);
      if (rememberMe && data.refreshToken) {
        localStorage.setItem('fanini-refresh', data.refreshToken);
      }

      // Redirect basierend auf Rolle
      window.location.href = '/intern';
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4"
        >
          <Shield className="h-8 w-8 text-white" />
        </motion.div>
        <CardTitle className="text-center text-2xl">Anmeldung Mitgliederbereich</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Alert */}
          {loginMutation.isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <span>E-Mail oder Passwort ist falsch</span>
            </Alert>
          ) : null}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail (EasyVerein)</Label>
            <Input
              id="email"
              type="email"
              placeholder="deine@email.de"
              {...register('email', {
                required: 'E-Mail ist erforderlich',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Ungültige E-Mail-Adresse',
                },
              })}
              aria-invalid={!!errors.email}
            />
            {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              placeholder="Dein EasyVerein Passwort"
              {...register('password', {
                required: 'Passwort ist erforderlich',
              })}
              aria-invalid={!!errors.password}
            />
            {errors.password ? (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            ) : null}
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={checked => {
                setRememberMe(checked === true);
              }}
            />
            <Label htmlFor="remember" className="cursor-pointer">
              Angemeldet bleiben
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Anmelden
          </Button>
        </form>

        {/* Info Box */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-950">
          <p className="font-medium text-blue-900 dark:text-blue-100">ℹ️ Hinweis zur Anmeldung</p>
          <p className="mt-1 text-blue-700 dark:text-blue-300">
            Verwende deine EasyVerein Zugangsdaten. Nach der ersten Anmeldung werden deine
            Vereinsrollen automatisch zugewiesen.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
