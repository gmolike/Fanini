// apps/api/src/presentation/controllers/auth/AuthController.ts
import { z } from "zod";
import {
  success,
  error,
  created,
  unauthorized,
} from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";
import { ERROR_CODES } from "@/presentation/helpers/responses/types";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

// Schema Definitionen
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  vorname: z.string().min(2),
  nachname: z.string().min(2),
  telefon: z.string().optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

/**
 * Authentication Controller
 * @description Handles authentication and authorization
 */
export class AuthController {
  constructor(
    private readonly authService: any, // AuthService direkt nutzen
    private readonly authRepository: IAuthRepository,
  ) {}

  /**
   * Login endpoint
   */
  login = withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const result = await this.authService.login(
      validated.email,
      validated.password,
    );

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

  /**
   * Register endpoint
   */
  register = withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    // TODO: Implement registration with EasyVerein
    return created(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
      },
      `/api/auth/verify`,
    );
  });

  /**
   * Refresh token endpoint
   */
  refresh = withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const { refreshToken } = refreshSchema.parse(body);

    const result = await this.authService.refreshToken(refreshToken);

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

  /**
   * Logout endpoint
   */
  logout = withErrorHandling(async (req: Request) => {
    const userId = (req as any).userId;

    if (!userId) {
      return unauthorized();
    }

    // Optional: Refresh Token aus Body
    let refreshToken: string | undefined;
    try {
      const body = await req.json();
      const validated = logoutSchema.parse(body);
      refreshToken = validated.refreshToken;
    } catch {
      // Body ist optional, Fehler ignorieren
    }

    if (refreshToken) {
      await this.authRepository.revokeRefreshToken(refreshToken, userId);
    } else {
      await this.authRepository.revokeAllUserRefreshTokens(userId, userId);
    }

    return success({
      message: refreshToken
        ? "Token successfully revoked"
        : "Logged out from all devices",
    });
  });
}
