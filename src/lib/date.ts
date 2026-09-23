import { format, parseISO } from 'date-fns';

export const DATE_FORMAT_DD_MM_YYYY = 'dd.MM.yyyy';

/**
 * Format a date/ISO string using the UTC calendar day so values stay stable across timezones.
 */
export function formatDateUtc(value: string | Date, pattern: string = DATE_FORMAT_DD_MM_YYYY): string {
  const date = typeof value === 'string' ? parseISO(value) : value;
  // Build a local Date from UTC Y/M/D so `format` prints the UTC calendar day.
  const utcCalendarDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return format(utcCalendarDate, pattern);
}
