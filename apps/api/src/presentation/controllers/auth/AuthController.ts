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
import type {
  LoginUseCase,
  RefreshTokenUseCase,
} from "@/application/use-cases/auth";
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
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly authRepository?: IAuthRepository,
  ) {}

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Benutzer anmelden
   *     tags: ["🔐 Auth"]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 6
   */
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

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Neuen Benutzer registrieren
   *     tags: ["🔐 Auth"]
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
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Access Token erneuern
   *     tags: ["🔐 Auth"]
   */
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

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Benutzer abmelden
   *     tags: ["🔐 Auth"]
   *     security:
   *       - bearerAuth: []
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

    if (this.authRepository) {
      if (refreshToken) {
        await this.authRepository.revokeRefreshToken(refreshToken, userId);
      } else {
        await this.authRepository.revokeAllUserRefreshTokens(userId, userId);
      }
    }

    return success({
      message: refreshToken
        ? "Token successfully revoked"
        : "Logged out from all devices",
    });
  });
}
