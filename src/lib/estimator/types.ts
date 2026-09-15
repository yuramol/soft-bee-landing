/**
 * File attachment for proposal creation
 */
export interface EstimatorFile {
  name: string;
  type: string;
  bytes: Buffer | Uint8Array;
}

/**
 * Input parameters for creating a new proposal
 */
export interface CreateProposalInput {
  projectText: string;
  projectName: string;
  clientName: string;
  files?: EstimatorFile[];
  idempotencyKey?: string;
}

/**
 * Response from POST /v1/proposals
 */
export interface CreateProposalResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

/**
 * Response from GET /v1/proposals/:id
 */
export interface GetProposalResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

/**
 * Response from GET /v1/proposals/:id/download
 */
export interface DownloadProposalResponse {
  url?: string;
  [key: string]: unknown;
}
