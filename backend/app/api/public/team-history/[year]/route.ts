// app/api/public/team-history/[year]/route.ts
import { NextResponse } from 'next/server';

type Params = {
  params: {
    year: string;
  };
};

/**
 * GET /api/public/team-history/{year}
 * Retrieve team history for specific year
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { year } = params;

    // TODO: Implement database query
    const history = {
      year: parseInt(year),
      teams: [
        {
          id: '1',
          name: 'Team Event',
          mitglieder: [
            {
              name: 'Max Mustermann',
              position: 'Teamleiter',
              vonDatum: `${year}-01-01`,
              bisDatum: `${year}-12-31`,
            },
          ],
        },
      ],
      hoehepunkte: [
        {
          titel: 'Sommerfest',
          datum: `${year}-07-15`,
          beschreibung: 'Großes Vereinsfest mit 100+ Teilnehmern',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Team history not found' },
      { status: 404 }
    );
  }
}
