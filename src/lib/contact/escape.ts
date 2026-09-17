/** Escape text for safe inclusion in HTML email bodies. */
export function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

/** Strip CR/LF and angle brackets that enable header injection. */
export function sanitizeEmailHeaderValue(value: string): string {
  return value.replace(/[\r\n<>]/g, '').trim();
}
