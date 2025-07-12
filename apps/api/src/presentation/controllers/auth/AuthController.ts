// src/presentation/controllers/auth/AuthController.ts
import { z } from "zod";
import type {
  LoginUseCase,
  RefreshTokenUseCase,
} from "@/application/use-cases/auth";

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

/**
 * Authentication Controller
 * @description Handles authentication and authorization
 */
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
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
   *                 example: "max@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 6
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: Erfolgreich angemeldet
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                       description: JWT Access Token
   *                     refreshToken:
   *                       type: string
   *                       description: Refresh Token
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                         email:
   *                           type: string
   *                         vorname:
   *                           type: string
   *                         nachname:
   *                           type: string
   *                         rolle:
   *                           type: string
   *       400:
   *         description: Validierungsfehler
   *       401:
   *         description: Ungültige Anmeldedaten
   */
  async login(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const validated = loginSchema.parse(body);

      const result = await this.loginUseCase.execute({
        email: validated.email,
        password: validated.password,
      });

      if (!result.success) {
        return Response.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 },
        );
      }

      return Response.json({
        success: true,
        data: {
          token: result.token,
          refreshToken: result.refreshToken,
          user: result.user,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      return Response.json(
        { success: false, error: "Login failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Neuen Benutzer registrieren
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
   *               - vorname
   *               - nachname
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "neu@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 6
   *                 example: "sicheresPasswort123"
   *               vorname:
   *                 type: string
   *                 minLength: 2
   *                 example: "Max"
   *               nachname:
   *                 type: string
   *                 minLength: 2
   *                 example: "Mustermann"
   *               telefon:
   *                 type: string
   *                 example: "+49 123 4567890"
   *     responses:
   *       201:
   *         description: Benutzer erfolgreich erstellt
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                   example: "Registration successful. Please check your email to verify your account."
   *       400:
   *         description: Validierungsfehler oder Benutzer existiert bereits
   *       500:
   *         description: Serverfehler
   */
  async register(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const validated = registerSchema.parse(body);

      // TODO: Implement registration with EasyVerein
      // For now, return success message
      return Response.json(
        {
          success: true,
          message:
            "Registration successful. Please check your email to verify your account.",
        },
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      return Response.json(
        { success: false, error: "Registration failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Access Token erneuern
   *     tags: ["🔐 Auth"]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: Der Refresh Token
   *     responses:
   *       200:
   *         description: Token erfolgreich erneuert
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                       description: Neuer JWT Access Token
   *                     refreshToken:
   *                       type: string
   *                       description: Neuer Refresh Token
   *       401:
   *         description: Ungültiger Refresh Token
   */
  async refresh(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const validated = refreshSchema.parse(body);

      const result = await this.refreshTokenUseCase.execute({
        refreshToken: validated.refreshToken,
      });

      if (!result.success) {
        return Response.json(
          { success: false, error: "Invalid refresh token" },
          { status: 401 },
        );
      }

      return Response.json({
        success: true,
        data: {
          token: result.token,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      return Response.json(
        { success: false, error: "Token refresh failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Benutzer abmelden
   *     tags: ["🔐 Auth"]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Erfolgreich abgemeldet
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                   example: "Logged out successfully"
   *       401:
   *         description: Nicht autorisiert
   */
  async logout(req: Request): Promise<Response> {
    try {
      // TODO: Invalidate refresh token in database
      return Response.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Logout failed" },
        { status: 500 },
      );
    }
  }
}
