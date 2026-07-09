import { NextResponse, type NextRequest } from 'next/server';

import { updateSession } from '@/utils/supabase/middleware';

function shouldSkipProxy(pathname: string): boolean {
  if (pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image')) {
    return true;
  }
  if (pathname === '/favicon.ico') {
    return true;
  }
  return /\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$/i.test(pathname);
}

export async function proxy(request: NextRequest) {
  if (shouldSkipProxy(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return updateSession(request);
}
