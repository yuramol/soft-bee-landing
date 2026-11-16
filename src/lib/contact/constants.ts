import { MAX_UPLOAD_BYTES } from '@/lib/security/upload';

export const CONTACT_KINDS = ['discuss_project', 'vacancy_application', 'partnership'] as const;

export const CONTACT_RECAPTCHA_ACTIONS = {
  discuss_project: 'discuss_project',
  vacancy_application: 'vacancy_apply',
  partnership: 'partnership_apply'
} as const;

export const CONTACT_RATE_LIMIT_COOKIE_NAME = 'rate_limit_contact';
export const CONTACT_RATE_LIMIT_MAX_PER_DAY = 5;
export const CONTACT_RATE_LIMIT_BURST_MAX = 3;
export const CONTACT_RATE_LIMIT_BURST_WINDOW_MS = 10 * 60 * 1000;

export const CONTACT_MAX_NAME_CHARS = 120;
export const CONTACT_MAX_EMAIL_CHARS = 254;
export const CONTACT_MAX_MESSAGE_CHARS = 32_000;
export const CONTACT_MAX_ROLE_TITLE_CHARS = 160;
export const CONTACT_MAX_FILE_BYTES = MAX_UPLOAD_BYTES;

export const CONTACT_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

export const CONTACT_ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

/** Extensions are listed too: mobile pickers often grey out documents when `accept` holds MIME types only. */
export const CONTACT_FILE_ACCEPT = [...CONTACT_ALLOWED_EXTENSIONS, ...CONTACT_ALLOWED_MIME_TYPES].join(',');

export const CONTACT_UNSUPPORTED_FILE_MESSAGE = 'Unsupported file type. Use PDF, DOC, or DOCX.';

export const CONTACT_DEFAULT_FROM = 'Soft Bee <onboarding@resend.dev>';
export const CONTACT_DEFAULT_TO = 'hello@softbee.com';
