import type {
  CreateProposalInput,
  CreateProposalResponse,
  GetProposalResponse,
  DownloadProposalResponse
} from './types';

/**
 * Get the estimator base URL from environment variables
 * @throws {Error} if ESTIMATOR_BASE_URL is not set
 */
function getBaseUrl(): string {
  const baseUrl = process.env.ESTIMATOR_BASE_URL;
  if (!baseUrl) {
    throw new Error('ESTIMATOR_BASE_URL environment variable is not set. Please configure it in your .env file.');
  }
  return baseUrl;
}

/**
 * Get the estimator API key from environment variables
 * @throws {Error} if ESTIMATOR_API_KEY is not set
 */
function getApiKey(): string {
  const apiKey = process.env.ESTIMATOR_API_KEY;
  if (!apiKey) {
    throw new Error('ESTIMATOR_API_KEY environment variable is not set. Please configure it in your .env file.');
  }
  return apiKey;
}

/**
 * Create a new proposal via POST /v1/proposals
 *
 * @param input - Proposal creation parameters
 * @returns Promise resolving to the created proposal response
 * @throws {Error} if the request fails or environment variables are missing
 */
export async function createProposal(input: CreateProposalInput): Promise<CreateProposalResponse> {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();

  const formData = new FormData();
  formData.append('projectText', input.projectText);
  formData.append('projectName', input.projectName);
  formData.append('clientName', input.clientName);

  if (input.idempotencyKey) {
    formData.append('idempotencyKey', input.idempotencyKey);
  }

  if (input.files && input.files.length > 0) {
    for (const file of input.files) {
      const blob = new Blob([file.bytes], { type: file.type });
      formData.append('files', blob, file.name);
    }
  }

  const response = await fetch(`${baseUrl}/v1/proposals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: formData,
    signal: AbortSignal.timeout(60000)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to create proposal: ${response.status} ${response.statusText}. ${errorText}`);
  }

  return response.json();
}

/**
 * Get proposal status and details via GET /v1/proposals/:id
 *
 * @param jobId - The proposal job ID
 * @returns Promise resolving to the proposal details
 * @throws {Error} if the request fails or environment variables are missing
 */
export async function getProposal(jobId: string): Promise<GetProposalResponse> {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();

  const response = await fetch(`${baseUrl}/v1/proposals/${jobId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    signal: AbortSignal.timeout(60000)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to get proposal: ${response.status} ${response.statusText}. ${errorText}`);
  }

  return response.json();
}

/**
 * Download proposal file via GET /v1/proposals/:id/download
 * Handles 302 redirects by following the Location header without forwarding the API key
 *
 * @param jobId - The proposal job ID
 * @returns Promise resolving to the download response or redirect URL
 * @throws {Error} if the request fails or environment variables are missing
 */
export async function downloadProposal(jobId: string): Promise<DownloadProposalResponse> {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();

  const response = await fetch(`${baseUrl}/v1/proposals/${jobId}/download`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    redirect: 'manual',
    signal: AbortSignal.timeout(60000)
  });

  if (response.status === 302) {
    const location = response.headers.get('Location');
    if (location && location.startsWith('https')) {
      return { url: location };
    }
    throw new Error('Invalid redirect location received from download endpoint');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to download proposal: ${response.status} ${response.statusText}. ${errorText}`);
  }

  return response.json();
}
