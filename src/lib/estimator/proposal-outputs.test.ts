import { describe, expect, it } from 'vitest';

import {
  getProposalDownloadUrl,
  getProposalFileName,
  parseContentDispositionFileName,
  resolveProposalDownloadFileName
} from './proposal-outputs';

describe('proposal-outputs', () => {
  it('prefers pdfUrl over pptxUrl', () => {
    expect(
      getProposalDownloadUrl({
        pdfUrl: 'https://example.com/pdf',
        pptxUrl: 'https://example.com/pptx'
      })
    ).toBe('https://example.com/pdf');
  });

  it('falls back to pptxUrl for legacy jobs', () => {
    expect(getProposalDownloadUrl({ pptxUrl: 'https://example.com/pptx' })).toBe('https://example.com/pptx');
  });

  it('reads fileName from outputs', () => {
    expect(getProposalFileName({ fileName: ' Example-project-proposal.pdf ' })).toBe('Example-project-proposal.pdf');
    expect(getProposalFileName({})).toBeUndefined();
  });

  it('parses Content-Disposition filenames', () => {
    expect(parseContentDispositionFileName('attachment; filename="estimation.pptx"')).toBe('estimation.pptx');
    expect(parseContentDispositionFileName("attachment; filename*=UTF-8''Example%20proposal.pdf")).toBe('Example proposal.pdf');
  });

  it('resolves download filename with Content-Disposition first', () => {
    expect(
      resolveProposalDownloadFileName({
        contentDisposition: 'attachment; filename="from-header.pdf"',
        outputs: { fileName: 'from-outputs.pdf' },
        fallback: 'proposal'
      })
    ).toBe('from-header.pdf');

    expect(
      resolveProposalDownloadFileName({
        outputs: { fileName: 'from-outputs.pdf' },
        fallback: 'proposal'
      })
    ).toBe('from-outputs.pdf');

    expect(resolveProposalDownloadFileName({})).toBe('proposal');
  });
});
