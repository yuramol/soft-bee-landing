/**
 * Escape `%`, `_`, `\`, and `"` so user search input is safe in ILIKE / PostgREST filters.
 */
export function escapeIlikePattern(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/"/g, '""');
}

/**
 * Build a PostgREST `or` filter for substring match on title + description
 * (parity with the old client-side `includes` search).
 */
export function buildArticlesSearchOrFilter(searchQuery: string): string | null {
  const trimmed = searchQuery.trim();
  if (!trimmed) {
    return null;
  }

  const pattern = `%${escapeIlikePattern(trimmed)}%`;
  // Quote patterns so commas/special chars in the query cannot break the or-filter syntax.
  return `title.ilike."${pattern}",description.ilike."${pattern}"`;
}
