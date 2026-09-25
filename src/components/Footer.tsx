import { Link, useLocation } from 'react-router-dom';
import { Github, MessageCircle, Send, Twitter } from 'lucide-react';
import { FOOTER_GROUPS, SOCIALS, siteHref } from '../config';
import { Wordmark } from './brand';

const SOCIAL_ICONS: Record<string, typeof Github> = {
  GitHub: Github,
  X: Twitter,
  Discord: MessageCircle,
  Telegram: Send,
};

export default function Footer() {
  const { pathname } = useLocation();

  // In-page anchors only make sense on the homepage — re-point them elsewhere.
  const href = (target: string) => siteHref(target, pathname);

  return (
    <footer className="relative z-10 hairline-t bg-black/45 backdrop-blur-md">
      <div className="mx-auto max-w-shell px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div>
            <Link to="/" aria-label="ONEDRAW home">
              <Wordmark />
            </Link>
            <p className="mt-7 max-w-xs text-[13px] leading-[1.7] text-white/40">
              A transparent, time-based onchain prize draw protocol built for Robinhood Chain.
            </p>

            <div className="mt-8 flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.label] ?? Github;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.09] text-white/45 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <div className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/35">
                {group.title}
              </div>
              <div className="mt-5 flex flex-col">
                {group.links.map((link) => (
                  <Link
                    key={`${group.title}-${link.label}`}
                    to={href(link.href)}
                    className="py-2 text-[13px] text-white/55 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>

        {/* community row — text links for everyone who prefers them */}
        <div className="hairline-t mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
          <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/30">
            Community
          </span>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
              className="text-[13px] text-white/50 transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* reserved for legal / regional disclosures */}
        <div className="hairline-t mt-10 pt-8">
          <div className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/30">
            Risk &amp; availability
          </div>
          <p className="mt-4 max-w-3xl text-[11.5px] leading-[1.75] text-white/30">
            This page describes a protocol and is not an offer or solicitation. Participation may be
            restricted in certain jurisdictions, and regional availability terms will be published
            here. Prize draws involve risk: a pool that does not reach its ticket capacity does not
            produce a winner, and refund claims require the participant to submit a transaction and
            pay its gas. Contract addresses, deployment details and any independent review will be
            published in the documentation. Nothing here constitutes an audit.
          </p>
        </div>

        <div className="hairline-t mt-10 flex flex-wrap items-center justify-between gap-4 pt-7">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-[11.5px] text-white/30">© 2026 ONEDRAW</span>
            <Link
              to="/terms"
              className="text-[11.5px] text-white/30 transition-colors hover:text-white"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-[11.5px] text-white/30 transition-colors hover:text-white"
            >
              Privacy
            </Link>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/25">
            One Pool. One Draw. One Winner.
          </span>
        </div>
      </div>
    </footer>
  );
}
