import { Crown, Shield, Calendar, Camera, Users, Laptop } from 'lucide-react';

type TeamPageProps = {
  teamId: string;
  teamName: string;
  teamDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
};

function TeamPage({ teamName, teamDescription, icon: Icon, color, features }: TeamPageProps) {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={`inline-flex rounded-xl bg-gradient-to-r ${color} p-4`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">{teamName}</h1>
            <p className="text-muted-foreground mt-1">{teamDescription}</p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{teamName}-Dashboard entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein dedizierter Bereich für {teamName} mit spezialisierten Funktionen und Tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`rounded-full bg-gradient-to-r ${color} p-1`}>
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <p className="text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
