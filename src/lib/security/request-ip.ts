const LOOPBACK_IPS = new Set(['::1', '0:0:0:0:0:0:0:1', '127.0.0.1', 'localhost']);

/**
 * Resolve the connecting client IP from proxy headers.
 * Prefers platform headers (Cloudflare / Vercel) over x-forwarded-for, and skips
 * loopback when a non-local candidate exists (common when local proxies prepend ::1).
 * On `next dev` / localhost-only traffic, ::1 / 127.0.0.1 is the real client address.
 */
export function getRequestIp(request: Request): string | null {
  const candidates: string[] = [];

  appendIpCandidates(candidates, request.headers.get('cf-connecting-ip'));
  appendIpCandidates(candidates, request.headers.get('true-client-ip'));
  appendIpCandidates(candidates, request.headers.get('x-vercel-forwarded-for'));
  appendIpCandidates(candidates, request.headers.get('x-real-ip'));
  appendIpCandidates(candidates, request.headers.get('x-client-ip'));
  appendIpCandidates(candidates, request.headers.get('x-forwarded-for'));
  appendForwardedHeaderCandidates(candidates, request.headers.get('forwarded'));

  const publicIp = candidates.find((ip) => !isLoopbackIp(ip));
  if (publicIp) return publicIp;

  return candidates[0] ?? null;
}

function appendIpCandidates(target: string[], headerValue: string | null): void {
  if (!headerValue) return;

  for (const part of headerValue.split(',')) {
    const ip = normalizeIp(part);
    if (ip) target.push(ip);
  }
}

function appendForwardedHeaderCandidates(target: string[], headerValue: string | null): void {
  if (!headerValue) return;

  for (const part of headerValue.split(',')) {
    const forMatch = /(?:^|;)\s*for=(?:"?\[?)([^\]";]+)/i.exec(part);
    const ip = normalizeIp(forMatch?.[1] ?? null);
    if (ip) target.push(ip);
  }
}

function normalizeIp(value: string | null | undefined): string | null {
  if (!value) return null;

  let ip = value.trim();
  if (!ip) return null;

  if (ip.startsWith('"') && ip.endsWith('"')) {
    ip = ip.slice(1, -1);
  }

  if (ip.startsWith('[') && ip.includes(']')) {
    ip = ip.slice(1, ip.indexOf(']'));
  } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(ip)) {
    ip = ip.replace(/:\d+$/, '');
  }

  if (ip.toLowerCase().startsWith('::ffff:')) {
    ip = ip.slice(7);
  }

  return ip || null;
}

function isLoopbackIp(ip: string): boolean {
  return LOOPBACK_IPS.has(ip.toLowerCase());
}
