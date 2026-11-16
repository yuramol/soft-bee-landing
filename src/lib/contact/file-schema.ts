import * as z from 'zod';

import { getContactFileError } from './validate';

/**
 * Optional attachment field for contact forms. Runs the same size/type checks as the API,
 * so users see the problem right after picking a file instead of after a failed submit.
 */
export const contactFileSchema = z
  .custom<File>()
  .optional()
  .superRefine((file, ctx) => {
    const error = file ? getContactFileError(file) : null;
    if (error) {
      ctx.addIssue({ code: 'custom', message: error });
    }
  });
