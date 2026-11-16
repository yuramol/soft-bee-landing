import { afterEach, describe, expect, it } from 'vitest';

import { CONTACT_MAX_FILE_BYTES } from './constants';
import { buildContactEmailHtml, buildContactEmailSubject, buildContactEmailText } from './email-template';
import { escapeHtml, sanitizeEmailHeaderValue } from './escape';
import { getContactToAddress, getContactToAddresses } from './secrets';
import { getContactFileError, validateContactSubmission, validateContactSubmissionWithContent } from './validate';

describe('contact recipients', () => {
  const previousTo = process.env.CONTACT_TO_EMAIL;
  const previousHr = process.env.HR_TO_EMAIL;

  afterEach(() => {
    restoreEnv('CONTACT_TO_EMAIL', previousTo);
    restoreEnv('HR_TO_EMAIL', previousHr);
  });

  it('falls back to the default inbox when unset or blank', () => {
    delete process.env.CONTACT_TO_EMAIL;
    expect(getContactToAddresses('discuss_project')).toEqual(['hello@softbee.com']);

    process.env.CONTACT_TO_EMAIL = ' , ';
    expect(getContactToAddresses('discuss_project')).toEqual(['hello@softbee.com']);
  });

  it('sends client forms only to CONTACT_TO_EMAIL, even when HR_TO_EMAIL is set', () => {
    process.env.CONTACT_TO_EMAIL = 'info@softbee.io';
    process.env.HR_TO_EMAIL = 'hr@softbee.io';

    expect(getContactToAddresses('discuss_project')).toEqual(['info@softbee.io']);
    expect(getContactToAddresses('partnership')).toEqual(['info@softbee.io']);
  });

  it('adds HR_TO_EMAIL for vacancy applications only', () => {
    process.env.CONTACT_TO_EMAIL = 'info@softbee.io';
    process.env.HR_TO_EMAIL = 'hr@softbee.io';

    expect(getContactToAddresses('vacancy_application')).toEqual(['info@softbee.io', 'hr@softbee.io']);
  });

  it('sends applications to CONTACT_TO_EMAIL alone while HR_TO_EMAIL is unset', () => {
    process.env.CONTACT_TO_EMAIL = 'info@softbee.io';
    delete process.env.HR_TO_EMAIL;

    expect(getContactToAddresses('vacancy_application')).toEqual(['info@softbee.io']);
  });

  it('splits comma-separated lists, trims whitespace and drops case-insensitive duplicates', () => {
    process.env.CONTACT_TO_EMAIL = 'info@softbee.io, sales@softbee.io ,,';
    process.env.HR_TO_EMAIL = 'HR@softbee.io, Info@softbee.io';

    expect(getContactToAddresses('vacancy_application')).toEqual(['info@softbee.io', 'sales@softbee.io', 'HR@softbee.io']);
    expect(getContactToAddress()).toBe('info@softbee.io');
  });

  it('deduplicates CONTACT_TO_EMAIL for client forms', () => {
    process.env.CONTACT_TO_EMAIL = 'info@softbee.io, Info@softbee.io, sales@softbee.io';

    expect(getContactToAddresses('discuss_project')).toEqual(['info@softbee.io', 'sales@softbee.io']);
    expect(getContactToAddresses('partnership')).toEqual(['info@softbee.io', 'sales@softbee.io']);
  });
});

function restoreEnv(name: 'CONTACT_TO_EMAIL' | 'HR_TO_EMAIL', value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

describe('contact email template', () => {
  const templateInput = {
    kind: 'discuss_project' as const,
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'We need a mobile app.',
    roleTitle: null,
    fileName: null
  };

  it('builds project inquiry subject', () => {
    expect(buildContactEmailSubject('discuss_project', 'Ada Lovelace', null)).toBe('Project inquiry — Ada Lovelace');
  });

  it('builds vacancy subject with role', () => {
    expect(buildContactEmailSubject('vacancy_application', 'Ada Lovelace', 'Engineer')).toBe(
      'Careers application: Engineer — Ada Lovelace'
    );
  });

  it('renders branded html with landing logo, colors, and escaped content', () => {
    const previousOrigins = process.env.SITE_ALLOWED_ORIGINS;
    process.env.SITE_ALLOWED_ORIGINS = 'https://softbee.io';

    try {
      const html = buildContactEmailHtml({
        ...templateInput,
        fullName: 'Ada <script>',
        message: 'Hello & welcome'
      });

      expect(html).toContain('alt="Soft Bee"');
      expect(html).toContain('https://softbee.io/brand/logo-white.svg');
      expect(html).toContain('https://softbee.io/backgrounds/main-gradient.webp');
      expect(html).toContain('#1b1c23');
      expect(html).toContain('#c3ff00');
      expect(html).toContain('Discuss project');
      expect(html).toContain('Ada &lt;script&gt;');
      expect(html).toContain('Hello &amp; welcome');
      expect(html).not.toContain('<script>');
    } finally {
      if (previousOrigins === undefined) {
        delete process.env.SITE_ALLOWED_ORIGINS;
      } else {
        process.env.SITE_ALLOWED_ORIGINS = previousOrigins;
      }
    }
  });

  it('includes role and attachment in text body', () => {
    const text = buildContactEmailText({
      kind: 'vacancy_application',
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Interested.',
      roleTitle: 'Designer',
      fileName: 'cv.pdf'
    });

    expect(text).toContain('Role: Designer');
    expect(text).toContain('Attachment: cv.pdf');
    expect(text).toContain('Interested.');
  });
});

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

  it('accepts PDF with empty MIME type and .pdf extension', () => {
    const file = new File(['%PDF-1.4'], 'resume.pdf', { type: '' });
    const result = validateContactSubmission({
      ...base,
      file
    });
    expect(result.ok).toBe(true);
  });

  it('accepts DOC with empty MIME type and .doc extension', () => {
    const file = new File(['doc'], 'resume.doc', { type: '' });
    const result = validateContactSubmission({
      ...base,
      file
    });
    expect(result.ok).toBe(true);
  });

  it('accepts DOCX with empty MIME type and .docx extension', () => {
    const file = new File(['docx'], 'resume.docx', { type: '' });
    const result = validateContactSubmission({
      ...base,
      file
    });
    expect(result.ok).toBe(true);
  });

  it('rejects empty MIME type with unsupported extension', () => {
    const file = new File(['data'], 'resume.txt', { type: '' });
    const result = validateContactSubmission({
      ...base,
      file
    });
    expect(result.ok).toBe(false);
  });
  it('accepts a DOCX reported as application/zip when the contents are a ZIP', async () => {
    const file = new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00])], 'resume.docx', { type: 'application/zip' });
    const result = await validateContactSubmissionWithContent({ ...base, file });
    expect(result.ok).toBe(true);
  });

  it('accepts a PDF reported as application/octet-stream when the contents are a PDF', async () => {
    const file = new File(['%PDF-1.4 mock'], 'resume.pdf', { type: 'application/octet-stream' });
    const result = await validateContactSubmissionWithContent({ ...base, file });
    expect(result.ok).toBe(true);
  });

  it('rejects an octet-stream file whose contents do not match its extension', async () => {
    const file = new File(['MZ fake exe'], 'resume.pdf', { type: 'application/octet-stream' });
    const result = await validateContactSubmissionWithContent({ ...base, file });
    expect(result.ok).toBe(false);
  });

  it('rejects a known MIME type paired with the wrong extension', () => {
    const file = new File(['%PDF-1.4'], 'resume.docx', { type: 'application/pdf' });
    const result = validateContactSubmission({ ...base, file });
    expect(result.ok).toBe(false);
  });
});

describe('getContactFileError', () => {
  it('returns null for a supported file', () => {
    expect(getContactFileError(new File(['%PDF-1.4'], 'cv.pdf', { type: 'application/pdf' }))).toBeNull();
  });

  it('rejects files over the upload limit with a readable message', () => {
    const file = new File([new Uint8Array(CONTACT_MAX_FILE_BYTES + 1)], 'cv.pdf', { type: 'application/pdf' });
    expect(getContactFileError(file)).toMatch(/4 MB/);
  });

  it('rejects empty files', () => {
    expect(getContactFileError(new File([], 'cv.pdf', { type: 'application/pdf' }))).toMatch(/empty/i);
  });

  it('rejects dangerous double extensions', () => {
    expect(getContactFileError(new File(['x'], 'cv.pdf.exe', { type: '' }))).toMatch(/unsupported/i);
  });
});
