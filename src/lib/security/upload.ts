/**
 * Shared upload limits for every form that accepts a file (contact forms + Smart estimation).
 *
 * Vercel rejects serverless request bodies above ~4.5 MB before our route runs (plain-text 413),
 * so the file cap stays under that with headroom for multipart overhead and the other form fields.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = '4 MB';

export const FILE_TOO_LARGE_MESSAGE = `File is too large. Maximum size is ${MAX_UPLOAD_LABEL}.`;

/**
 * MIME types some browsers/OSes report for documents instead of the real one
 * (Windows without Office → octet-stream; Android/Windows → zip for .docx).
 * Treated as "unknown": the type is resolved from the extension and confirmed by magic bytes server-side.
 */
const GENERIC_MIME_TYPES: readonly string[] = [
  'application/octet-stream',
  'binary/octet-stream',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip'
];

/** File MIME type, or `''` when the browser gave none or only a generic placeholder. */
export function getSpecificMimeType(file: Pick<File, 'type'>): string {
  const mimeType = file.type.trim().toLowerCase();
  return GENERIC_MIME_TYPES.includes(mimeType) ? '' : mimeType;
}

/** Lowercased extension including the dot (`.pdf`), or `''` when the name has none. */
export function getFileExtension(fileName: string): string {
  const lowerName = fileName.toLowerCase().trim();
  const lastDot = lowerName.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === lowerName.length - 1) {
    return '';
  }

  return lowerName.slice(lastDot);
}
