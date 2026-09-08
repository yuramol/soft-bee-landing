import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const rateLimitCookie = cookieStore.get('rate_limit_presentation');
    let attempts = 0;
    const date = new Date().toISOString().split('T')[0];

    if (rateLimitCookie) {
      try {
        const data = JSON.parse(rateLimitCookie.value);
        if (data.date === date) {
          attempts = data.count;
        }
      } catch {
        // Ignore parse error
      }
    }

    if (attempts >= 3) {
      return NextResponse.json({ error: 'You have reached the limit of 3 requests per day. Please try again tomorrow.' }, { status: 429 });
    }

    const formData = await request.formData();
    const text = formData.get('text');
    const file = formData.get('file');

    if (!text && !file) {
      return NextResponse.json({ error: 'Requirements text or file is required.' }, { status: 400 });
    }

    // Simulate backend processing time
    await new Promise((resolve) => setTimeout(resolve, 15000));

    // Simulate random backend rejection (e.g., 10% chance)
    if (Math.random() < 0.1) {
      return NextResponse.json({ error: 'Simulated backend rejection. Please try again.' }, { status: 500 });
    }

    cookieStore.set('rate_limit_presentation', JSON.stringify({ count: attempts + 1, date }), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return NextResponse.json({ success: true, message: 'Presentation generation started.' }, { status: 200 });
  } catch (error) {
    console.error('Error generating presentation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
