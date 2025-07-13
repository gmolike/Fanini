import { Task, createTask } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { IPermissionService } from "@/domain/services/IPermissionService";

export type CreateTaskFromTemplateParams = {
  templateId: string;
  context_type: "event" | "team" | "general";
  context_id: string;
  anpassungen?: {
    titel?: string;
    frist?: string;
    verantwortlich_id?: string;
  };
  userId: string;
  userRole: string;
};

export class CreateTaskFromTemplateUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly permissionService: IPermissionService,
  ) {}

  async execute(params: CreateTaskFromTemplateParams): Promise<Task> {
    // 1. Template laden
    const template = await this.taskRepository.findById(params.templateId);
    if (!template || !template.istStandardaufgabe) {
      throw new Error("Vorlage nicht gefunden oder keine Standardaufgabe");
    }

    // 2. Berechtigung prüfen
    const canCreate = await this.permissionService.canCreateTask(
      params.userRole,
      params.context_type,
    );
    if (!canCreate) {
      throw new Error("Keine Berechtigung zum Erstellen von Aufgaben");
    }

    // 3. Neue Task aus Template erstellen
    const newTask = createTask({
      titel: params.anpassungen?.titel || template.titel,
      beschreibung: template.beschreibung,
      context: {
        type: params.context_type,
        id: params.context_id,
      },
      verantwortlichId:
        params.anpassungen?.verantwortlich_id || template.verantwortlichId,
      prioritaet: template.prioritaet,
      frist: params.anpassungen?.frist
        ? new Date(params.anpassungen.frist)
        : template.frist,
      erstelltVon: params.userId,
    });

    const fullTask: Omit<Task, "id" | "erstelltAm" | "aktualisiertAm"> = {
      ...newTask,
      materialien: [...template.materialien],
      kategorie: template.kategorie,
      istStandardaufgabe: false, // Neue Task ist keine Vorlage
    };

    return await this.taskRepository.create(fullTask);
  }
}
