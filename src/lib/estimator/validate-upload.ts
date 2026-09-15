import { ESTIMATOR_ALLOWED_MIME_TYPES, ESTIMATOR_MAX_FILE_BYTES, ESTIMATOR_MAX_TEXT_CHARS } from './constants';

export interface UploadValidationSuccess {
  ok: true;
}

export interface UploadValidationFailure {
  ok: false;
  error: string;
}

export type UploadValidationResult = UploadValidationSuccess | UploadValidationFailure;

const ALLOWED_EXTENSIONS_BY_MIME: Record<(typeof ESTIMATOR_ALLOWED_MIME_TYPES)[number], readonly string[]> = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md', '.markdown'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

const MAGIC_SNIFF_BYTES = 512;
const DANGEROUS_TRAILING_EXTENSIONS = ['.exe', '.bat', '.cmd', '.com', '.js', '.mjs', '.vbs', '.ps1', '.scr', '.jar'];

export function validateEstimatorUpload(input: {
  text: string | null;
  file: File | null;
  minTextLength?: number;
}): UploadValidationResult {
  const minTextLength = input.minTextLength ?? 10;
  const trimmedText = input.text?.trim() ?? '';
  const hasText = trimmedText.length >= minTextLength;
  const hasFile = input.file !== null;

  if (!hasText && !hasFile) {
    return {
      ok: false,
      error: `Provide at least ${minTextLength} characters of project text, or attach a supported file.`
    };
  }

  if (trimmedText.length > ESTIMATOR_MAX_TEXT_CHARS) {
    return {
      ok: false,
      error: `Project text must be ${ESTIMATOR_MAX_TEXT_CHARS.toLocaleString('en-US')} characters or fewer.`
    };
  }

  if (input.file) {
    if (input.file.size > ESTIMATOR_MAX_FILE_BYTES) {
      return { ok: false, error: 'File must be 25 MB or smaller.' };
    }

    if (hasSuspiciousDoubleExtension(input.file.name)) {
      return {
        ok: false,
        error: 'Unsupported file type. Use PDF, TXT, Markdown, DOC, or DOCX.'
      };
    }

    if (!isAllowedUploadFile(input.file)) {
      return {
        ok: false,
        error: 'Unsupported file type. Use PDF, TXT, Markdown, DOC, or DOCX.'
      };
    }
  }

  return { ok: true };
}

/** Server-side: metadata checks plus magic-byte sniffing before forwarding to Railway. */
export async function validateEstimatorUploadWithContent(input: {
  text: string | null;
  file: File | null;
  minTextLength?: number;
}): Promise<UploadValidationResult> {
  const metadata = validateEstimatorUpload(input);
  if (!metadata.ok || !input.file) {
    return metadata;
  }

  const headSize = Math.min(MAGIC_SNIFF_BYTES, input.file.size);
  const head = new Uint8Array(await input.file.slice(0, headSize).arrayBuffer());
  if (!matchesMagicForFile(input.file, head)) {
    return {
      ok: false,
      error: 'File contents do not match the declared type. Use PDF, TXT, Markdown, DOC, or DOCX.'
    };
  }

  return { ok: true };
}

function isAllowedUploadFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  const mimeType = file.type || '';

  if (mimeType) {
    if (!isAllowedMimeType(mimeType)) {
      return false;
    }

    const allowedExtensions = ALLOWED_EXTENSIONS_BY_MIME[mimeType];
    return allowedExtensions.includes(extension);
  }

  // Browsers often leave type empty for .txt / .md; fall back to extension.
  return isAllowedExtension(file.name);
}

function isAllowedMimeType(mimeType: string): mimeType is (typeof ESTIMATOR_ALLOWED_MIME_TYPES)[number] {
  return (ESTIMATOR_ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}

function isAllowedExtension(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  return Object.values(ALLOWED_EXTENSIONS_BY_MIME).some((extensions) => extensions.includes(extension));
}

function getFileExtension(fileName: string): string {
  const lowerName = fileName.toLowerCase().trim();
  const lastDot = lowerName.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === lowerName.length - 1) {
    return '';
  }

  return lowerName.slice(lastDot);
}

function hasSuspiciousDoubleExtension(fileName: string): boolean {
  const lowerName = fileName.toLowerCase().trim();
  const parts = lowerName.split('.').filter((part) => part.length > 0);
  if (parts.length < 3) {
    return false;
  }

  const trailing = `.${parts[parts.length - 1]}`;
  return DANGEROUS_TRAILING_EXTENSIONS.includes(trailing);
}

function matchesMagicForFile(file: File, head: Uint8Array): boolean {
  const mimeType = file.type || '';
  const extension = getFileExtension(file.name);

  if (mimeType === 'application/pdf' || extension === '.pdf') {
    return startsWithAscii(head, '%PDF-');
  }

  if (mimeType === 'application/msword' || extension === '.doc') {
    // OLE Compound File (legacy .doc)
    return (
      head.length >= 4 && head[0] === 0xd0 && head[1] === 0xcf && head[2] === 0x11 && head[3] === 0xe0
    );
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === '.docx'
  ) {
    // ZIP local file header (DOCX is OOXML)
    return head.length >= 4 && head[0] === 0x50 && head[1] === 0x4b && (head[2] === 0x03 || head[2] === 0x05 || head[2] === 0x07);
  }

  if (
    mimeType === 'text/plain' ||
    mimeType === 'text/markdown' ||
    extension === '.txt' ||
    extension === '.md' ||
    extension === '.markdown'
  ) {
    return looksLikeText(head);
  }

  return false;
}

function startsWithAscii(bytes: Uint8Array, ascii: string): boolean {
  if (bytes.length < ascii.length) {
    return false;
  }

  for (let index = 0; index < ascii.length; index += 1) {
    if (bytes[index] !== ascii.charCodeAt(index)) {
      return false;
    }
  }

  return true;
}

function looksLikeText(bytes: Uint8Array): boolean {
  if (bytes.length === 0) {
    return true;
  }

  let suspicious = 0;
  for (const byte of bytes) {
    if (byte === 0) {
      return false;
    }

    // Allow common UTF-8 / whitespace; flag other control chars.
    if (byte < 9 || (byte > 13 && byte < 32)) {
      suspicious += 1;
    }
  }

  return suspicious / bytes.length < 0.3;
}
