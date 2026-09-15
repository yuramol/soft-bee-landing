import {
  CONTACT_ALLOWED_MIME_TYPES,
  CONTACT_KINDS,
  CONTACT_MAX_EMAIL_CHARS,
  CONTACT_MAX_FILE_BYTES,
  CONTACT_MAX_MESSAGE_CHARS,
  CONTACT_MAX_NAME_CHARS,
  CONTACT_MAX_ROLE_TITLE_CHARS
} from './constants';
import type { ContactKind } from './types';

export interface ContactValidationSuccess {
  ok: true;
  kind: ContactKind;
  fullName: string;
  email: string;
  message: string;
  roleTitle: string | null;
  file: File | null;
}

export interface ContactValidationFailure {
  ok: false;
  error: string;
}

export type ContactValidationResult = ContactValidationSuccess | ContactValidationFailure;

const ALLOWED_EXTENSIONS_BY_MIME: Record<(typeof CONTACT_ALLOWED_MIME_TYPES)[number], readonly string[]> = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

const MAGIC_SNIFF_BYTES = 512;
const DANGEROUS_TRAILING_EXTENSIONS = ['.exe', '.bat', '.cmd', '.com', '.js', '.mjs', '.vbs', '.ps1', '.scr', '.jar'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactSubmission(input: {
  kind: string | null;
  fullName: string | null;
  email: string | null;
  message: string | null;
  roleTitle: string | null;
  file: File | null;
  website: string | null;
}): ContactValidationResult {
  // Honeypot: bots fill hidden fields; treat as soft success upstream without sending mail.
  if (input.website && input.website.trim().length > 0) {
    return { ok: false, error: 'Invalid submission.' };
  }

  if (!input.kind || !isContactKind(input.kind)) {
    return { ok: false, error: 'Invalid form type.' };
  }

  const fullName = input.fullName?.trim() ?? '';
  if (fullName.length < 2) {
    return { ok: false, error: 'Full name is required.' };
  }
  if (fullName.length > CONTACT_MAX_NAME_CHARS) {
    return { ok: false, error: `Full name must be ${CONTACT_MAX_NAME_CHARS} characters or fewer.` };
  }

  const email = input.email?.trim() ?? '';
  if (!email || !EMAIL_PATTERN.test(email) || email.length > CONTACT_MAX_EMAIL_CHARS) {
    return { ok: false, error: 'A valid email address is required.' };
  }

  const message = input.message?.trim() ?? '';
  if (message.length > CONTACT_MAX_MESSAGE_CHARS) {
    return {
      ok: false,
      error: `Message must be ${CONTACT_MAX_MESSAGE_CHARS.toLocaleString('en-US')} characters or fewer.`
    };
  }

  const hasFile = input.file !== null;
  if (input.kind === 'discuss_project') {
    const hasMessage = message.length >= 10;
    if (!hasMessage && !hasFile) {
      return {
        ok: false,
        error: 'Please provide project details (at least 10 characters) or attach a file.'
      };
    }
    if (message.length > 0 && message.length < 10 && !hasFile) {
      return { ok: false, error: 'Please include a short message (at least 10 characters).' };
    }
  } else if (message.length < 10) {
    return { ok: false, error: 'Please include a short message (at least 10 characters).' };
  }

  const roleTitle = input.roleTitle?.trim() || null;
  if (input.kind === 'vacancy_application') {
    if (!roleTitle) {
      return { ok: false, error: 'Role title is required.' };
    }
    if (roleTitle.length > CONTACT_MAX_ROLE_TITLE_CHARS) {
      return { ok: false, error: `Role title must be ${CONTACT_MAX_ROLE_TITLE_CHARS} characters or fewer.` };
    }
  } else if (roleTitle && roleTitle.length > CONTACT_MAX_ROLE_TITLE_CHARS) {
    return { ok: false, error: `Role title must be ${CONTACT_MAX_ROLE_TITLE_CHARS} characters or fewer.` };
  }

  if (input.file) {
    const fileCheck = validateContactFileMetadata(input.file);
    if (!fileCheck.ok) {
      return fileCheck;
    }
  }

  return {
    ok: true,
    kind: input.kind,
    fullName,
    email,
    message,
    roleTitle,
    file: input.file
  };
}

/** Server-side: metadata checks plus magic-byte sniffing before attaching to Resend. */
export async function validateContactSubmissionWithContent(input: {
  kind: string | null;
  fullName: string | null;
  email: string | null;
  message: string | null;
  roleTitle: string | null;
  file: File | null;
  website: string | null;
}): Promise<ContactValidationResult> {
  const metadata = validateContactSubmission(input);
  if (!metadata.ok || !metadata.file) {
    return metadata;
  }

  const sniffed = await sniffContactFile(metadata.file);
  if (!sniffed.ok) {
    return sniffed;
  }

  return metadata;
}

export function isContactKind(value: string): value is ContactKind {
  return (CONTACT_KINDS as readonly string[]).includes(value);
}

function validateContactFileMetadata(file: File): ContactValidationResult | { ok: true } {
  if (file.size <= 0) {
    return { ok: false, error: 'Attached file is empty.' };
  }

  if (file.size > CONTACT_MAX_FILE_BYTES) {
    return { ok: false, error: 'File must be 10 MB or smaller.' };
  }

  if (hasSuspiciousDoubleExtension(file.name)) {
    return { ok: false, error: 'Unsupported file type. Use PDF, DOC, or DOCX.' };
  }

  if (!isAllowedContactFile(file)) {
    return { ok: false, error: 'Unsupported file type. Use PDF, DOC, or DOCX.' };
  }

  return { ok: true };
}

function isAllowedContactFile(file: File): boolean {
  const mime = file.type as (typeof CONTACT_ALLOWED_MIME_TYPES)[number];
  if (!(CONTACT_ALLOWED_MIME_TYPES as readonly string[]).includes(mime)) {
    return false;
  }

  const lowerName = file.name.toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS_BY_MIME[mime];
  return allowedExts.some((ext) => lowerName.endsWith(ext));
}

function hasSuspiciousDoubleExtension(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  const parts = lower.split('.');
  if (parts.length < 3) return false;

  const trailing = `.${parts[parts.length - 1] ?? ''}`;
  return DANGEROUS_TRAILING_EXTENSIONS.includes(trailing);
}

async function sniffContactFile(file: File): Promise<ContactValidationResult | { ok: true }> {
  const header = new Uint8Array(await file.slice(0, MAGIC_SNIFF_BYTES).arrayBuffer());

  if (file.type === 'application/pdf') {
    const prefix = String.fromCharCode(...header.slice(0, 5));
    if (prefix !== '%PDF-') {
      return { ok: false, error: 'Unsupported file type. Use PDF, DOC, or DOCX.' };
    }
    return { ok: true };
  }

  // DOC: OLE Compound File magic (D0 CF 11 E0 A1 B1 1A E1)
  if (file.type === 'application/msword') {
    const ole = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
    if (!ole.every((byte, index) => header[index] === byte)) {
      return { ok: false, error: 'Unsupported file type. Use PDF, DOC, or DOCX.' };
    }
    return { ok: true };
  }

  // DOCX: ZIP local file header PK\x03\x04
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    if (!(header[0] === 0x50 && header[1] === 0x4b && header[2] === 0x03 && header[3] === 0x04)) {
      return { ok: false, error: 'Unsupported file type. Use PDF, DOC, or DOCX.' };
    }
    return { ok: true };
  }

  return { ok: false, error: 'Unsupported file type. Use PDF, DOC, or DOCX.' };
}
