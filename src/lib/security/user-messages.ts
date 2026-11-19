/**
 * User-facing error texts shared by the form API routes (contact + Smart estimation).
 * Technical reasons (captcha score, missing env, upstream status) are logged server-side only.
 */
export const CAPTCHA_FAILED_MESSAGE = "We couldn't confirm you're not a bot. Please refresh the page and try again.";

export const TEMPORARILY_UNAVAILABLE_MESSAGE = 'The service is temporarily unavailable. Please try again in a few minutes.';
