import { Resend } from 'resend';

import {
  buildContactEmailHtml,
  buildContactEmailSubject,
  buildContactEmailText
} from './email-template';
import { sanitizeEmailHeaderValue } from './escape';
import { getContactFromAddress, getContactToAddress, getResendApiKey } from './secrets';
import type { ContactKind } from './types';

export interface SendContactEmailInput {
  kind: ContactKind;
  fullName: string;
  email: string;
  message: string;
  roleTitle: string | null;
  file: File | null;
}

export interface SendContactEmailResult {
  ok: boolean;
  error?: string;
}

export async function sendContactEmail(input: SendContactEmailInput): Promise<SendContactEmailResult> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { ok: false, error: 'Mail is not configured.' };
  }

  const safeName = sanitizeEmailHeaderValue(input.fullName);
  const safeEmail = sanitizeEmailHeaderValue(input.email);
  if (!safeName || !safeEmail) {
    return { ok: false, error: 'Invalid sender details.' };
  }

  const fileName = input.file ? sanitizeAttachmentName(input.file.name) : null;
  const templateInput = {
    kind: input.kind,
    fullName: input.fullName,
    email: input.email,
    message: input.message,
    roleTitle: input.roleTitle,
    fileName
  };

  const subject = buildContactEmailSubject(input.kind, safeName, input.roleTitle);
  const html = buildContactEmailHtml(templateInput);
  const text = buildContactEmailText(templateInput);

  const attachments = input.file
    ? [
        {
          filename: fileName ?? 'attachment',
          content: Buffer.from(await input.file.arrayBuffer())
        }
      ]
    : undefined;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getContactFromAddress(),
    to: [getContactToAddress()],
    replyTo: safeEmail,
    subject,
    html,
    text,
    attachments
  });

  if (error) {
    console.error('Resend send failed:', error.message);
    return { ok: false, error: 'Failed to send message.' };
  }

  return { ok: true };
}

function sanitizeAttachmentName(name: string): string {
  const cleaned = name.replace(/[^\w.\- ()[\]]+/g, '_').slice(0, 120);
  return cleaned.length > 0 ? cleaned : 'attachment';
}
