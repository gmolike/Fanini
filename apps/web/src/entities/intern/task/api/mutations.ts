// entities/intern/task/api/mutations.ts
import { createRemoteMutation, queryClient } from '@/shared/api';

import {
  addTaskCommentSchema,
  assignTaskSchema,
  changeTaskStatusSchema,
  createTaskSchema,
  updateTaskSchema,
} from '../model/schemas';

import type {
  AddTaskCommentRequest,
  AssignTaskRequest,
  ChangeTaskStatusRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../model/types';

// Create Task
export const useCreateTask = createRemoteMutation<CreateTaskRequest>({
  endpoint: '/api/internal/tasks',
  method: 'POST',
  schema: createTaskSchema,
  onSuccess: () => {
    // Invalidate all task lists
    void queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});

// Update Task
type UpdateTaskParams = {
  id: string;
  data: UpdateTaskRequest;
};

export const useUpdateTask = createRemoteMutation<UpdateTaskParams>({
  endpoint: ({ id }) => `/api/internal/tasks/${id}`,
  method: 'PUT',
  schema: updateTaskSchema,
  transform: ({ data }) => data,
  onSuccess: (_, { id }) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', id] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
  },
});

// Delete Task
type DeleteTaskParams = {
  id: string;
};

export const useDeleteTask = createRemoteMutation<DeleteTaskParams>({
  endpoint: ({ id }) => `/api/internal/tasks/${id}`,
  method: 'DELETE',
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});

// Change Task Status
type ChangeStatusParams = {
  id: string;
  data: ChangeTaskStatusRequest;
};

export const useChangeTaskStatus = createRemoteMutation<ChangeStatusParams>({
  endpoint: ({ id }) => `/api/internal/tasks/${id}/status`,
  method: 'PATCH',
  schema: changeTaskStatusSchema,
  transform: ({ data }) => data,
  onSuccess: (_, { id }) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', id] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
  },
});

// Assign Task
type AssignTaskParams = {
  taskId: string;
  data: AssignTaskRequest;
};

export const useAssignTask = createRemoteMutation<AssignTaskParams>({
  endpoint: ({ taskId }) => `/api/internal/tasks/${taskId}/assign`,
  method: 'PATCH',
  schema: assignTaskSchema,
  transform: ({ data }) => data,
  onSuccess: (_, { taskId }) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
  },
});

// Unassign Member
type UnassignMemberParams = {
  taskId: string;
  memberId: string;
};

export const useUnassignMember = createRemoteMutation<UnassignMemberParams>({
  endpoint: ({ taskId, memberId }) => `/api/internal/tasks/${taskId}/assign/${memberId}`,
  method: 'DELETE',
  onSuccess: (_, { taskId }) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
  },
});

// Add Comment
type AddCommentParams = {
  taskId: string;
  data: AddTaskCommentRequest;
};

export const useAddTaskComment = createRemoteMutation<AddCommentParams>({
  endpoint: ({ taskId }) => `/api/internal/tasks/${taskId}/comments`,
  method: 'POST',
  schema: addTaskCommentSchema,
  transform: ({ data }) => data,
  onSuccess: (_, { taskId }) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', 'comments', taskId] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', taskId] });
  },
});

// Complete Task
type CompleteTaskParams = {
  id: string;
  kommentar?: string;
};

export const useCompleteTask = createRemoteMutation<CompleteTaskParams>({
  endpoint: ({ id }) => `/api/internal/tasks/${id}/complete`,
  method: 'POST',
  transform: ({ kommentar }) => ({ kommentar }),
  onSuccess: (_, { id }) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', id] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
  },
});

// Block Task
type BlockTaskParams = {
  id: string;
  grund: string;
};

export const useBlockTask = createRemoteMutation<BlockTaskParams>({
  endpoint: ({ id }) => `/api/internal/tasks/${id}/block`,
  method: 'POST',
  transform: ({ grund }) => ({ grund }),
  onSuccess: (_, { id }) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', id] });
    queryClient.invalidateQueries({ queryKey: ['tasks', 'list'] });
  },
});

// Create from Template
type CreateFromTemplateParams = {
  templateId: string;
  context_type: 'event' | 'team' | 'general';
  context_id: string;
  anpassungen?: {
    titel?: string;
    frist?: string;
    verantwortlich_id?: string;
  };
};

export const useCreateTaskFromTemplate = createRemoteMutation<CreateFromTemplateParams>({
  endpoint: '/api/internal/tasks/create-from-template',
  method: 'POST',
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});
