import { NextRequest, NextResponse } from 'next/server';

import { ALLOW_AUTHORIZED_ROUTES_LIST, ALLOW_NO_AUTHORIZED_ROUTES_LIST, PROTECTED_ROUTES_LIST, ROUTES } from '@/constants';
import type { CookieOptions } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';

import { matchesAnyRoute } from '@/lib/routes';
import type { Database } from '@/types';

function redirectPreservingSupabaseCookies(url: URL, supabaseResponse: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  supabaseResponse.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === 'cache-control' || k === 'expires' || k === 'pragma') {
      redirectResponse.headers.set(key, value);
    }
  });
  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient<Database, 'public'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
          headers: Record<string, string>
        ) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
          for (const [key, value] of Object.entries(headers)) {
            supabaseResponse.headers.set(key, value);
          }
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  const isProtectedRoute = matchesAnyRoute(pathname, PROTECTED_ROUTES_LIST);
  const isApiRoute = pathname.startsWith('/api');
  if (!user && isProtectedRoute && !isApiRoute) {
    url.pathname = ROUTES.LOGIN;
    return redirectPreservingSupabaseCookies(url, supabaseResponse);
  }

  const isPublicRoute = ALLOW_NO_AUTHORIZED_ROUTES_LIST.some((path) => pathname.startsWith(path));

  if (!user && !isPublicRoute && !isApiRoute) {
    url.pathname = ROUTES.LOGIN;
    return redirectPreservingSupabaseCookies(url, supabaseResponse);
  }

  const isAuthOnlyRoute = ALLOW_AUTHORIZED_ROUTES_LIST.some((path) => pathname.startsWith(path));

  if (isAuthOnlyRoute && user) {
    url.pathname = ROUTES.DASHBOARD;
    return redirectPreservingSupabaseCookies(url, supabaseResponse);
  }

  return supabaseResponse;
}
