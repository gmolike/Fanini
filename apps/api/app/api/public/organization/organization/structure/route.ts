// app/api/public/organization/structure/route.ts
import { NextResponse } from 'next/server';

/**
 * GET /api/public/organization/structure
 * Retrieve organization structure
 */
export async function GET() {
  try {
    // TODO: Implement database query
    const structure = {
      vorstand: [
        {
          id: '1',
          name: 'Max Mustermann',
          position: 'Vorsitzender',
          email: 'vorsitz@faninitiative-spandau.de',
          bild: '/images/vorstand1.jpg',
        },
      ],
      beirat: [
        {
          id: '2',
          name: 'Anna Schmidt',
          position: 'Beiratsmitglied',
          bereich: 'Events',
        },
      ],
      teams: [
        {
          id: 'team-event',
          name: 'Team Event',
          beschreibung: 'Organisation von Veranstaltungen',
          mitgliederAnzahl: 5,
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: structure,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization structure' },
      { status: 500 }
    );
  }
}
