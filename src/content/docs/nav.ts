/** Sidebar order — also drives the previous / next pager. */
export const DOCS_GROUPS: { group: string; slugs: string[] }[] = [
  { group: 'Overview', slugs: ['introduction', 'overview'] },
  {
    group: 'Mechanics',
    slugs: ['how-it-works', 'tickets', 'pool-mechanics'],
  },
  { group: 'Lifecycle', slugs: ['draw-process', 'refunds'] },
  { group: 'Reference', slugs: ['architecture', 'security-model', 'faq'] },
];

export const DOC_ROOT = '/docs';

export function docsHref(slug: string): string {
  return slug === 'introduction' ? DOC_ROOT : `${DOC_ROOT}/${slug}`;
}
