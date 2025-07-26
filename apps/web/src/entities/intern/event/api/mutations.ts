// apps/web/src/entities/intern/event/api/mutations.ts
import { createRemoteMutation, queryClient } from '@/shared/api';

import { INTERNAL_EVENT_ENDPOINTS } from './endpoints';
import { createEventSchema, updateEventSchema, changeEventStatusSchema } from '../model/schemas';

import type {
  CreateEventRequest,
  UpdateEventRequest,
  ChangeEventStatusRequest,
} from '../model/types';

export const useCreateEvent = createRemoteMutation<CreateEventRequest>({
  endpoint: EVENT_ENDPOINTS.internal.create,
  method: 'POST',
  schema: createEventSchema,
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: ['events'] });
  },
});

export const useUpdateEvent = createRemoteMutation<UpdateEventRequest>({
  endpoint: ({ id }) => EVENT_ENDPOINTS.internal.update(id),
  method: 'PUT',
  schema: updateEventSchema,
  onSuccess: (_, { id }) => {
    void queryClient.invalidateQueries({ queryKey: ['events', 'detail', id] });
    void queryClient.invalidateQueries({ queryKey: ['events', 'list'] });
  },
});

export const useDeleteEvent = createRemoteMutation<{ id: string }>({
  endpoint: ({ id }) => EVENT_ENDPOINTS.internal.delete(id),
  method: 'DELETE',
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: ['events'] });
  },
});

export const useChangeEventStatus = createRemoteMutation<ChangeEventStatusRequest>({
  endpoint: ({ id }) => EVENT_ENDPOINTS.internal.status(id),
  method: 'PATCH',
  schema: changeEventStatusSchema,
  onSuccess: (_, { id }) => {
    void queryClient.invalidateQueries({ queryKey: ['events', 'detail', id] });
    void queryClient.invalidateQueries({ queryKey: ['events', 'list'] });
  },
});
