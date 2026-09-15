import { Resend } from 'resend';

import { escapeHtml, sanitizeEmailHeaderValue } from './escape';
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

  const subject = buildSubject(input.kind, safeName, input.roleTitle);
  const html = buildHtmlBody(input);
  const text = buildTextBody(input);

  const attachments = input.file
    ? [
        {
          filename: sanitizeAttachmentName(input.file.name),
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

function buildSubject(kind: ContactKind, fullName: string, roleTitle: string | null): string {
  if (kind === 'vacancy_application') {
    const role = roleTitle ? sanitizeEmailHeaderValue(roleTitle) : 'Open role';
    return `Careers application: ${role} — ${fullName}`;
  }

  return `Project inquiry — ${fullName}`;
}

function buildHtmlBody(input: SendContactEmailInput): string {
  const rows: Array<[string, string]> = [
    ['Type', input.kind === 'vacancy_application' ? 'Vacancy application' : 'Discuss project'],
    ['Name', input.fullName],
    ['Email', input.email]
  ];

  if (input.roleTitle) {
    rows.push(['Role', input.roleTitle]);
  }

  if (input.file) {
    rows.push(['Attachment', input.file.name]);
  }

  const meta = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;color:#666;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
      <table style="border-collapse:collapse;margin-bottom:16px;">${meta}</table>
      <p style="margin:0 0 8px;color:#666;">Message</p>
      <pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${escapeHtml(input.message)}</pre>
    </div>
  `.trim();
}

function buildTextBody(input: SendContactEmailInput): string {
  const lines = [
    `Type: ${input.kind === 'vacancy_application' ? 'Vacancy application' : 'Discuss project'}`,
    `Name: ${input.fullName}`,
    `Email: ${input.email}`
  ];

  if (input.roleTitle) {
    lines.push(`Role: ${input.roleTitle}`);
  }

  if (input.file) {
    lines.push(`Attachment: ${input.file.name}`);
  }

  lines.push('', 'Message:', input.message);
  return lines.join('\n');
}

function sanitizeAttachmentName(name: string): string {
  const cleaned = name.replace(/[^\w.\- ()[\]]+/g, '_').slice(0, 120);
  return cleaned.length > 0 ? cleaned : 'attachment';
}
