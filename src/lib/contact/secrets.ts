import { CONTACT_DEFAULT_FROM, CONTACT_DEFAULT_TO } from './constants';
import type { ContactKind } from './types';

export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function getContactFromAddress(): string {
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  return from && from.length > 0 ? from : CONTACT_DEFAULT_FROM;
}

/**
 * Recipients for one submission. Client forms (`discuss_project`, `partnership`) go to `CONTACT_TO_EMAIL`;
 * `vacancy_application` goes there too and additionally to `HR_TO_EMAIL`. Both variables may hold a
 * comma-separated list; duplicates are dropped.
 */
export function getContactToAddresses(kind: ContactKind): string[] {
  const clientAddresses = getClientToAddresses();
  if (kind !== 'vacancy_application') {
    return clientAddresses;
  }

  return uniqueAddresses([...clientAddresses, ...parseAddressList(process.env.HR_TO_EMAIL)]);
}

/** Main contact inbox (first `CONTACT_TO_EMAIL` entry) — shown to users when they should email us instead. */
export function getContactToAddress(): string {
  return getClientToAddresses()[0];
}

function getClientToAddresses(): string[] {
  const addresses = parseAddressList(process.env.CONTACT_TO_EMAIL);
  return addresses.length > 0 ? addresses : [CONTACT_DEFAULT_TO];
}

function parseAddressList(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter((address) => address.length > 0);
}

function uniqueAddresses(addresses: string[]): string[] {
  const seen = new Set<string>();
  return addresses.filter((address) => {
    const key = address.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function isContactMailConfigured(): boolean {
  return getResendApiKey() !== null;
}
