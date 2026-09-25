import { DOCS_GROUPS, DOC_ROOT, docsHref } from './nav';
import { pages as overviewPages } from './overview';
import { pages as mechanicsPages } from './mechanics';
import { pages as lifecyclePages } from './lifecycle';
import { pages as referencePages } from './reference';
import type { DocPage } from './types';

/** Full page registry in reading order. */
export const DOC_PAGES: DocPage[] = [
  ...overviewPages,
  ...mechanicsPages,
  ...lifecyclePages,
  ...referencePages,
];

export function getDocPage(slug: string | undefined): DocPage | undefined {
  if (!slug || slug === 'introduction') return DOC_PAGES[0];
  return DOC_PAGES.find((p) => p.slug === slug);
}

export function getNeighbours(slug: string): { prev?: DocPage; next?: DocPage } {
  const i = DOC_PAGES.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? DOC_PAGES[i - 1] : undefined,
    next: i < DOC_PAGES.length - 1 ? DOC_PAGES[i + 1] : undefined,
  };
}

export { DOCS_GROUPS, DOC_ROOT, docsHref };
export type { DocPage };
