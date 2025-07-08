// app/api/public/faq/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/public/faq
 * Retrieve list of frequently asked questions
 */
export async function GET() {
  try {
    // TODO: Implement database query
    const faqs = [
      {
        id: "1",
        frage: "Wie werde ich Mitglied?",
        antwort: "Sie können sich über unser Online-Formular anmelden.",
        kategorie: "Mitgliedschaft",
        reihenfolge: 1,
        istAktiv: true,
      },
      {
        id: "2",
        frage: "Was kostet die Mitgliedschaft?",
        antwort: "Die Mitgliedschaft kostet 50€ pro Jahr.",
        kategorie: "Mitgliedschaft",
        reihenfolge: 2,
        istAktiv: true,
      },
    ];

    return NextResponse.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs" },
      { status: 500 },
    );
  }
}
