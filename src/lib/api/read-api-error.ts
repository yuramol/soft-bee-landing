import { isJsonObject, readResponseJson } from '@/lib/security/json';
import { FILE_TOO_LARGE_MESSAGE } from '@/lib/security/upload';

export const NETWORK_ERROR_MESSAGE = 'Network error. Check your connection and try again.';

/**
 * User-facing message for a failed API response.
 * Prefers the JSON `error` from our routes; covers responses that never reach them
 * (Vercel's plain-text 413 for oversized bodies, HTML gateway errors) with readable fallbacks.
 */
export async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const payload = await readResponseJson(response);
    if (isJsonObject(payload) && typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Non-JSON body (platform error page) — fall through to status-based messages.
  }

  if (response.status === 413) {
    return FILE_TOO_LARGE_MESSAGE;
  }

  return fallback;
}

/**
 * `fetch` that turns low-level network failures ("Failed to fetch", Safari's "Load failed")
 * into a readable message. Aborts are re-thrown untouched so callers can ignore them.
 */
export async function fetchOrNetworkError(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    console.error('Network request failed:', error);
    throw new Error(NETWORK_ERROR_MESSAGE);
  }
}
