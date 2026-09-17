import { BRAND_ASSETS, BRAND_COLORS, getBrandAssetUrl } from '@/lib/brand/tokens';

import { escapeHtml, sanitizeEmailHeaderValue } from './escape';
import type { ContactKind } from './types';

export interface ContactEmailTemplateInput {
  kind: ContactKind;
  fullName: string;
  email: string;
  message: string;
  roleTitle: string | null;
  fileName: string | null;
}

const FONT_STACK = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

export function buildContactEmailSubject(kind: ContactKind, fullName: string, roleTitle: string | null): string {
  const safeName = sanitizeEmailHeaderValue(fullName) ?? fullName;

  if (kind === 'vacancy_application') {
    const role = roleTitle ? (sanitizeEmailHeaderValue(roleTitle) ?? roleTitle) : 'Open role';
    return `Careers application: ${role} — ${safeName}`;
  }

  return `Project inquiry — ${safeName}`;
}

export function buildContactEmailHtml(input: ContactEmailTemplateInput): string {
  const title = kindLabel(input.kind);
  const rows = buildMetaRows(input);
  const logoUrl = getBrandAssetUrl(BRAND_ASSETS.logoWhite);
  const gradientUrl = getBrandAssetUrl(BRAND_ASSETS.mainGradient);

  const messageBlock =
    input.message.trim().length > 0
      ? `
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND_COLORS.graphiteGray};">
          Message
        </p>
        <div style="margin:0;padding:16px;background:${BRAND_COLORS.mistGray};border-radius:16px;border:1px solid ${BRAND_COLORS.lightGray};">
          <pre style="margin:0;white-space:pre-wrap;font-family:inherit;font-size:15px;line-height:1.6;color:${BRAND_COLORS.black};">${escapeHtml(input.message)}</pre>
        </div>
      `
      : `
        <p style="margin:0;font-size:14px;color:${BRAND_COLORS.graphiteGray};">No message provided.</p>
      `;

  const metaRowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px 12px 0;vertical-align:top;width:120px;font-size:13px;font-weight:600;color:${BRAND_COLORS.graphiteGray};">
            ${escapeHtml(label)}
          </td>
          <td style="padding:12px 0;vertical-align:top;font-size:15px;color:${BRAND_COLORS.black};word-break:break-word;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND_COLORS.mistGray};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_COLORS.mistGray};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND_COLORS.white};border-radius:16px;overflow:hidden;border:1px solid ${BRAND_COLORS.lightGray};">
            <tr>
              <td
                align="center"
                style="padding:40px 24px;background-color:${BRAND_COLORS.black};background-image:url('${gradientUrl}');background-size:cover;background-position:center;"
              >
                <img
                  src="${logoUrl}"
                  width="165"
                  height="37"
                  alt="Soft Bee"
                  style="display:block;width:165px;height:37px;border:0;outline:none;text-decoration:none;"
                />
              </td>
            </tr>
            <tr>
              <td style="height:4px;line-height:4px;font-size:0;background:${BRAND_COLORS.electricGreen};">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:28px 24px 8px;font-family:${FONT_STACK};">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND_COLORS.digitalCyan};">
                  New submission
                </p>
                <h1 style="margin:0 0 20px;font-size:28px;line-height:1.25;font-weight:600;color:${BRAND_COLORS.black};">
                  ${escapeHtml(title)}
                </h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND_COLORS.lightGray};border-bottom:1px solid ${BRAND_COLORS.lightGray};">
                  ${metaRowsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;font-family:${FONT_STACK};">
                ${messageBlock}
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 28px;font-family:${FONT_STACK};">
                <p style="margin:0;font-size:12px;line-height:1.5;color:${BRAND_COLORS.graphiteGray};">
                  Reply directly to this email to respond to the sender.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export function buildContactEmailText(input: ContactEmailTemplateInput): string {
  const lines = [
    `Soft Bee — ${kindLabel(input.kind)}`,
    '',
    `Type: ${kindLabel(input.kind)}`,
    `Name: ${input.fullName}`,
    `Email: ${input.email}`
  ];

  if (input.roleTitle) {
    lines.push(`Role: ${input.roleTitle}`);
  }

  if (input.fileName) {
    lines.push(`Attachment: ${input.fileName}`);
  }

  lines.push('', 'Message:');
  lines.push(input.message.trim().length > 0 ? input.message : '(none)');
  lines.push('', 'Reply directly to this email to respond to the sender.');

  return lines.join('\n');
}

function kindLabel(kind: ContactKind): string {
  return kind === 'vacancy_application' ? 'Vacancy application' : 'Discuss project';
}

function buildMetaRows(input: ContactEmailTemplateInput): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ['Type', kindLabel(input.kind)],
    ['Name', input.fullName],
    ['Email', input.email]
  ];

  if (input.roleTitle) {
    rows.push(['Role', input.roleTitle]);
  }

  if (input.fileName) {
    rows.push(['Attachment', input.fileName]);
  }

  return rows;
}
