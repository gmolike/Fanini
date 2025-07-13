import { BaseRouter } from "../BaseRouter";
import { authMiddleware } from "@/presentation/middleware/auth";

export class TaskRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("TaskController");

    // Task CRUD
    this.addRoute({
      method: "POST",
      path: "/api/internal/tasks",
      handler: controller.createTask.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "PUT",
      path: "/api/internal/tasks/:id",
      handler: controller.updateTask.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "DELETE",
      path: "/api/internal/tasks/:id",
      handler: controller.deleteTask.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/internal/tasks/:id",
      handler: controller.getTaskById.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/internal/tasks",
      handler: controller.getTasks.bind(controller),
      middlewares: [authMiddleware],
    });

    // Task Assignment
    this.addRoute({
      method: "PATCH",
      path: "/api/internal/tasks/:id/assign",
      handler: controller.assignTask.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "DELETE",
      path: "/api/internal/tasks/:id/assign/:memberId",
      handler: controller.unassignMember.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/internal/tasks/my-tasks",
      handler: controller.getMyTasks.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/internal/tasks/member/:memberId",
      handler: controller.getTasksByMember.bind(controller),
      middlewares: [authMiddleware],
    });

    // Task Workflow
    this.addRoute({
      method: "PATCH",
      path: "/api/internal/tasks/:id/status",
      handler: controller.changeTaskStatus.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "POST",
      path: "/api/internal/tasks/:id/complete",
      handler: controller.completeTask.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "POST",
      path: "/api/internal/tasks/:id/block",
      handler: controller.blockTask.bind(controller),
      middlewares: [authMiddleware],
    });

    // Task Comments
    this.addRoute({
      method: "POST",
      path: "/api/internal/tasks/:id/comments",
      handler: controller.addComment.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/internal/tasks/:id/comments",
      handler: controller.getComments.bind(controller),
      middlewares: [authMiddleware],
    });

    // Context-specific
    this.addRoute({
      method: "GET",
      path: "/api/internal/events/:eventId/tasks",
      handler: controller.getTasksByEvent.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/internal/teams/:teamId/tasks",
      handler: controller.getTasksByTeam.bind(controller),
      middlewares: [authMiddleware],
    });

    // Templates
    this.addRoute({
      method: "POST",
      path: "/api/internal/tasks/create-from-template",
      handler: controller.createFromTemplate.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/internal/tasks/templates",
      handler: controller.getTemplates.bind(controller),
      middlewares: [authMiddleware],
    });
  }
}
