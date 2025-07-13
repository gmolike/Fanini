// CRUD Operations
export { CreateTaskUseCase } from './CreateTask';
export { UpdateTaskUseCase } from './UpdateTask';
export { DeleteTaskUseCase } from './DeleteTask';
export { GetTaskByIdUseCase } from './GetTaskById';
export { GetTasksUseCase } from './GetTasks';

// Task Assignment
export { AssignTaskUseCase } from './AssignTask';
export { UnassignMemberUseCase } from './UnassignMember';
export { GetMyTasksUseCase } from './GetMyTasks';
export { GetTasksByMemberUseCase } from './GetTasksByMember';

// Task Workflow
export { ChangeTaskStatusUseCase } from './ChangeTaskStatus';
export { CompleteTaskUseCase } from './CompleteTask';
export { BlockTaskUseCase } from './BlockTask';

// Task Relations
export { GetTasksByEventUseCase } from './GetTasksByEvent';
export { GetTasksByTeamUseCase } from './GetTasksByTeam';
export { CreateTaskFromTemplateUseCase } from './CreateTaskFromTemplate';

// Task Communication
export { AddTaskCommentUseCase } from './AddTaskComment';
export { GetTaskCommentsUseCase } from './GetTaskComments';
export { NotifyTaskAssigneesUseCase } from './NotifyTaskAssignees';

// Types
export type { CreateTaskParams } from './CreateTask';
export type { UpdateTaskParams } from './UpdateTask';
export type { TaskWithDetails } from './GetTaskById';
