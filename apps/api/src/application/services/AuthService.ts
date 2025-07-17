// apps/api/src/application/services/AuthService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { randomBytes } from "crypto";
import type { User, UserRole } from "@/domain/entities/User";
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";

/**
 * EasyVerein Konfiguration
 */
export type EasyVereinConfig = {
  clientId: string;
  clientSecret: string;
  apiUrl: string;
};

/**
 * Login-Ergebnis Type
 */
export type LoginResult = {
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

/**
 * Token-Refresh-Ergebnis Type
 */
export type RefreshResult = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
};

/**
 * Logout-Ergebnis Type
 */
export type LogoutResult = {
  success: boolean;
  error?: string;
};

/**
 * Auth Service
 * @description Behandelt Authentifizierung und Autorisierung
 */
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

      // 6. Refresh Token erstellen und speichern
      const refreshToken = this.generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 Tage

      await this.authRepo.saveRefreshToken({
        userId: user.id,
        token: refreshToken,
        expiresAt,
        deviceInfo: "Web Browser", // TODO: Aus User-Agent extrahieren
        ipAddress: "127.0.0.1", // TODO: Aus Request extrahieren
      });

      // 7. Login-Zeit aktualisieren
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
      // 1. Refresh Token in DB suchen
      const tokenData = await this.authRepo.findRefreshToken(refreshToken);

      if (!tokenData) {
        return { success: false, error: "Ungültiger Refresh Token" };
      }

      // 2. Prüfen ob Token abgelaufen
      if (new Date() > tokenData.expiresAt) {
        return { success: false, error: "Refresh Token abgelaufen" };
      }

      // 3. Prüfen ob Token widerrufen wurde
      if (tokenData.revokedAt) {
        return { success: false, error: "Refresh Token wurde widerrufen" };
      }

      // 4. User und Rollen laden
      const user = await this.authRepo.findUserById(tokenData.userId);
      if (!user || !user.istAktiv) {
        return { success: false, error: "User nicht gefunden oder inaktiv" };
      }

      const roles = await this.authRepo.getUserRoles(user.id);

      // 5. Neuen Access Token erstellen
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

      // 6. Neuen Refresh Token erstellen
      const newRefreshToken = this.generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 Tage

      // 7. Alten Token widerrufen
      await this.authRepo.revokeRefreshToken(refreshToken, user.id);

      // 8. Neuen Token speichern
      await this.authRepo.saveRefreshToken({
        userId: user.id,
        token: newRefreshToken,
        expiresAt,
      });

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
   * Logout - Refresh Tokens widerrufen
   */
  async logout(
    userId: string,
    refreshToken?: string,
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (refreshToken) {
        // Nur den spezifischen Token widerrufen
        await this.authRepo.revokeRefreshToken(refreshToken, userId);
      } else {
        // Alle Tokens des Users widerrufen (Logout von allen Geräten)
        await this.authRepo.revokeAllUserRefreshTokens(userId, userId);
      }

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Logout fehlgeschlagen" };
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
    // Development Mode Check
    if (
      process.env.NODE_ENV === "development" &&
      !this.easyVereinConfig.clientId
    ) {
      console.warn("⚠️ EasyVerein not configured - skipping authentication");
      return null;
    }

    try {
      // 1. Request OAuth Token
      const tokenData = await this.requestEasyVereinToken(email, password);
      if (!tokenData) return null;

      // 2. Fetch User Data
      const userData = await this.fetchEasyVereinUserData(
        tokenData.access_token,
      );
      if (!userData) return null;

      // 3. Map to our format
      return this.mapEasyVereinUser(userData);
    } catch (error: any) {
      this.handleEasyVereinError(error);
      return null;
    }
  }

  /**
   * Request OAuth Token from EasyVerein
   */
  private async requestEasyVereinToken(
    email: string,
    password: string,
  ): Promise<{ access_token: string } | null> {
    try {
      const response = await axios.post(
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
          timeout: 10000, // 10 seconds timeout
        },
      );

      return response.data;
    } catch (error: any) {
      // Spezifische Fehlerbehandlung für Token-Request
      if (error.response?.status === 401) {
        console.log("EasyVerein: Invalid credentials");
      } else if (error.code === "ENOTFOUND") {
        console.error("EasyVerein: Service not reachable (DNS)");
      } else if (error.code === "ECONNREFUSED") {
        console.error("EasyVerein: Connection refused");
      }
      throw error;
    }
  }

  /**
   * Fetch User Data from EasyVerein
   */
  private async fetchEasyVereinUserData(
    accessToken: string,
  ): Promise<any | null> {
    try {
      const response = await axios.get(
        `${this.easyVereinConfig.apiUrl}/v2.0/member/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          timeout: 10000,
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to fetch EasyVerein user data:",
        error.response?.status,
      );
      throw error;
    }
  }

  /**
   * Map EasyVerein User Data to our format
   */
  private mapEasyVereinUser(userData: any): {
    easyVereinId: string;
    email: string;
    vorname: string;
    nachname: string;
    mitgliedsnummer?: string;
  } {
    return {
      easyVereinId: String(userData.id),
      email: userData.email || userData.emailAddress || "",
      vorname:
        userData.firstName || userData.contactDetails?.firstName || "Unbekannt",
      nachname:
        userData.lastName || userData.contactDetails?.lastName || "Unbekannt",
      mitgliedsnummer: userData.membershipNumber,
    };
  }

  /**
   * Handle EasyVerein Errors with specific logging
   */
  private handleEasyVereinError(error: any): void {
    const errorInfo = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    };

    // Development-spezifische Meldungen
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 EasyVerein Error (Development Mode):", errorInfo);

      if (error.code === "ENOTFOUND") {
        console.log(
          "💡 Tipp: EasyVerein ist in der Entwicklung nicht erreichbar.",
        );
        console.log(
          "   Nutze den lokalen Admin-Account oder konfiguriere einen VPN/Proxy.",
        );
      }
    } else {
      // Production Error Logging
      console.error("EasyVerein authentication failed:", errorInfo);
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

  /**
   * Generiert einen sicheren Refresh Token
   */
  private generateRefreshToken(): string {
    return randomBytes(32).toString("hex");
  }
}
