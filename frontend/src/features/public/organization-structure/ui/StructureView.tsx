/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// frontend/src/features/public/organization-structure/ui/StructureView.tsx
import { Award, Building, FileText, Info, UserCheck, Users } from 'lucide-react';

import {
  type OrganizationNode,
  useBoardMembers,
  useOrganizationStructure,
} from '@/entities/public/organization';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';
import { LoadingState } from '@/shared/ui';

import { Structure } from './Structure';

/**
 * Zählt alle Mitglieder in der Organisationsstruktur rekursiv
 */
const countMembers = (node: OrganizationNode): number => {
  const count = node.members?.length ?? 0;
  if (Array.isArray(node.children) && node.children.length > 0) {
    return node.children.reduce(
      (acc: number, child: OrganizationNode) => acc + countMembers(child),
      count
    );
  }
  return count;
};

/**
 * Zählt alle Teams/Nodes in der Struktur
 */
const countNodes = (node: OrganizationNode, type?: string): number => {
  let count = 0;
  if (type) {
    count = node.type === type ? 1 : 0;
  } else {
    count = 1;
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    node.children.forEach((child: OrganizationNode) => {
      count += countNodes(child, type);
    });
  }
  return count;
};

/**
 * StructureView Feature
 * @description Zeigt die Organisationsstruktur als interaktives Diagramm mit Zusatzinfos
 */
export const StructureView = () => {
  const structureQuery = useOrganizationStructure();
  const boardQuery = useBoardMembers();

  return (
    <LoadingState query={structureQuery}>
      {response => {
        // Berechne Statistiken aus den echten Daten
        const { data } = response;
        const totalMembers = countMembers(data);
        const totalTeams = countNodes(data, 'team');
        const boardCount = boardQuery.data?.data.length ?? 0;
        const totalNodes = countNodes(data) - 1; // -1 für Root

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Organisationsstruktur</h2>
              <p className="text-muted-foreground mt-2">
                Die hierarchische Struktur unseres Vereins mit allen Gremien und Teams.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Structure data={response.data} />
              </div>

              <div className="space-y-4">
                <Card className="bg-[var(--color-card-light)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5" />
                      Vereinsstatistik
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Funktionsträger
                      </span>
                      <span className="font-semibold">{totalMembers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Gremien & Teams
                      </span>
                      <span className="font-semibold">{totalNodes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Aktive Teams
                      </span>
                      <span className="font-semibold">{totalTeams}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Vorstandsmitglieder
                      </span>
                      <span className="font-semibold">{boardCount}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Struktur-Details aus den Daten */}
                <Card className="bg-[var(--color-card-medium)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Info className="h-5 w-5" />
                      Struktur-Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {(data.children as OrganizationNode[] | undefined)?.map(child => (
                      <div key={child.id} className="space-y-2">
                        <h4 className="font-medium">{child.name}</h4>
                        <p className="text-muted-foreground">
                          {child.description ??
                            `${Number(child.members?.length ?? 0).toString()} Mitglieder`}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="bg-[var(--color-card-dark)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Weiterführende Infos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <button
                      onClick={() => {
                        const tabTrigger = document.querySelector('[value="documents"]');
                        if (tabTrigger instanceof HTMLElement) {
                          tabTrigger.click();
                        }
                      }}
                      className="flex items-center gap-2 text-sm text-[var(--color-fanini-blue)] hover:underline"
                    >
                      <Award className="h-4 w-4" />
                      Geschäftsordnung ansehen
                    </button>
                    <button
                      onClick={() => {
                        const tabTrigger = document.querySelector('[value="board"]');
                        if (tabTrigger instanceof HTMLElement) {
                          tabTrigger.click();
                        }
                      }}
                      className="flex items-center gap-2 text-sm text-[var(--color-fanini-blue)] hover:underline"
                    >
                      <Users className="h-4 w-4" />
                      Vorstand kennenlernen
                    </button>
                    <a
                      href="/app"
                      className="flex items-center gap-2 text-sm text-[var(--color-fanini-blue)] hover:underline"
                    >
                      <UserCheck className="h-4 w-4" />
                      Mitglied werden
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      }}
    </LoadingState>
  );
};
