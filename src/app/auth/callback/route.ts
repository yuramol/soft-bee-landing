import { NextResponse } from 'next/server';

import { ROUTES } from '@/constants';
import { createServerClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}${ROUTES.LOGIN}?error=missing_code`);
  }

  const supabase = await createServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const login = new URL(ROUTES.LOGIN, origin);
    login.searchParams.set('error', 'oauth');
    return NextResponse.redirect(login.toString());
  }

  return NextResponse.redirect(`${origin}${ROUTES.DASHBOARD}`);
}
