// app/api/public/organization/documents/route.ts
import { NextResponse } from 'next/server';

/**
 * GET /api/public/organization/documents
 * Retrieve organization documents
 */
export async function GET() {
  try {
    // TODO: Implement database query
    const documents = [
      {
        id: '1',
        titel: 'Vereinssatzung',
        typ: 'SATZUNG',
        beschreibung: 'Aktuelle Satzung des Vereins',
        dateiUrl: '/documents/satzung.pdf',
        aktualisiertAm: new Date().toISOString(),
      },
      {
        id: '2',
        titel: 'Geschäftsordnung',
        typ: 'ORDNUNG',
        beschreibung: 'Geschäftsordnung des Vorstands',
        dateiUrl: '/documents/geschaeftsordnung.pdf',
        aktualisiertAm: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
