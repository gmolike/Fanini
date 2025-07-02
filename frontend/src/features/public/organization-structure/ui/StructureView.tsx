// frontend/src/features/public/organization-structure/ui/StructureView.tsx
import { useOrganizationStructure } from '@/entities/public/organization';

import { LoadingState } from '@/shared/ui/feedback';

import { Structure } from './Structure';

/**
 * StructureView Feature
 * @description Zeigt die Organisationsstruktur als interaktives Diagramm
 */
export const StructureView = () => {
  const structureQuery = useOrganizationStructure();

  return (
    <LoadingState query={structureQuery}>
      {response => (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Organisationsstruktur</h2>
            <p className="text-muted-foreground mt-2">
              Die hierarchische Struktur unseres Vereins mit allen Gremien und Teams.
            </p>
          </div>

          <Structure data={response.data} />
        </div>
      )}
    </LoadingState>
  );
};
