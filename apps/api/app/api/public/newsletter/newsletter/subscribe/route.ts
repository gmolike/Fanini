// app/api/public/newsletter/subscribe/route.ts
import { NextResponse } from 'next/server';

/**
 * POST /api/public/newsletter/subscribe
 * Subscribe to newsletter
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, vorname, nachname } = body;

    // TODO: Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // TODO: Implement subscription logic
    const subscription = {
      id: '1',
      email,
      vorname,
      nachname,
      angemeldetAm: new Date().toISOString(),
      istAktiv: false, // Needs confirmation
      confirmationToken: 'abc123',
    };

    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'Please check your email to confirm subscription',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
