// entities/intern/task/api/queries.ts
import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';

import {
  taskCommentListResponseSchema,
  taskDetailResponseSchema,
  taskFilterSchema,
  taskListResponseSchema,
} from '../model/schemas';

import type { TaskDetailResponse, TaskFilter, TaskListResponse } from '../model/types';

// My Tasks Query
export const useMyTasks = createSimpleRemoteQuery<TaskListResponse>({
  queryKey: ['tasks', 'my-tasks'],
  endpoint: '/api/internal/tasks/my-tasks',
  schema: taskListResponseSchema,
  staleTime: 1000 * 60 * 2, // 2 minutes
});

// Task List with Filters
type TaskListParams = {
  filters?: TaskFilter;
};

export const useTaskList = createRemoteQuery<TaskListResponse, TaskListParams>({
  queryKey: ({ filters }) => ['tasks', 'list', filters],
  endpoint: ({ filters }) => {
    const params = new URLSearchParams();

    if (filters?.contextType) params.append('contextType', filters.contextType);
    if (filters?.contextId) params.append('contextId', filters.contextId);
    if (filters?.status)
      filters.status.forEach(s => {
        params.append('status', s);
      });
    if (filters?.prioritaet)
      filters.prioritaet.forEach(p => {
        params.append('prioritaet', p);
      });
    if (filters?.nurMeine) params.append('nurMeine', 'true');
    if (filters?.verantwortlichId) params.append('verantwortlichId', filters.verantwortlichId);
    if (filters?.kategorie) params.append('kategorie', filters.kategorie);

    return `/api/internal/tasks${params.toString() ? `?${params.toString()}` : ''}`;
  },
  schema: taskListResponseSchema,
  staleTime: 1000 * 60 * 2,
});

// Task Detail Query
type TaskDetailParams = {
  taskId: string;
};

export const useTaskDetail = createRemoteQuery<TaskDetailResponse, TaskDetailParams>({
  queryKey: ({ taskId }) => ['tasks', 'detail', taskId],
  endpoint: ({ taskId }) => `/api/internal/tasks/${taskId}`,
  schema: taskDetailResponseSchema,
  staleTime: 1000 * 60 * 5,
  enabled: ({ taskId }) => !!taskId,
});

// Tasks by Event
type TasksByEventParams = {
  eventId: string;
};

export const useTasksByEvent = createRemoteQuery<TaskListResponse, TasksByEventParams>({
  queryKey: ({ eventId }) => ['tasks', 'by-event', eventId],
  endpoint: ({ eventId }) => `/api/internal/events/${eventId}/tasks`,
  schema: taskListResponseSchema,
  staleTime: 1000 * 60 * 2,
  enabled: ({ eventId }) => !!eventId,
});

// Tasks by Team
type TasksByTeamParams = {
  teamId: string;
};

export const useTasksByTeam = createRemoteQuery<TaskListResponse, TasksByTeamParams>({
  queryKey: ({ teamId }) => ['tasks', 'by-team', teamId],
  endpoint: ({ teamId }) => `/api/internal/teams/${teamId}/tasks`,
  schema: taskListResponseSchema,
  staleTime: 1000 * 60 * 2,
  enabled: ({ teamId }) => !!teamId,
});

// Tasks by Member
type TasksByMemberParams = {
  memberId: string;
};

export const useTasksByMember = createRemoteQuery<TaskListResponse, TasksByMemberParams>({
  queryKey: ({ memberId }) => ['tasks', 'by-member', memberId],
  endpoint: ({ memberId }) => `/api/internal/tasks/member/${memberId}`,
  schema: taskListResponseSchema,
  staleTime: 1000 * 60 * 2,
  enabled: ({ memberId }) => !!memberId,
});

// Task Comments
type TaskCommentsParams = {
  taskId: string;
};

export const useTaskComments = createRemoteQuery<
  z.infer<typeof taskCommentListResponseSchema>,
  TaskCommentsParams
>({
  queryKey: ({ taskId }) => ['tasks', 'comments', taskId],
  endpoint: ({ taskId }) => `/api/internal/tasks/${taskId}/comments`,
  schema: taskCommentListResponseSchema,
  staleTime: 1000 * 60 * 2,
  enabled: ({ taskId }) => !!taskId,
});

// Task Templates
type TaskTemplatesParams = {
  kategorie?: string;
};

export const useTaskTemplates = createRemoteQuery<TaskListResponse, TaskTemplatesParams>({
  queryKey: ({ kategorie }) => ['tasks', 'templates', kategorie],
  endpoint: ({ kategorie }) => {
    const params = kategorie ? `?kategorie=${kategorie}` : '';
    return `/api/internal/tasks/templates${params}`;
  },
  schema: taskListResponseSchema,
  staleTime: 1000 * 60 * 10,
});
