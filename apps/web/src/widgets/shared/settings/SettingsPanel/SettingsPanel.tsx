// frontend/src/widgets/settings/SettingsPanel/SettingsPanel.tsx
// Complete settings panel

import { Bell, Palette, ToggleLeft } from 'lucide-react';

import { ConfigureNotifications, ManageFeatureFlags, UpdateBranding } from '@/features/settings';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn';

export const SettingsPanel = () => {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground mt-2">
          Verwalte deine Vereinseinstellungen und Konfiguration
        </p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <ToggleLeft className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Benachrichtigungen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <UpdateBranding />
        </TabsContent>

        <TabsContent value="features">
          <ManageFeatureFlags />
        </TabsContent>

        <TabsContent value="notifications">
          <ConfigureNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};
