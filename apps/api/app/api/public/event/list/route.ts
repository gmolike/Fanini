// app/api/public/event/list/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/public/event/list
 * Retrieve list of all public events
 */
export async function GET() {
  try {
    // TODO: Implement database query
    const events = [
      {
        id: "1",
        titel: "Sommerfest 2024",
        kurzbeschreibung: "Großes Vereinsfest",
        datum: new Date().toISOString(),
        ort: {
          name: "Vereinsheim",
          adresse: {
            strasse: "Hauptstraße",
            hausnummer: "1",
            plz: "13585",
            stadt: "Berlin",
          },
        },
        istOeffentlich: true,
        status: "GENEHMIGT",
      },
    ];

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
