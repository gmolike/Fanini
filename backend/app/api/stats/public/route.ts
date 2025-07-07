import { NextResponse } from "next/server";
import { query } from "@/infrastructure/database/connection";

/**
 * @swagger
 * /api/stats/public:
 *   get:
 *     summary: Öffentliche Vereinsstatistiken
 *     description: Gibt öffentliche Statistiken über den Verein zurück
 *     tags:
 *       - Public
 *     responses:
 *       200:
 *         description: Erfolgreiche Antwort
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     memberCount:
 *                       type: number
 *                       description: Anzahl der aktiven Mitglieder
 *                       example: 42
 *                     eventsPerYear:
 *                       type: number
 *                       description: Durchschnittliche Events pro Jahr
 *                       example: 24
 *                     foundedYear:
 *                       type: number
 *                       description: Gründungsjahr des Vereins
 *                       example: 2019
 *                     passionPercentage:
 *                       type: number
 *                       description: Leidenschaft in Prozent (immer 100!)
 *                       example: 100
 */
export async function GET() {
  try {
    // Hole Mitglieder-Anzahl aus der Datenbank
    const memberCountResult = await query<any[]>(
      "SELECT COUNT(*) as count FROM mitglieder WHERE ist_aktiv = true",
    );
    const memberCount = memberCountResult[0]?.count ?? 0;

    // Hole Event-Anzahl für dieses Jahr
    const currentYear = new Date().getFullYear();
    const eventsResult = await query<any[]>(
      "SELECT COUNT(*) as count FROM events WHERE YEAR(datum) = ? AND status != ?",
      [currentYear, "abgesagt"],
    );
    const eventsThisYear = eventsResult[0]?.count ?? 0;

    // Berechne durchschnittliche Events pro Jahr
    // Für den Anfang nehmen wir einfach die aktuelle Anzahl
    const eventsPerYear = eventsThisYear ?? 24; // Fallback für Demo

    // Statische Werte für Demo
    const stats = {
      data: {
        memberCount: Number(memberCount) || 42, // Fallback für Demo
        eventsPerYear: Number(eventsPerYear),
        foundedYear: 2019, // Fest codiert
        passionPercentage: 100, // Immer 100% Leidenschaft! 💙
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Fehler beim Abrufen der Statistiken:", error);

    // Fallback-Werte bei Datenbankfehler
    return NextResponse.json({
      data: {
        memberCount: 42,
        eventsPerYear: 24,
        foundedYear: 2019,
        passionPercentage: 100,
      },
    });
  }
}
