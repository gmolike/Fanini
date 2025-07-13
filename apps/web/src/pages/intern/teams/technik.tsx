export const TechnikTeamRoute = createFileRoute('/intern/teams/technik')({
  component: () => (
    <TeamPage
      teamId="technik"
      teamName="Team Technik"
      teamDescription="IT-Support und technische Infrastruktur"
      icon={Laptop}
      color="from-indigo-500 to-indigo-600"
      features={[
        'System-Überwachung und Monitoring',
        'Backup-Verwaltung',
        'Technischer Support für Mitglieder',
        'API-Integrationen pflegen',
        'Sicherheits-Updates',
        'Performance-Optimierung',
      ]}
    />
  ),
});
