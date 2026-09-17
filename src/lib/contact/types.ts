import type { CONTACT_KINDS } from './constants';

export type ContactKind = (typeof CONTACT_KINDS)[number];

export interface ContactSubmissionInput {
  kind: ContactKind;
  fullName: string;
  email: string;
  message: string;
  roleTitle?: string;
  file?: File | null;
  captchaToken: string;
  /** Honeypot — must be empty when present. */
  website?: string;
}

export interface ContactSubmissionSuccess {
  ok: true;
}

export interface ContactSubmissionFailure {
  ok: false;
  error: string;
  status: number;
}
