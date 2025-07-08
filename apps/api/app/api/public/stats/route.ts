// backend/app/api/public/stats/route.ts
import { NextResponse } from "next/server";
import { query } from "@/infrastructure/database/connection";

/**
 * @swagger
 * /api/public/stats:
 *   get:
 *     summary: Öffentliche Vereinsstatistiken
 *     tags: [Public]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Stats'
 */
export async function GET() {
  try {
    const memberCountResult = await query<any[]>(
      "SELECT COUNT(*) as count FROM mitglieder WHERE ist_aktiv = true",
    );
    const memberCount = memberCountResult[0]?.count ?? 0;

    const currentYear = new Date().getFullYear();
    const eventsResult = await query<any[]>(
      "SELECT COUNT(*) as count FROM events WHERE YEAR(datum) = ? AND status != ?",
      [currentYear, "abgesagt"],
    );
    const eventsThisYear = eventsResult[0]?.count ?? 0;

    return NextResponse.json({
      data: {
        memberCount: Number(memberCount) || 70,
        eventsPerYear: Number(eventsThisYear) || 24,
        foundedYear: 2025,
        passionPercentage: 100,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({
      data: {
        memberCount: 70,
        eventsPerYear: 24,
        foundedYear: 2025,
        passionPercentage: 100,
      },
    });
  }
}
