import { MySQLConnection } from "@/infrastructure/database/MySQLConnection";
import { MySQLEventRepository } from "@/infrastructure/database/MySQLEventRepository";
import { MySQLMemberRepository } from "@/infrastructure/database/MySQLMemberRepository";
import { GetEventsUseCase } from "@/application/use-cases/GetEventsUseCase";
import { CreateEventUseCase } from "@/application/use-cases/CreateEventUseCase";
import { UpdateEventUseCase } from "@/application/use-cases/UpdateEventUseCase";
import { DeleteEventUseCase } from "@/application/use-cases/DeleteEventUseCase";
import { GetMembersUseCase } from "@/application/use-cases/GetMembersUseCase";
import { UpdateMemberUseCase } from "@/application/use-cases/UpdateMemberUseCase";
import { LoginUseCase } from "@/application/use-cases/LoginUseCase";
import { RefreshTokenUseCase } from "@/application/use-cases/RefreshTokenUseCase";
import { EventController } from "@/presentation/controllers/EventController";
import { MemberController } from "@/presentation/controllers/MemberController";
import { AuthController } from "@/presentation/controllers/AuthController";

export class Container {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  register(name: string, factory: () => any): void {
    this.factories.set(name, factory);
  }

  get(name: string): any {
    if (!this.services.has(name)) {
      const factory = this.factories.get(name);
      if (!factory) {
        throw new Error(`Service ${name} not registered`);
      }
      this.services.set(name, factory());
    }
    return this.services.get(name);
  }
}

export function setupContainer(): Container {
  const container = new Container();

  // Register Infrastructure
  container.register("Database", () => {
    return new MySQLConnection({
      host: process.env.DB_HOST || "mysql",
      user: process.env.DB_USER || "fanini",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "fanini_db",
    });
  });

  // Register Repositories
  container.register("EventRepository", () => {
    const db = container.get("Database");
    return new MySQLEventRepository(db);
  });

  container.register("MemberRepository", () => {
    const db = container.get("Database");
    return new MySQLMemberRepository(db);
  });

  // Register Use Cases
  container.register("GetEventsUseCase", () => {
    const repo = container.get("EventRepository");
    return new GetEventsUseCase(repo);
  });

  container.register("CreateEventUseCase", () => {
    const repo = container.get("EventRepository");
    return new CreateEventUseCase(repo);
  });

  container.register("UpdateEventUseCase", () => {
    const repo = container.get("EventRepository");
    return new UpdateEventUseCase(repo);
  });

  container.register("DeleteEventUseCase", () => {
    const repo = container.get("EventRepository");
    return new DeleteEventUseCase(repo);
  });

  container.register("GetMembersUseCase", () => {
    const repo = container.get("MemberRepository");
    return new GetMembersUseCase(repo);
  });

  container.register("UpdateMemberUseCase", () => {
    const repo = container.get("MemberRepository");
    return new UpdateMemberUseCase(repo);
  });

  container.register("LoginUseCase", () => {
    return new LoginUseCase();
  });

  container.register("RefreshTokenUseCase", () => {
    return new RefreshTokenUseCase();
  });

  // Register Controllers
  container.register("EventController", () => {
    const getEvents = container.get("GetEventsUseCase");
    const createEvent = container.get("CreateEventUseCase");
    const updateEvent = container.get("UpdateEventUseCase");
    const deleteEvent = container.get("DeleteEventUseCase");
    return new EventController(
      getEvents,
      createEvent,
      updateEvent,
      deleteEvent,
    );
  });

  container.register("MemberController", () => {
    const getMembers = container.get("GetMembersUseCase");
    const updateMember = container.get("UpdateMemberUseCase");
    return new MemberController(getMembers, updateMember);
  });

  container.register("AuthController", () => {
    const login = container.get("LoginUseCase");
    const refreshToken = container.get("RefreshTokenUseCase");
    return new AuthController(login, refreshToken);
  });

  return container;
}
