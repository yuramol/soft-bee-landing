import { describe, expect, it } from 'vitest';

import { escapeHtml, sanitizeEmailHeaderValue } from './escape';
import { validateContactSubmission } from './validate';

describe('escapeHtml / sanitizeEmailHeaderValue', () => {
  it('escapes HTML entities', () => {
    expect(escapeHtml(`<script>"x"&'`)).toBe('&lt;script&gt;&quot;x&quot;&amp;&#39;');
  });

  it('strips header injection characters', () => {
    expect(sanitizeEmailHeaderValue('a\r\nBcc: evil@x.com')).toBe('aBcc: evil@x.com');
    expect(sanitizeEmailHeaderValue('Name <inject>')).toBe('Name inject');
  });
});

describe('validateContactSubmission', () => {
  const base = {
    kind: 'discuss_project',
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'We need a mobile app for our product.',
    roleTitle: null,
    file: null,
    website: null
  };

  it('accepts a valid discuss_project payload', () => {
    const result = validateContactSubmission(base);
    expect(result.ok).toBe(true);
  });

  it('rejects honeypot fills', () => {
    const result = validateContactSubmission({ ...base, website: 'http://spam.test' });
    expect(result.ok).toBe(false);
  });

  it('requires role title for vacancy applications', () => {
    const result = validateContactSubmission({
      ...base,
      kind: 'vacancy_application',
      roleTitle: null
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/role title/i);
    }
  });

  it('allows discuss_project with file and empty message', () => {
    const file = new File(['cv'], 'brief.pdf', { type: 'application/pdf' });
    const result = validateContactSubmission({
      ...base,
      message: '',
      file
    });
    expect(result.ok).toBe(true);
  });

  it('rejects oversized names', () => {
    const result = validateContactSubmission({
      ...base,
      fullName: 'x'.repeat(200)
    });
    expect(result.ok).toBe(false);
  });
});
