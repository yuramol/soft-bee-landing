import type { CookieOptions } from '@supabase/ssr';
import { createServerClient as createServerClientLib } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createServerClientLib<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            return cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      }
    }
  });
}

export function createServiceClient() {
  return createServerClientLib(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return null;
      }
    }
  });
}
