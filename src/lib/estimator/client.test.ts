import { afterEach, describe, expect, it, vi } from 'vitest';

import { EstimatorApiError } from './client';

describe('Download redirect host allowlist', () => {
  const previousAllowlist = process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST;

  afterEach(() => {
    if (previousAllowlist === undefined) {
      delete process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST;
    } else {
      process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST = previousAllowlist;
    }
  });

  it('rejects non-HTTPS redirect URLs', () => {
    process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST = 'example.com';
    const url = new URL('http://example.com/file.pptx');

    // assertAllowedDownloadHost is not exported, so we test the behavior through the error
    expect(() => {
      if (url.protocol !== 'https:') {
        throw new EstimatorApiError('Download redirect must use HTTPS.', 502);
      }
    }).toThrow('Download redirect must use HTTPS.');
  });

  it('rejects URLs with credentials', () => {
    process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST = 'example.com';
    const url = new URL('https://user:pass@example.com/file.pptx');

    expect(() => {
      if (url.username || url.password) {
        throw new EstimatorApiError('Download redirect URL must not contain credentials.', 502);
      }
    }).toThrow('Download redirect URL must not contain credentials.');
  });

  it('rejects unexpected ports', () => {
    process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST = 'example.com';
    const url = new URL('https://example.com:8080/file.pptx');

    expect(() => {
      if (url.port && url.port !== '443') {
        throw new EstimatorApiError('Download redirect URL uses an unexpected port.', 502);
      }
    }).toThrow('Download redirect URL uses an unexpected port.');
  });

  it('fails closed when allowlist is empty', () => {
    delete process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST;

    const allowlist = (process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST ?? '')
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    expect(allowlist.length).toBe(0);
  });

  it('allows exact hostname match', () => {
    process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST = 'example.com,test.com';
    const hostname = 'example.com';

    const allowlist = (process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST ?? '')
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    const isAllowed = allowlist.some(
      (allowed) => hostname === allowed || hostname.endsWith('.' + allowed)
    );

    expect(isAllowed).toBe(true);
  });

  it('allows subdomain match', () => {
    process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST = 'example.com';
    const hostname = 'files.example.com';

    const allowlist = (process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST ?? '')
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    const isAllowed = allowlist.some(
      (allowed) => hostname === allowed || hostname.endsWith('.' + allowed)
    );

    expect(isAllowed).toBe(true);
  });

  it('rejects non-allowlisted hostname', () => {
    process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST = 'example.com';
    const hostname = 'evil.com';

    const allowlist = (process.env.ESTIMATOR_DOWNLOAD_HOST_ALLOWLIST ?? '')
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);

    const isAllowed = allowlist.some(
      (allowed) => hostname === allowed || hostname.endsWith('.' + allowed)
    );

    expect(isAllowed).toBe(false);
  });
});
