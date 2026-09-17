import { afterEach, describe, expect, it } from 'vitest';

import { ESTIMATOR_MAX_FILE_BYTES, ESTIMATOR_MAX_TEXT_CHARS } from './constants';
import { formatEstimateHours, formatEstimatePrice } from './format-estimate';
import { isJsonObject, parseJsonValue } from './json';
import { isAllowedEstimatorOrigin, isAllowedRecaptchaHostname } from './origin';
import { appendOwnedJob, readSignedOwnershipPayload, signOwnershipPayload } from './ownership-token';
import { validateEstimatorUpload, validateEstimatorUploadWithContent } from './validate-upload';

describe('validateEstimatorUpload', () => {
  it('rejects empty text without a file', () => {
    const result = validateEstimatorUpload({ text: 'short', file: null });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/at least 10 characters/i);
    }
  });

  it('accepts long enough text without a file', () => {
    const result = validateEstimatorUpload({ text: 'x'.repeat(10), file: null });
    expect(result.ok).toBe(true);
  });

  it('accepts a supported file without text', () => {
    const result = validateEstimatorUpload({
      text: null,
      file: mockFile({ name: 'brief.pdf', type: 'application/pdf', size: 1024, bytes: pdfBytes() })
    });

    expect(result.ok).toBe(true);
  });

  it('rejects unsupported MIME types', () => {
    const result = validateEstimatorUpload({
      text: 'x'.repeat(10),
      file: mockFile({ name: 'photo.png', type: 'image/png', size: 1024 })
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/unsupported file type/i);
    }
  });

  it('rejects MIME/extension mismatches', () => {
    const result = validateEstimatorUpload({
      text: null,
      file: mockFile({ name: 'brief.txt', type: 'application/pdf', size: 1024, bytes: pdfBytes() })
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/unsupported file type/i);
    }
  });

  it('rejects dangerous double extensions', () => {
    const result = validateEstimatorUpload({
      text: null,
      file: mockFile({ name: 'brief.pdf.exe', type: 'application/pdf', size: 1024, bytes: pdfBytes() })
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/unsupported file type/i);
    }
  });

  it('accepts allowed extensions when MIME type is empty', () => {
    const result = validateEstimatorUpload({
      text: null,
      file: mockFile({ name: 'brief.txt', type: '', size: 1024, bytes: textBytes('hello world') })
    });

    expect(result.ok).toBe(true);
  });

  it('rejects empty MIME types with unsupported extensions', () => {
    const result = validateEstimatorUpload({
      text: 'x'.repeat(10),
      file: mockFile({ name: 'photo.png', type: '', size: 1024 })
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/unsupported file type/i);
    }
  });

  it('rejects files over 10 MB', () => {
    const result = validateEstimatorUpload({
      text: 'x'.repeat(10),
      file: mockFile({
        name: 'huge.pdf',
        type: 'application/pdf',
        size: ESTIMATOR_MAX_FILE_BYTES + 1,
        bytes: pdfBytes()
      })
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/10 MB/i);
    }
  });

  it('respects custom minTextLength', () => {
    const result = validateEstimatorUpload({ text: 'abcd', file: null, minTextLength: 5 });
    expect(result.ok).toBe(false);
  });

  it('rejects text over the max character limit', () => {
    const result = validateEstimatorUpload({
      text: 'x'.repeat(ESTIMATOR_MAX_TEXT_CHARS + 1),
      file: null
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/characters or fewer/i);
    }
  });

  it('accepts text at the max character limit', () => {
    const result = validateEstimatorUpload({
      text: 'x'.repeat(ESTIMATOR_MAX_TEXT_CHARS),
      file: null
    });

    expect(result.ok).toBe(true);
  });
});

describe('validateEstimatorUploadWithContent', () => {
  it('accepts PDF magic bytes', async () => {
    const result = await validateEstimatorUploadWithContent({
      text: null,
      file: mockFile({ name: 'brief.pdf', type: 'application/pdf', size: 1024, bytes: pdfBytes() })
    });

    expect(result.ok).toBe(true);
  });

  it('rejects PDF extension with non-PDF contents', async () => {
    const result = await validateEstimatorUploadWithContent({
      text: null,
      file: mockFile({
        name: 'brief.pdf',
        type: 'application/pdf',
        size: 64,
        bytes: textBytes('not a pdf')
      })
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/do not match/i);
    }
  });

  it('rejects binary disguised as text', async () => {
    const result = await validateEstimatorUploadWithContent({
      text: null,
      file: mockFile({
        name: 'brief.txt',
        type: 'text/plain',
        size: 8,
        bytes: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7])
      })
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/do not match/i);
    }
  });

  it('accepts DOCX ZIP magic bytes', async () => {
    const result = await validateEstimatorUploadWithContent({
      text: null,
      file: mockFile({
        name: 'brief.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 64,
        bytes: new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00])
      })
    });

    expect(result.ok).toBe(true);
  });
});

describe('ownership-token', () => {
  const secret = 'test-ownership-secret';
  const now = 1_700_000_000;

  it('round-trips signed ownership payloads', () => {
    const payload = appendOwnedJob({ v: 1, jobs: [] }, 'job-1', now);
    const cookie = signOwnershipPayload(payload, secret);
    const parsed = readSignedOwnershipPayload(cookie, secret, now);

    expect(parsed.jobs.map((job) => job.id)).toEqual(['job-1']);
  });

  it('rejects forged unsigned job lists', () => {
    const forged = JSON.stringify({ jobIds: ['victim-job'] });
    const parsed = readSignedOwnershipPayload(forged, secret, now);
    expect(parsed.jobs).toEqual([]);
  });

  it('rejects tampered signatures', () => {
    const payload = appendOwnedJob({ v: 1, jobs: [] }, 'job-1', now);
    const cookie = signOwnershipPayload(payload, secret);
    const [body] = cookie.split('.');
    const tampered = `${body}.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;
    const parsed = readSignedOwnershipPayload(tampered, secret, now);
    expect(parsed.jobs).toEqual([]);
  });

  it('drops expired jobs', () => {
    const payload = {
      v: 1 as const,
      jobs: [
        { id: 'old', exp: now - 1 },
        { id: 'fresh', exp: now + 60 }
      ]
    };
    const cookie = signOwnershipPayload(payload, secret);
    const parsed = readSignedOwnershipPayload(cookie, secret, now);
    expect(parsed.jobs.map((job) => job.id)).toEqual(['fresh']);
  });
});

describe('isAllowedEstimatorOrigin', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousAllowedOrigins = process.env.SITE_ALLOWED_ORIGINS;

  afterEach(() => {
    process.env.NODE_ENV = previousNodeEnv;
    if (previousAllowedOrigins === undefined) {
      delete process.env.SITE_ALLOWED_ORIGINS;
    } else {
      process.env.SITE_ALLOWED_ORIGINS = previousAllowedOrigins;
    }
  });

  it('allows localhost in development', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.SITE_ALLOWED_ORIGINS;

    const allowed = isAllowedEstimatorOrigin(
      new Request('http://localhost:3000/api/presentation/generate', {
        headers: { origin: 'http://localhost:3000' }
      })
    );

    expect(allowed).toBe(true);
  });

  it('allows 127.0.0.1 in development', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.SITE_ALLOWED_ORIGINS;

    const allowed = isAllowedEstimatorOrigin(
      new Request('http://127.0.0.1:3000/api/presentation/generate', {
        headers: { origin: 'http://127.0.0.1:3000' }
      })
    );

    expect(allowed).toBe(true);
  });

  it('rejects unknown origins in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.SITE_ALLOWED_ORIGINS = 'https://softbee.io';

    const allowed = isAllowedEstimatorOrigin(
      new Request('https://softbee.io/api/presentation/generate', {
        headers: { origin: 'https://evil.example' }
      })
    );

    expect(allowed).toBe(false);
  });

  it('allows listed production origins', () => {
    process.env.NODE_ENV = 'production';
    process.env.SITE_ALLOWED_ORIGINS = 'https://softbee.io, https://www.softbee.io';

    const allowed = isAllowedEstimatorOrigin(
      new Request('https://www.softbee.io/api/presentation/generate', {
        headers: { origin: 'https://www.softbee.io' }
      })
    );

    expect(allowed).toBe(true);
  });

  it('rejects Referer-only requests in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.SITE_ALLOWED_ORIGINS = 'https://softbee.io';

    const allowed = isAllowedEstimatorOrigin(
      new Request('https://softbee.io/api/presentation/generate', {
        headers: { referer: 'https://softbee.io/home' }
      })
    );

    expect(allowed).toBe(false);
  });

  it('allows Referer fallback in development', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.SITE_ALLOWED_ORIGINS;

    const allowed = isAllowedEstimatorOrigin(
      new Request('http://localhost:3000/api/presentation/generate', {
        headers: { referer: 'http://localhost:3000/home' }
      })
    );

    expect(allowed).toBe(true);
  });

  it('rejects requests with no Origin or Referer', () => {
    process.env.NODE_ENV = 'production';
    process.env.SITE_ALLOWED_ORIGINS = 'https://softbee.io';

    const allowed = isAllowedEstimatorOrigin(new Request('https://softbee.io/api/presentation/generate'));
    expect(allowed).toBe(false);
  });
});

describe('isAllowedRecaptchaHostname', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousAllowedOrigins = process.env.SITE_ALLOWED_ORIGINS;

  afterEach(() => {
    process.env.NODE_ENV = previousNodeEnv;
    if (previousAllowedOrigins === undefined) {
      delete process.env.SITE_ALLOWED_ORIGINS;
    } else {
      process.env.SITE_ALLOWED_ORIGINS = previousAllowedOrigins;
    }
  });

  it('allows localhost hostnames in development', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.SITE_ALLOWED_ORIGINS;

    expect(isAllowedRecaptchaHostname('localhost')).toBe(true);
    expect(isAllowedRecaptchaHostname('127.0.0.1')).toBe(true);
  });

  it('allows configured production hostnames only', () => {
    process.env.NODE_ENV = 'production';
    process.env.SITE_ALLOWED_ORIGINS = 'https://softbee.io,https://www.softbee.io';

    expect(isAllowedRecaptchaHostname('softbee.io')).toBe(true);
    expect(isAllowedRecaptchaHostname('www.softbee.io')).toBe(true);
    expect(isAllowedRecaptchaHostname('evil.example')).toBe(false);
    expect(isAllowedRecaptchaHostname('localhost')).toBe(false);
  });
});

describe('formatEstimateHours / formatEstimatePrice', () => {
  it('prefers explicit hours string', () => {
    expect(formatEstimateHours({ hours: ' 20-25 hours ' })).toBe('20-25 hours');
  });

  it('formats hour ranges from min/max', () => {
    expect(formatEstimateHours({ hoursMin: 20, hoursMax: 25 })).toBe('20-25 hours');
    expect(formatEstimateHours({ hoursMin: 20 })).toBe('20+ hours');
    expect(formatEstimateHours({ hoursMax: 25 })).toBe('up to 25 hours');
  });

  it('returns null when hours data is missing', () => {
    expect(formatEstimateHours(null)).toBeNull();
    expect(formatEstimateHours({})).toBeNull();
  });

  it('prefers explicit price string', () => {
    expect(formatEstimatePrice({ price: ' $10k ' })).toBe('$10k');
  });

  it('formats USD price ranges', () => {
    expect(formatEstimatePrice({ priceMin: 350000, priceMax: 450000 })).toBe('$350,000 - $450,000 approximately for the work');
    expect(formatEstimatePrice({ priceMin: 350000 })).toBe('from $350,000 approximately for the work');
    expect(formatEstimatePrice({ priceMax: 450000 })).toBe('up to $450,000 approximately for the work');
  });
});

describe('json helpers', () => {
  it('parseJsonValue parses objects and arrays', () => {
    const objectValue = parseJsonValue('{"jobIds":["a"]}');
    expect(isJsonObject(objectValue)).toBe(true);

    const arrayValue = parseJsonValue('[1,2]');
    expect(Array.isArray(arrayValue)).toBe(true);
  });

  it('isJsonObject rejects arrays and primitives', () => {
    expect(isJsonObject([])).toBe(false);
    expect(isJsonObject('x')).toBe(false);
    expect(isJsonObject(null)).toBe(false);
    expect(isJsonObject({ ok: true })).toBe(true);
  });
});

function pdfBytes(): Uint8Array {
  return textBytes('%PDF-1.4 mock');
}

function textBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function mockFile(input: { name: string; type: string; size: number; bytes?: Uint8Array }): File {
  const bytes = input.bytes ?? new Uint8Array(0);

  return {
    name: input.name,
    type: input.type,
    size: input.size,
    slice(start?: number, end?: number) {
      const sliced = bytes.slice(start ?? 0, end ?? bytes.length);
      return {
        arrayBuffer: async () => sliced.buffer.slice(sliced.byteOffset, sliced.byteOffset + sliced.byteLength)
      };
    },
    arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  } as File;
}
