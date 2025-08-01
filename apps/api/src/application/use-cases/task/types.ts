// use-cases/task/types.ts

import { TaskDetailDTO } from "@/application/dto/task";


export type GetTasksByPersonParams = {
  personId: string;
};

export type GetTasksByTeamParams = {
  teamId: string;
};

export type GetTasksByEventParams = {
  eventId: string;
};

export type GetTasksByPersonResult = {
  tasks: TaskDetailDTO[];
};

export type GetTasksByTeamResult = {
  tasks: TaskDetailDTO[];
};

export type GetTasksByEventResult = {
  tasks: TaskDetailDTO[];
};

export type GetTasksByPersonUseCase = (params: GetTasksByPersonParams) => Promise<GetTasksByPersonResult>;
export type GetTasksByTeamUseCase = (params: GetTasksByTeamParams) => Promise<GetTasksByTeamResult>;
export type GetTasksByEventUseCase = (params: GetTasksByEventParams) => Promise<GetTasksByEventResult>;
