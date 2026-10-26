import { CONTACT_DEFAULT_FROM, CONTACT_DEFAULT_TO } from './constants';

export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function getContactFromAddress(): string {
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  return from && from.length > 0 ? from : CONTACT_DEFAULT_FROM;
}

/** Recipients of contact emails: `CONTACT_TO_EMAIL`, comma-separated (e.g. `a@x.com, b@x.com`). */
export function getContactToAddresses(): string[] {
  const addresses = (process.env.CONTACT_TO_EMAIL ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter((address) => address.length > 0);

  return addresses.length > 0 ? addresses : [CONTACT_DEFAULT_TO];
}

/** First recipient — the address to show users when they should email us instead. */
export function getContactToAddress(): string {
  return getContactToAddresses()[0];
}

export function isContactMailConfigured(): boolean {
  return getResendApiKey() !== null;
}
