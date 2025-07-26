// apps/api/src/presentation/controllers/auth/AuthController.ts
import { z } from "zod";
import {
  success,
  error,
  withErrorHandling,
  ERROR_CODES,
} from "@/presentation/helpers/responses";
import type {
  LoginUseCase,
  RefreshTokenUseCase,
} from "@/application/use-cases/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  login = withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const result = await this.loginUseCase.execute({
      email: validated.email,
      password: validated.password,
    });

    if (!result.success) {
      return error(
        result.error || "Invalid credentials",
        ERROR_CODES.INVALID_CREDENTIALS,
        401,
      );
    }

    return success({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  });

  refresh = withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const { refreshToken } = refreshSchema.parse(body);

    const result = await this.refreshTokenUseCase.execute({ refreshToken });

    if (!result.success) {
      return error(
        result.error || "Invalid refresh token",
        ERROR_CODES.INVALID_TOKEN,
        401,
      );
    }

    return success({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  });

  logout = withErrorHandling(async (req: Request) => {
    const userId = (req as any).userId;

    if (!userId) {
      return error("Unauthorized", ERROR_CODES.UNAUTHORIZED, 401);
    }

    // Logout logic here

    return success({ message: "Logged out successfully" });
  });
}
