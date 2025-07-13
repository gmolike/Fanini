// src/pages/intern/settings/admin.tsx
import { createFileRoute } from '@tanstack/react-router';
import { AlertCircle, Database, Globe, Key, Server, Shield } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/settings/admin')({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">
            Admin-Einstellungen
          </h1>
          <p className="text-muted-foreground mt-2">Systemweite Konfiguration und Verwaltung</p>
        </div>

        {/* Security Notice */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg">Administratorbereich</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Achtung: Änderungen in diesem Bereich betreffen das gesamte System. Nur autorisierte
              Administratoren haben Zugriff auf diese Funktionen.
            </p>
          </CardContent>
        </Card>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin-Panel entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Vollständige Kontrolle über alle System-Aspekte mit detaillierten
              Konfigurationsmöglichkeiten und Monitoring-Tools.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Admin Features */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Server className="mb-2 h-8 w-8 text-purple-600" />
              <CardTitle className="text-lg">System-Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Überwache die System-Performance</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Server-Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Backup</span>
                  <span className="font-medium">vor 2h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="mb-2 h-8 w-8 text-indigo-600" />
              <CardTitle className="text-lg">Datenbank</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Datenbank-Verwaltung und Wartung</p>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  Backup erstellen
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  Wartungsmodus
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  Logs anzeigen
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Key className="mb-2 h-8 w-8 text-amber-600" />
              <CardTitle className="text-lg">Sicherheit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Sicherheitseinstellungen</p>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">
                  2FA Config
                </Badge>
                <Badge variant="outline" className="mr-2">
                  API Keys
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Audit Log
                </Badge>
                <Badge variant="outline" className="mr-2">
                  IP Whitelist
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--color-fanini-blue)]" />
              Globale Einstellungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Feature Flags</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded border p-2">
                    <span className="text-sm">EasyVerein Integration</span>
                    <Badge variant="secondary">Phase 2</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded border p-2">
                    <span className="text-sm">Push Notifications</span>
                    <Badge variant="secondary">Geplant</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded border p-2">
                    <span className="text-sm">Advanced Analytics</span>
                    <Badge variant="secondary">Beta</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">System-Limits</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded border p-2">
                    <span className="text-sm">Max. Dateigröße</span>
                    <span className="text-sm font-medium">50 MB</span>
                  </div>
                  <div className="flex items-center justify-between rounded border p-2">
                    <span className="text-sm">API Rate Limit</span>
                    <span className="text-sm font-medium">1000/h</span>
                  </div>
                  <div className="flex items-center justify-between rounded border p-2">
                    <span className="text-sm">Session Timeout</span>
                    <span className="text-sm font-medium">24h</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
