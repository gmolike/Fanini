// frontend/src/app/providers/ChartProvider.tsx
import { ChartProvider as BaseChartProvider } from '@fanini/charts';

import { cn } from '@/shared/lib';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

export const ChartProvider = ({ children }: { children: React.ReactNode }) => (
  <BaseChartProvider
    dependencies={{
      cn,
      components: { Badge, Card, CardContent, CardHeader, CardTitle },
    }}
  >
    {children}
  </BaseChartProvider>
);
