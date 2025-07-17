// application/use-cases/auth/LoginUseCase.ts
import { AuthService } from "@/application/services/AuthService";

export type LoginUseCase = {
  execute: (params: {
    email: string;
    password: string;
  }) => ReturnType<AuthService["login"]>;
};
