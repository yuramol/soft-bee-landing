export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  AUTH_CALLBACK: '/auth/callback'
} as const;

/** Paths anonymous users must reach (OAuth must hit /auth/callback before session exists). */
export const ALLOW_NO_AUTHORIZED_ROUTES_LIST: string[] = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.AUTH_CALLBACK];

export const ALLOW_AUTHORIZED_ROUTES_LIST: string[] = [ROUTES.LOGIN];

export const PROTECTED_ROUTES_LIST: string[] = [ROUTES.DASHBOARD];
