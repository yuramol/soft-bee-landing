export const CONTACT_KINDS = ['discuss_project', 'vacancy_application'] as const;

export const CONTACT_RECAPTCHA_ACTIONS = {
  discuss_project: 'discuss_project',
  vacancy_application: 'vacancy_apply'
} as const;

export const CONTACT_RATE_LIMIT_COOKIE_NAME = 'rate_limit_contact';
export const CONTACT_RATE_LIMIT_MAX_PER_DAY = 5;
export const CONTACT_RATE_LIMIT_BURST_MAX = 3;
export const CONTACT_RATE_LIMIT_BURST_WINDOW_MS = 10 * 60 * 1000;

export const CONTACT_MAX_NAME_CHARS = 120;
export const CONTACT_MAX_EMAIL_CHARS = 254;
export const CONTACT_MAX_MESSAGE_CHARS = 5_000;
export const CONTACT_MAX_ROLE_TITLE_CHARS = 160;
export const CONTACT_MAX_FILE_BYTES = 5 * 1024 * 1024;

export const CONTACT_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

export const CONTACT_FILE_ACCEPT = CONTACT_ALLOWED_MIME_TYPES.join(',');

export const CONTACT_DEFAULT_FROM = 'Soft Bee <onboarding@resend.dev>';
export const CONTACT_DEFAULT_TO = 'hello@softbee.com';
