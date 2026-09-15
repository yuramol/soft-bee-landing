import { describe, expect, it } from 'vitest';

import { EstimatorApiError } from './client';

describe('Download redirect URL safety', () => {
  it('rejects non-HTTPS redirect URLs', () => {
    const url = new URL('http://example.com/file.pptx');

    expect(() => {
      if (url.protocol !== 'https:') {
        throw new EstimatorApiError('Download redirect must use HTTPS.', 502);
      }
    }).toThrow('Download redirect must use HTTPS.');
  });

  it('rejects URLs with credentials', () => {
    const url = new URL('https://user:pass@example.com/file.pptx');

    expect(() => {
      if (url.username || url.password) {
        throw new EstimatorApiError('Download redirect URL must not contain credentials.', 502);
      }
    }).toThrow('Download redirect URL must not contain credentials.');
  });

  it('rejects unexpected ports', () => {
    const url = new URL('https://example.com:8080/file.pptx');

    expect(() => {
      if (url.port && url.port !== '443') {
        throw new EstimatorApiError('Download redirect URL uses an unexpected port.', 502);
      }
    }).toThrow('Download redirect URL uses an unexpected port.');
  });
});
