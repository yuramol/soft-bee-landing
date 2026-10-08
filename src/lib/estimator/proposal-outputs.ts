import type { ProposalOutputs } from './types';

/** Prefer new PDF output URL; fall back to legacy PPTX. */
export function getProposalDownloadUrl(outputs?: ProposalOutputs | null): string | undefined {
  return outputs?.pdfUrl ?? outputs?.pptxUrl;
}

export function getProposalFileName(outputs?: ProposalOutputs | null): string | undefined {
  const fileName = outputs?.fileName?.trim();
  return fileName && fileName.length > 0 ? fileName : undefined;
}

export function parseContentDispositionFileName(header: string | null | undefined): string | undefined {
  if (!header) return undefined;

  const utf8Match = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(header);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/^"|"$/g, ''));
    } catch {
      return utf8Match[1].trim().replace(/^"|"$/g, '');
    }
  }

  const plainMatch = /filename\s*=\s*("?)([^";]+)\1/i.exec(header);
  const plain = plainMatch?.[2]?.trim();
  return plain && plain.length > 0 ? plain : undefined;
}

export function resolveProposalDownloadFileName(options?: {
  outputs?: ProposalOutputs | null;
  contentDisposition?: string | null;
  fallback?: string;
}): string {
  return (
    parseContentDispositionFileName(options?.contentDisposition) ?? getProposalFileName(options?.outputs) ?? options?.fallback ?? 'proposal'
  );
}
