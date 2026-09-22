export type ProposalStatus = 'queued' | 'processing' | 'completed' | 'failed' | string;

export interface ProposalEstimate {
  hours?: string;
  price?: string;
  hoursMin?: number;
  hoursMax?: number;
  priceMin?: number;
  priceMax?: number;
}

export interface CreateProposalInput {
  projectText?: string;
  file?: File | Blob;
  fileName?: string;
  idempotencyKey?: string;
}

export interface CreateProposalResult {
  jobId: string;
  status: ProposalStatus;
}

export interface ProposalStatusResult {
  jobId: string;
  status: ProposalStatus;
  progress?: number;
  stage?: string;
  estimate?: ProposalEstimate;
  error?: string;
}

export interface DownloadProposalResult {
  body: ReadableStream<Uint8Array> | null;
  contentType: string;
  contentDisposition: string | null;
  contentLength: string | null;
}
