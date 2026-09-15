import { ESTIMATOR_DOWNLOAD_TIMEOUT_MS, ESTIMATOR_REQUEST_TIMEOUT_MS } from './constants';
import { isJsonObject, readResponseJson, type JsonObject, type JsonValue } from './json';
import type { CreateProposalInput, CreateProposalResult, DownloadProposalResult, ProposalEstimate, ProposalStatusResult } from './types';

export async function createProposal(input: CreateProposalInput): Promise<CreateProposalResult> {
  const { baseUrl, apiKey } = getEstimatorConfig();
  const formData = new FormData();

  if (input.projectText?.trim()) {
    formData.append('projectText', input.projectText.trim());
  }

  if (input.file) {
    formData.append('files', input.file, input.fileName ?? 'upload');
  }

  const headers = new Headers({
    Authorization: `Bearer ${apiKey}`
  });

  if (input.idempotencyKey) {
    headers.set('Idempotency-Key', input.idempotencyKey);
  }

  const response = await fetchWithTimeout(`${baseUrl}/v1/proposals`, {
    method: 'POST',
    headers,
    body: formData,
    timeoutMs: ESTIMATOR_REQUEST_TIMEOUT_MS
  });

  if (!response.ok) {
    throw new EstimatorApiError(await readErrorMessage(response), response.status);
  }

  const payload = await readJsonObject(response);
  const jobId = readString(payload, ['jobId', 'id', 'proposalId']);
  const status = readString(payload, ['status']) ?? 'queued';

  if (!jobId) {
    throw new EstimatorApiError('Estimator create response missing jobId.', 502);
  }

  return { jobId, status };
}

export async function getProposal(jobId: string): Promise<ProposalStatusResult> {
  const { baseUrl, apiKey } = getEstimatorConfig();

  const response = await fetchWithTimeout(`${baseUrl}/v1/proposals/${encodeURIComponent(jobId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json'
    },
    timeoutMs: ESTIMATOR_REQUEST_TIMEOUT_MS
  });

  if (!response.ok) {
    throw new EstimatorApiError(await readErrorMessage(response), response.status);
  }

  const payload = await readJsonObject(response);

  return {
    jobId: readString(payload, ['jobId', 'id']) ?? jobId,
    status: readString(payload, ['status']) ?? 'processing',
    progress: readNumber(payload, ['progress']),
    stage: readString(payload, ['stage']),
    estimate: readEstimate(payload.estimate),
    error: readErrorMessageFromPayload(payload)
  };
}

export async function downloadProposal(jobId: string): Promise<DownloadProposalResult> {
  const { baseUrl, apiKey } = getEstimatorConfig();

  const response = await fetchWithTimeout(`${baseUrl}/v1/proposals/${encodeURIComponent(jobId)}/download`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    timeoutMs: ESTIMATOR_DOWNLOAD_TIMEOUT_MS,
    redirect: 'manual'
  });

  if (isRedirectStatus(response.status)) {
    const location = response.headers.get('location');
    if (!location) {
      throw new EstimatorApiError('Download redirect missing Location header.', 502);
    }

    // 🔍 DEBUG: Log redirect URL to see Railway's actual host
    console.log('🔍 [DEBUG] Railway redirect Location:', location);
    try {
      const redirectUrl = new URL(location);
      console.log('🔍 [DEBUG] Redirect hostname:', redirectUrl.hostname);
      console.log('🔍 [DEBUG] Redirect protocol:', redirectUrl.protocol);
    } catch (e) {
      console.log('🔍 [DEBUG] Failed to parse redirect URL:', e);
    }

    return downloadViaHttpsRedirect(location);
  }

  if (!response.ok) {
    throw new EstimatorApiError(await readErrorMessage(response), response.status);
  }

  return {
    body: response.body,
    contentType: response.headers.get('content-type') ?? 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    contentDisposition: response.headers.get('content-disposition'),
    contentLength: response.headers.get('content-length')
  };
}

export class EstimatorApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'EstimatorApiError';
    this.status = status;
  }
}

/**
 * Validate that a download redirect URL's hostname is in the allowlist.
 * Rejects URLs with credentials, non-HTTPS, and unexpected ports.
 * Fails closed if ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST is empty.
 */
function assertAllowedDownloadHost(url: URL): void {
  if (url.protocol !== 'https:') {
    throw new EstimatorApiError('Download redirect must use HTTPS.', 502);
  }

  if (url.username || url.password) {
    throw new EstimatorApiError('Download redirect URL must not contain credentials.', 502);
  }

  // Reject unexpected ports (only allow 443 or default)
  if (url.port && url.port !== '443') {
    throw new EstimatorApiError('Download redirect URL uses an unexpected port.', 502);
  }

  const allowlist = (process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  console.log('🔍 [DEBUG] ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST raw:', process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST);
  console.log('🔍 [DEBUG] Parsed allowlist:', allowlist);
  console.log('🔍 [DEBUG] Checking hostname:', url.hostname.toLowerCase());

  if (allowlist.length === 0) {
    console.log('⚠️  [DEBUG] Allowlist is EMPTY - will reject (fail-closed)');
    throw new EstimatorApiError('Download host allowlist is not configured.', 502);
  }

  const hostname = url.hostname.toLowerCase();
  const isAllowed = allowlist.some(
    (allowed) => hostname === allowed || hostname.endsWith('.' + allowed)
  );

  console.log('🔍 [DEBUG] Is hostname allowed?', isAllowed);

  if (!isAllowed) {
    console.error('❌ [DEBUG] Download redirect hostname not allowed:', url.hostname);
    console.error('❌ [DEBUG] Allowed hosts:', allowlist.join(', '));
    throw new EstimatorApiError('Download host not allowed.', 502);
  }

  console.log('✅ [DEBUG] Hostname is allowed, proceeding with download');
}

async function downloadViaHttpsRedirect(location: string, maxHops = 5): Promise<DownloadProposalResult> {
  if (maxHops <= 0) {
    throw new EstimatorApiError('Too many download redirects.', 502);
  }

  let redirectUrl: URL;

  try {
    redirectUrl = new URL(location);
  } catch {
    throw new EstimatorApiError('Invalid download redirect URL.', 502);
  }

  console.log('🔍 [DEBUG] downloadViaHttpsRedirect - checking URL:', redirectUrl.href);
  console.log('🔍 [DEBUG] Hostname:', redirectUrl.hostname);
  console.log('🔍 [DEBUG] Protocol:', redirectUrl.protocol);
  console.log('🔍 [DEBUG] Port:', redirectUrl.port || 'default');

  assertAllowedDownloadHost(redirectUrl);

  const response = await fetchWithTimeout(redirectUrl.toString(), {
    method: 'GET',
    timeoutMs: ESTIMATOR_DOWNLOAD_TIMEOUT_MS,
    redirect: 'manual'
  });

  // Handle further redirects (validate each hop)
  if (isRedirectStatus(response.status)) {
    const nextLocation = response.headers.get('location');
    if (!nextLocation) {
      throw new EstimatorApiError('Download redirect missing Location header.', 502);
    }

    return downloadViaHttpsRedirect(nextLocation, maxHops - 1);
  }

  if (!response.ok) {
    throw new EstimatorApiError('Failed to download presentation from signed URL.', response.status);
  }

  return {
    body: response.body,
    contentType: response.headers.get('content-type') ?? 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    contentDisposition: response.headers.get('content-disposition'),
    contentLength: response.headers.get('content-length')
  };
}

function getEstimatorConfig(): { baseUrl: string; apiKey: string } {
  const baseUrl = process.env.ESTIMATOR_BASE_URL?.replace(/\/$/, '');
  const apiKey = process.env.ESTIMATOR_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new EstimatorApiError('Estimator service is not configured.', 503);
  }

  return { baseUrl, apiKey };
}

async function fetchWithTimeout(url: string, init: RequestInit & { timeoutMs: number }): Promise<Response> {
  const { timeoutMs, ...requestInit } = init;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...requestInit,
      signal: controller.signal,
      cache: 'no-store'
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new EstimatorApiError('Estimator request timed out.', 504);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = await readJsonObject(response);
    const message = readString(payload, ['error', 'message', 'detail']);
    if (message) return message;
  } catch {
    // ignore non-JSON bodies
  }

  return `Estimator request failed (${response.status}).`;
}

async function readJsonObject(response: Response): Promise<JsonObject> {
  const payload = await readResponseJson(response);
  if (!isJsonObject(payload)) {
    throw new EstimatorApiError('Estimator returned a non-object JSON body.', 502);
  }
  return payload;
}

function readString(payload: JsonObject, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return undefined;
}

function readNumber(payload: JsonObject, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
}

function readEstimate(value: JsonValue | undefined): ProposalEstimate | undefined {
  if (!value || !isJsonObject(value)) return undefined;

  const result: ProposalEstimate = {};

  if (typeof value.hours === 'string') result.hours = value.hours;
  if (typeof value.price === 'string') result.price = value.price;
  if (typeof value.hoursMin === 'number') result.hoursMin = value.hoursMin;
  if (typeof value.hoursMax === 'number') result.hoursMax = value.hoursMax;
  if (typeof value.priceMin === 'number') result.priceMin = value.priceMin;
  if (typeof value.priceMax === 'number') result.priceMax = value.priceMax;

  return Object.keys(result).length > 0 ? result : undefined;
}

function readErrorMessageFromPayload(payload: JsonObject): string | undefined {
  const direct = readString(payload, ['error', 'message']);
  if (direct) return direct;

  const errorValue = payload.error;
  if (isJsonObject(errorValue)) {
    return readString(errorValue, ['message', 'detail', 'code']);
  }

  return undefined;
}

function isRedirectStatus(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
