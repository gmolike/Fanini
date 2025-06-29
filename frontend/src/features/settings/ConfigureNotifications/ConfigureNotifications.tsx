// frontend/src/features/settings/ConfigureNotifications/ConfigureNotifications.tsx
// Notifications component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn';

export const ConfigureNotifications = () => {
  // Placeholder für zukünftige Notification-Einstellungen
  return (
    <Card>
      <CardHeader>
        <CardTitle>Benachrichtigungen</CardTitle>
        <CardDescription>Verwalte deine Benachrichtigungseinstellungen</CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground'>
          Benachrichtigungseinstellungen werden in einer zukünftigen Version verfügbar sein.
        </p>
      </CardContent>
    </Card>
  );
};
