import { fetchOrNetworkError, readApiError } from '@/lib/api/read-api-error';
import type { ContactKind } from '@/lib/contact/types';

export async function submitContactForm(
  input: {
    kind: ContactKind;
    fullName: string;
    email: string;
    message: string;
    roleTitle?: string;
    file?: File | null;
    captchaToken: string;
    /** Honeypot field — leave empty. */
    website?: string;
  },
  signal?: AbortSignal
): Promise<void> {
  const formData = new FormData();
  formData.append('kind', input.kind);
  formData.append('fullName', input.fullName);
  formData.append('email', input.email);
  formData.append('message', input.message);
  formData.append('captchaToken', input.captchaToken);
  formData.append('website', input.website ?? '');

  if (input.roleTitle?.trim()) {
    formData.append('roleTitle', input.roleTitle.trim());
  }

  if (input.file) {
    formData.append('file', input.file);
  }

  const response = await fetchOrNetworkError('/api/contact', {
    method: 'POST',
    body: formData,
    signal,
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Failed to send message.'));
  }
}
