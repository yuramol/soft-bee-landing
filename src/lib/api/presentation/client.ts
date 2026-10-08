import { isJsonObject, readResponseJson, type JsonValue } from '@/lib/estimator/json';
import { resolveProposalDownloadFileName } from '@/lib/estimator/proposal-outputs';
import type { CreateProposalResult, ProposalEstimate, ProposalOutputs, ProposalStatusResult } from '@/lib/estimator/types';

export async function createPresentationJob(
  input: {
    text?: string;
    file?: File | null;
    captchaToken: string;
    idempotencyKey?: string;
  },
  signal?: AbortSignal
): Promise<CreateProposalResult> {
  const formData = new FormData();

  if (input.text?.trim()) {
    formData.append('text', input.text.trim());
  }

  if (input.file) {
    formData.append('file', input.file);
  }

  formData.append('captchaToken', input.captchaToken);

  const headers = new Headers();
  if (input.idempotencyKey) {
    headers.set('Idempotency-Key', input.idempotencyKey);
  }

  const response = await fetch('/api/presentation/generate', {
    method: 'POST',
    body: formData,
    headers,
    signal,
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to submit requirements.'));
  }

  const payload = await readResponseJson(response);
  if (!isJsonObject(payload)) {
    throw new Error('Create response missing jobId.');
  }

  const jobId = typeof payload.jobId === 'string' ? payload.jobId : null;
  const status = typeof payload.status === 'string' ? payload.status : 'queued';

  if (!jobId) {
    throw new Error('Create response missing jobId.');
  }

  return { jobId, status };
}

export async function getPresentationJob(jobId: string, signal?: AbortSignal): Promise<ProposalStatusResult> {
  const response = await fetch(`/api/presentation/${encodeURIComponent(jobId)}`, {
    method: 'GET',
    signal,
    credentials: 'same-origin',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch estimate status.'));
  }

  const payload = await readResponseJson(response);
  if (!isJsonObject(payload)) {
    throw new Error('Invalid status response.');
  }

  return {
    jobId: typeof payload.jobId === 'string' ? payload.jobId : jobId,
    status: typeof payload.status === 'string' ? payload.status : 'processing',
    progress: typeof payload.progress === 'number' ? payload.progress : undefined,
    stage: typeof payload.stage === 'string' ? payload.stage : undefined,
    estimate: readEstimate(payload.estimate),
    outputs: readOutputs(payload.outputs),
    error: typeof payload.error === 'string' ? payload.error : undefined
  };
}

export interface ActivePresentationJobResult {
  active: boolean;
  jobId?: string;
  status?: string;
  progress?: number;
  stage?: string;
  estimate?: ProposalEstimate;
  outputs?: ProposalOutputs;
  error?: string;
}

export async function getActivePresentationJob(signal?: AbortSignal): Promise<ActivePresentationJobResult> {
  const response = await fetch('/api/presentation/active', {
    method: 'GET',
    signal,
    credentials: 'same-origin',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to fetch active estimate.'));
  }

  const payload = await readResponseJson(response);
  if (!isJsonObject(payload)) {
    throw new Error('Invalid active job response.');
  }

  if (payload.active !== true) {
    return { active: false };
  }

  return {
    active: true,
    jobId: typeof payload.jobId === 'string' ? payload.jobId : undefined,
    status: typeof payload.status === 'string' ? payload.status : undefined,
    progress: typeof payload.progress === 'number' ? payload.progress : undefined,
    stage: typeof payload.stage === 'string' ? payload.stage : undefined,
    estimate: readEstimate(payload.estimate),
    outputs: readOutputs(payload.outputs),
    error: typeof payload.error === 'string' ? payload.error : undefined
  };
}

export interface DownloadPresentationResult {
  blob: Blob;
  fileName: string;
}

export async function downloadPresentationJob(
  jobId: string,
  options?: { preferredFileName?: string; signal?: AbortSignal }
): Promise<DownloadPresentationResult> {
  const response = await fetch(`/api/presentation/${encodeURIComponent(jobId)}/download`, {
    method: 'GET',
    signal: options?.signal,
    credentials: 'same-origin',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to download presentation.'));
  }

  const fileName = resolveProposalDownloadFileName({
    contentDisposition: response.headers.get('content-disposition'),
    fallback: options?.preferredFileName
  });

  return {
    blob: await response.blob(),
    fileName
  };
}

async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const body = await readResponseJson(response);
    if (isJsonObject(body) && typeof body.error === 'string' && body.error.length > 0) {
      return body.error;
    }
  } catch {
    // ignore
  }

  return fallback;
}

function readEstimate(value: JsonValue | undefined): ProposalEstimate | undefined {
  if (!value || !isJsonObject(value)) {
    return undefined;
  }

  const result: ProposalEstimate = {};

  if (typeof value.hours === 'string') result.hours = value.hours;
  if (typeof value.price === 'string') result.price = value.price;
  if (typeof value.hoursMin === 'number') result.hoursMin = value.hoursMin;
  if (typeof value.hoursMax === 'number') result.hoursMax = value.hoursMax;
  if (typeof value.priceMin === 'number') result.priceMin = value.priceMin;
  if (typeof value.priceMax === 'number') result.priceMax = value.priceMax;

  return Object.keys(result).length > 0 ? result : undefined;
}

function readOutputs(value: JsonValue | undefined): ProposalOutputs | undefined {
  if (!value || !isJsonObject(value)) {
    return undefined;
  }

  const result: ProposalOutputs = {};

  if (typeof value.pdfUrl === 'string' && value.pdfUrl.length > 0) result.pdfUrl = value.pdfUrl;
  if (typeof value.pptxUrl === 'string' && value.pptxUrl.length > 0) result.pptxUrl = value.pptxUrl;
  if (typeof value.fileName === 'string' && value.fileName.length > 0) result.fileName = value.fileName;
  if (value.expiresAt === null) result.expiresAt = null;
  if (typeof value.expiresAt === 'string') result.expiresAt = value.expiresAt;

  return Object.keys(result).length > 0 ? result : undefined;
}
