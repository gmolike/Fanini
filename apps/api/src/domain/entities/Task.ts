import { generateId } from "@faninitiative/shared";

export type TaskContext = {
  type: 'event' | 'team' | 'general';
  id: string | null;
};

export type TaskPriority = 'niedrig' | 'mittel' | 'hoch' | 'kritisch';
export type TaskStatus = 'offen' | 'in_bearbeitung' | 'review' | 'erledigt' | 'blockiert';

export type TaskMaterial = {
  name: string;
  menge: number;
  einheit: string;
  beschreibung?: string;
  besorgt: boolean;
};

export type Task = {
  id: string;
  titel: string;
  beschreibung?: string;
  context: TaskContext;
  verantwortlichId?: string;
  zugewiesenAn: string[];
  status: TaskStatus;
  prioritaet: TaskPriority;
  frist?: Date;
  materialien: TaskMaterial[];
  abhaengigVon?: string[];
  istStandardaufgabe: boolean;
  kategorie?: string;
  erstelltVon: string;
  erstelltAm: Date;
  aktualisiertAm: Date;
  erledigtAm?: Date;
  erledigtVon?: string;
  geloescht: boolean;
};

export const createTask = (params: {
  titel: string;
  beschreibung?: string;
  context: TaskContext;
  verantwortlichId?: string;
  prioritaet?: TaskPriority;
  frist?: Date;
  erstelltVon: string;
}): Task => {
  const now = new Date();
  return {
    id: generateId(),
    titel: params.titel,
    beschreibung: params.beschreibung,
    context: params.context,
    verantwortlichId: params.verantwortlichId,
    zugewiesenAn: params.verantwortlichId ? [params.verantwortlichId] : [],
    status: 'offen',
    prioritaet: params.prioritaet || 'mittel',
    frist: params.frist,
    materialien: [],
    abhaengigVon: undefined,
    istStandardaufgabe: false,
    kategorie: undefined,
    erstelltVon: params.erstelltVon,
    erstelltAm: now,
    aktualisiertAm: now,
    erledigtAm: undefined,
    erledigtVon: undefined,
    geloescht: false
  };
};

export const canTaskBeEditedBy = (task: Task, userId: string): boolean => {
  return task.verantwortlichId === userId ||
         task.zugewiesenAn.includes(userId) ||
         task.erstelltVon === userId;
};

export const isTaskBlocked = (task: Task, allTasks: Task[]): boolean => {
  if (!task.abhaengigVon || task.abhaengigVon.length === 0) return false;

  const dependencies = allTasks.filter(t => task.abhaengigVon!.includes(t.id));
  return dependencies.some(dep => dep.status !== 'erledigt');
};

export const taskToJSON = (task: Task) => ({
  id: task.id,
  titel: task.titel,
  beschreibung: task.beschreibung,
  context: task.context,
  verantwortlichId: task.verantwortlichId,
  zugewiesenAn: task.zugewiesenAn,
  status: task.status,
  prioritaet: task.prioritaet,
  frist: task.frist?.toISOString(),
  materialien: task.materialien,
  abhaengigVon: task.abhaengigVon,
  istStandardaufgabe: task.istStandardaufgabe,
  kategorie: task.kategorie,
  erstelltAm: task.erstelltAm.toISOString(),
  aktualisiertAm: task.aktualisiertAm.toISOString(),
  erledigtAm: task.erledigtAm?.toISOString(),
  erledigtVon: task.erledigtVon
});
