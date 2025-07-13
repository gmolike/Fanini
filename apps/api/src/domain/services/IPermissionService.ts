// apps/api/src/domain/services/IPermissionService.ts
import { Event, EventStatus } from "../entities/Event";
import { Task, TaskStatus } from "../entities/Task";

export interface IPermissionService {
  canCreateEvent(userRole: string): Promise<boolean>;

  canEditEvent(
    userRole: string,
    userId: string,
    event: Event,
  ): Promise<boolean>;

  canDeleteEvent(
    userRole: string,
    userId: string,
    event: Event,
  ): Promise<boolean>;

  canChangeEventStatus(
    userRole: string,
    userId: string,
    event: Event,
    newStatus: EventStatus,
  ): Promise<boolean>;

  canViewInternalEvent(
    userRole: string,
    userId: string,
    event: Event,
  ): Promise<boolean>;
  // Task Permissions (new)
  canCreateTask(
    userRole: string,
    contextType: "event" | "team" | "general",
  ): Promise<boolean>;
  canEditTask(userRole: string, userId: string, task: Task): Promise<boolean>;
  canDeleteTask(userRole: string, userId: string, task: Task): Promise<boolean>;
  canChangeTaskStatus(
    userRole: string,
    userId: string,
    task: Task,
    newStatus: TaskStatus,
  ): Promise<boolean>;
  canAssignTask(userRole: string, userId: string, task: Task): Promise<boolean>;
  canViewTask(userRole: string, userId: string, task: Task): boolean;
}
