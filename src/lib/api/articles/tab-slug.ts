/** Legacy Insights tab query params from the mock-era content.json. */
const LEGACY_TAB_SLUGS: Record<string, string> = {
  tech: 'tech-dev',
  team: 'team-workflow',
  company: 'company-news'
};

/**
 * Normalize Insights `?tab=` values to current tag slugs.
 * Preserves bookmarks/links that still use tech | team | company.
 */
export function resolveTabSlug(tabId: string): string {
  if (!tabId || tabId === 'all') {
    return 'all';
  }

  return LEGACY_TAB_SLUGS[tabId] ?? tabId;
}

export function isLegacyTabSlug(tabId: string): boolean {
  return tabId in LEGACY_TAB_SLUGS;
}
