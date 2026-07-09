import { ROUTES } from '@/constants';

function isDashboardPath(pathname: string): boolean {
  return pathname === ROUTES.DASHBOARD || pathname === `${ROUTES.DASHBOARD}/`;
}

export function isRouteMatch(pathname: string, route: string): boolean {
  return route === ROUTES.DASHBOARD ? isDashboardPath(pathname) : pathname.startsWith(route);
}

export function matchesAnyRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => isRouteMatch(pathname, route));
}
