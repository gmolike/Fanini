import { generateId } from "@faninitiative/shared";

export type TaskComment = {
  id: string;
  taskId: string;
  autorId: string;
  text: string;
  erstelltAm: Date;
  erwaehntePersonen: string[];
};

export const createTaskComment = (params: {
  taskId: string;
  autorId: string;
  text: string;
  erwaehntePersonen?: string[];
}): TaskComment => ({
  id: generateId(),
  taskId: params.taskId,
  autorId: params.autorId,
  text: params.text,
  erstelltAm: new Date(),
  erwaehntePersonen: params.erwaehntePersonen || [],
});
