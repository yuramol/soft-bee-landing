import { CONTACT_DEFAULT_FROM, CONTACT_DEFAULT_TO } from './constants';

export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function getContactFromAddress(): string {
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  return from && from.length > 0 ? from : CONTACT_DEFAULT_FROM;
}

export function getContactToAddress(): string {
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  return to && to.length > 0 ? to : CONTACT_DEFAULT_TO;
}

export function isContactMailConfigured(): boolean {
  return getResendApiKey() !== null;
}
