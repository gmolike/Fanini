/* eslint-disable unicorn/filename-case */
import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn';

import type { RACIMatrixProps, RACIRole } from './types';

/**
 * RACIMatrix
 * @description Zeigt eine RACI-Verantwortlichkeitsmatrix
 * @param {RACIAssignment[]} assignments - Array von Aufgabenzuweisungen
 * @param {string[]} people - Array von Personen
 * @param {Function} onCellClick - Callback bei Klick auf eine Zelle
 * @param {string} className - Zusätzliche CSS-Klassen
 * @example
 * ```tsx
 * <RACIMatrix
 *   assignments={[
 *     {
 *       taskId: '1',
 *       taskName: 'Event planen',
 *       assignments: new Map([
 *         ['Max', 'responsible'],
 *         ['Anna', 'accountable']
 *       ])
 *     }
 *   ]}
 *   people={['Max', 'Anna', 'Tom']}
 * />
 * ```
 */
export const RACIMatrix = ({ assignments, people, onCellClick, className }: RACIMatrixProps) => {
  const getRoleConfig = (role: RACIRole | undefined) => {
    const configs = {
      responsible: {
        label: 'R',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Durchführungsverantwortlich',
      },
      accountable: {
        label: 'A',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Ergebnisverantwortlich',
      },
      consulted: {
        label: 'C',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        description: 'Beratend',
      },
      informed: {
        label: 'I',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        description: 'Zu informieren',
      },
    };
    return role ? configs[role] : null;
  };

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-background sticky left-0 z-10 border-b p-4 text-left font-semibold">
              Aufgabe
            </th>
            {people.map(person => (
              <th key={person} className="border-b border-l p-4 text-center font-medium">
                {person}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignments.map(assignment => (
            <tr key={assignment.taskId} className="group">
              <td className="bg-background group-hover:bg-muted/50 sticky left-0 z-10 border-b p-4 font-medium">
                {assignment.taskName}
              </td>
              {people.map(person => {
                const role = assignment.assignments.get(person);
                const config = getRoleConfig(role);

                return (
                  <td
                    key={`${assignment.taskId}-${person}`}
                    className="hover:bg-muted/50 border-b border-l p-4 text-center"
                  >
                    {config ? (
                      <button
                        onClick={() => onCellClick?.(assignment.taskName, person, role!)}
                        className="group/badge"
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-8 w-8 justify-center font-bold transition-all',
                            config.color,
                            'group-hover/badge:scale-110'
                          )}
                          title={config.description}
                        >
                          {config.label}
                        </Badge>
                      </button>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legende */}
      <div className="mt-6 flex flex-wrap gap-4 border-t pt-4">
        <h4 className="w-full text-sm font-semibold">Legende:</h4>
        {(['responsible', 'accountable', 'consulted', 'informed'] as const).map(role => {
          const config = getRoleConfig(role)!;
          return (
            <div key={role} className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn('h-6 w-6 justify-center text-xs font-bold', config.color)}
              >
                {config.label}
              </Badge>
              <span className="text-muted-foreground text-sm">{config.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
