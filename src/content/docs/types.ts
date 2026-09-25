import type { ReactNode } from 'react';

export type DocPage = {
  /** URL fragment — 'introduction' is served at /docs */
  slug: string;
  group: string;
  /** short label used in the sidebar */
  nav: string;
  title: string;
  reading: string;
  lede: ReactNode;
  body: () => ReactNode;
};
