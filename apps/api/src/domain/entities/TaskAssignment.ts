export type TaskAssignment = {
  taskId: string;
  mitgliedId: string;
  zugewiesenAm: Date;
  zugewiesenVon: string;
  kommentar?: string;
};
