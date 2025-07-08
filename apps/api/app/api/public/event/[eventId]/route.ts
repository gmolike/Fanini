// app/api/public/event/[eventId]/route.ts
import { NextResponse } from 'next/server';

type Params = {
  params: {
    eventId: string;
  };
};

/**
 * GET /api/public/event/{eventId}
 * Retrieve specific event details
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { eventId } = params;

    // TODO: Implement database query
    const event = {
      id: eventId,
      titel: 'Sommerfest 2024',
      beschreibung: 'Unser jährliches Sommerfest mit vielen Aktivitäten',
      kurzbeschreibung: 'Großes Vereinsfest',
      datum: new Date().toISOString(),
      uhrzeit: '14:00',
      dauer: 240,
      ort: {
        name: 'Vereinsheim',
        adresse: {
          strasse: 'Hauptstraße',
          hausnummer: '1',
          plz: '13585',
          stadt: 'Berlin',
        },
      },
      istOeffentlich: true,
      status: 'GENEHMIGT',
      maxTeilnehmer: 100,
    };

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Event not found' },
      { status: 404 }
    );
  }
}
