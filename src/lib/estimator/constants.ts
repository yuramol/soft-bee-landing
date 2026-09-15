export const ESTIMATOR_RECAPTCHA_ACTION = 'estimate_create';
export const RECAPTCHA_MIN_SCORE = 0.5;

export const ESTIMATOR_MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Max trimmed project text length (chars). Roughly caps prompt size before Railway. */
export const ESTIMATOR_MAX_TEXT_CHARS = 32_000;

export const ESTIMATOR_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

export const ESTIMATOR_FILE_ACCEPT = ESTIMATOR_ALLOWED_MIME_TYPES.join(',');

export const RATE_LIMIT_COOKIE_NAME = 'rate_limit_presentation';
export const RATE_LIMIT_MAX_PER_DAY = 10;
/** Short burst window: blocks dumping the daily quota in one spike. */
export const RATE_LIMIT_BURST_MAX = 5;
export const RATE_LIMIT_BURST_WINDOW_MS = 10 * 60 * 1000;

export const POLL_RATE_COOKIE_NAME = 'estimator_poll_rate';
export const POLL_RATE_WINDOW_MS = 60_000;
export const POLL_RATE_MAX_PER_WINDOW = 30;

export const OWNERSHIP_COOKIE_NAME = 'estimator_jobs';
export const OWNERSHIP_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const OWNERSHIP_MAX_JOBS = 20;

export const ESTIMATOR_REQUEST_TIMEOUT_MS = 30_000;
export const ESTIMATOR_DOWNLOAD_TIMEOUT_MS = 120_000;
