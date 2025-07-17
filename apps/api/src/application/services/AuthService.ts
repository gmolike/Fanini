// apps/api/src/application/services/AuthService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import type { User, UserRole } from "@/domain/entities/User";
import { IAuthRepository } from "@/domain/repositories/IAuthRepository";

type LoginResult = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    vorname: string;
    nachname: string;
    rollen: UserRole[];
  };
  error?: string;
};

type EasyVereinConfig = {
  clientId: string;
  clientSecret: string;
  apiUrl: string;
};

export class AuthService {
  constructor(
    private authRepo: IAuthRepository,
    private easyVereinConfig: EasyVereinConfig,
    private jwtSecret: string,
  ) {}

  /**
   * Login mit E-Mail und Passwort
   * Prüft zuerst lokale User, dann EasyVerein
   */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // 1. Prüfe ob lokaler User existiert
      let user = await this.authRepo.findUserByEmail(email);

      if (user && user.authSource === "local") {
        // Lokaler User - Passwort prüfen
        if (!user.passwordHash) {
          return { success: false, error: "Kein Passwort gesetzt" };
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          return { success: false, error: "Ungültige Anmeldedaten" };
        }
      } else {
        // 2. Versuche EasyVerein Login
        const easyVereinUser = await this.authenticateWithEasyVerein(
          email,
          password,
        );

        if (!easyVereinUser) {
          return { success: false, error: "Ungültige Anmeldedaten" };
        }

        // 3. User in DB anlegen/aktualisieren
        user = await this.syncEasyVereinUser(easyVereinUser);
      }

      // 4. Rollen laden
      const roles = await this.authRepo.getUserRoles(user.id);

      // 5. JWT erstellen
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: `${user.vorname} ${user.nachname}`,
        roles: roles.map((r) => r.name),
        authSource: user.authSource,
      };

      const accessToken = jwt.sign(tokenPayload, this.jwtSecret, {
        expiresIn: "24h",
      });

      const refreshToken = jwt.sign(
        { userId: user.id, type: "refresh" },
        this.jwtSecret,
        { expiresIn: "30d" },
      );

      // 6. Login-Zeit aktualisieren
      await this.authRepo.updateLastLogin(user.id);

      return {
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          vorname: user.vorname,
          nachname: user.nachname,
          rollen: roles,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login fehlgeschlagen" };
    }
  }

  /**
   * Token erneuern mit Refresh Token
   */
  async refreshToken(refreshToken: string): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtSecret) as any;

      if (!decoded.userId || decoded.type !== "refresh") {
        return { success: false, error: "Ungültiger Refresh Token" };
      }

      // Get user and roles
      const user = await this.authRepo.findUserById(decoded.userId);
      if (!user || !user.istAktiv) {
        return { success: false, error: "User nicht gefunden oder inaktiv" };
      }

      const roles = await this.authRepo.getUserRoles(user.id);

      // Create new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: `${user.vorname} ${user.nachname}`,
        roles: roles.map((r) => r.name),
        authSource: user.authSource,
      };

      const newAccessToken = jwt.sign(tokenPayload, this.jwtSecret, {
        expiresIn: "24h",
      });

      const newRefreshToken = jwt.sign(
        { userId: user.id, type: "refresh" },
        this.jwtSecret,
        { expiresIn: "30d" },
      );

      return {
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return { success: false, error: "Token-Erneuerung fehlgeschlagen" };
    }
  }

  /**
   * EasyVerein OAuth Password Grant
   */
  private async authenticateWithEasyVerein(
    email: string,
    password: string,
  ): Promise<{
    easyVereinId: string;
    email: string;
    vorname: string;
    nachname: string;
    mitgliedsnummer?: string;
  } | null> {
    try {
      // OAuth Token Request
      const tokenResponse = await axios.post(
        `${this.easyVereinConfig.apiUrl}/oauth/token`,
        new URLSearchParams({
          grant_type: "password",
          client_id: this.easyVereinConfig.clientId,
          client_secret: this.easyVereinConfig.clientSecret,
          username: email,
          password: password,
          scope: "read",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const { access_token } = tokenResponse.data;

      // Get User Info
      const userResponse = await axios.get(
        `${this.easyVereinConfig.apiUrl}/v2.0/member/me`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
          },
        },
      );

      const userData = userResponse.data;

      return {
        easyVereinId: userData.id.toString(),
        email: userData.email || userData.emailAddress,
        vorname: userData.firstName || userData.contactDetails?.firstName,
        nachname: userData.lastName || userData.contactDetails?.lastName,
        mitgliedsnummer: userData.membershipNumber,
      };
    } catch (error: any) {
      console.error("EasyVerein auth failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return null;
    }
  }

  /**
   * EasyVerein User in lokaler DB synchronisieren
   */
  private async syncEasyVereinUser(evUser: {
    easyVereinId: string;
    email: string;
    vorname: string;
    nachname: string;
    mitgliedsnummer?: string;
  }): Promise<User> {
    let user = await this.authRepo.findUserByEasyVereinId(evUser.easyVereinId);

    if (!user) {
      // Neuen User anlegen
      user = await this.authRepo.createUser({
        email: evUser.email,
        vorname: evUser.vorname,
        nachname: evUser.nachname,
        mitgliedsnummer: evUser.mitgliedsnummer,
        authSource: "easyverein",
        easyVereinId: evUser.easyVereinId,
        istAktiv: true,
      });

      // Standard-Rolle "MITGLIED" zuweisen
      await this.authRepo.assignRole(user.id, "role_mitglied");

      console.log("✅ Neuer EasyVerein User angelegt:", user.email);
    } else {
      // Bestehenden User aktualisieren
      await this.authRepo.updateUser(user.id, {
        email: evUser.email,
        vorname: evUser.vorname,
        nachname: evUser.nachname,
        mitgliedsnummer: evUser.mitgliedsnummer,
      });

      console.log("✅ EasyVerein User aktualisiert:", user.email);
    }

    return user;
  }

  /**
   * Lokalen User erstellen (nur für Admins)
   */
  async createLocalUser(userData: {
    email: string;
    password: string;
    vorname: string;
    nachname: string;
    roleId: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Check if email already exists
      const existing = await this.authRepo.findUserByEmail(userData.email);
      if (existing) {
        return { success: false, error: "E-Mail bereits vergeben" };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await this.authRepo.createUser({
        email: userData.email,
        vorname: userData.vorname,
        nachname: userData.nachname,
        authSource: "local",
        passwordHash,
        istAktiv: true,
      });

      // Assign role
      await this.authRepo.assignRole(user.id, userData.roleId);

      return { success: true, user };
    } catch (error) {
      console.error("Create local user error:", error);
      return { success: false, error: "User-Erstellung fehlgeschlagen" };
    }
  }
}
