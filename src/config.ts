/**
 * ONEDRAW — single place to point the marketing site at every destination.
 *
 *   ONEDRAW.COM  -> brand / explanation / trust / documentation
 *   ENTER APP    -> live pools / tickets / draws / refunds / wallet actions
 *
 * Routes starting with "/" are pages served by this app. Entries starting
 * with "#" are in-page anchors on the marketing homepage — `siteHref()` turns
 * them into "/#about" style links when rendered from any other route, so the
 * nav and footer stay correct everywhere without duplicating lists.
 */

export const APP_URL = '/app';
export const DOCS_URL = '/docs';
export const SECURITY_URL = '/security';
export const TESTNET_URL = '/testnet';
export const PROTOCOL_URL = '/protocol';
export const TRANSPARENCY_URL = '/transparency';
export const TERMS_URL = '/terms';
export const PRIVACY_URL = '/privacy';

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Protocol', href: PROTOCOL_URL },
  { label: 'Transparency', href: TRANSPARENCY_URL },
  { label: 'Winners', href: '#winners' },
  { label: 'Docs', href: DOCS_URL },
];

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/failinginno/ONEDRAWA-Transparent' },
  { label: 'X', href: 'https://x.com/ODRWRH' },
  { label: 'Discord', href: '#' },
  { label: 'Telegram', href: '#' },
];

/**
 * "#about" stays a pure anchor on the homepage (no reload); anywhere else it
 * becomes "/#about" so it actually lands on the homepage first.
 */
export function siteHref(href: string, pathname: string): string {
  if (href.startsWith('/')) return href;
  return pathname === '/' ? href : `/${href}`;
}

/** Footer columns — protocol surfaces, references and community. */
export const FOOTER_GROUPS = [
  {
    title: 'Protocol',
    links: [
      { label: 'App', href: APP_URL },
      { label: 'Pools', href: '/app' },
      { label: 'Results', href: '/app/results' },
      { label: 'Refunds', href: '/app/refunds' },
    ],
  },
  {
    title: 'Docs',
    links: [
      { label: 'Documentation', href: DOCS_URL },
      { label: 'Introduction', href: DOCS_URL },
      { label: 'How It Works', href: '/docs/how-it-works' },
      { label: 'Architecture', href: '/docs/architecture' },
      { label: 'FAQ', href: '/docs/faq' },
    ],
  },
  {
    title: 'Protocol Intel',
    links: [
      { label: 'Protocol', href: PROTOCOL_URL },
      { label: 'Security', href: SECURITY_URL },
      { label: 'Transparency', href: TRANSPARENCY_URL },
      { label: 'Testnet Report', href: TESTNET_URL },
      { label: 'Terms', href: TERMS_URL },
      { label: 'Privacy', href: PRIVACY_URL },
    ],
  },
];
