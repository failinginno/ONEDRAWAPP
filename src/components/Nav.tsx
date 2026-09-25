import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, Wallet, X } from 'lucide-react';
import { APP_URL, NAV_LINKS, siteHref } from '../config';
import { Wordmark } from './brand';
import { EnterApp } from './primitives';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const walletRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // On the homepage in-page anchors stay pure hashes; anywhere else they become
  // "/#about" so the link actually lands on the homepage first.
  const href = (target: string) => siteHref(target, pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dismiss the wallet popover on outside click.
  useEffect(() => {
    if (!walletOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!walletRef.current?.contains(e.target as Node)) setWalletOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [walletOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'border-b border-white/[0.07] bg-black/55 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-shell items-center justify-between px-6 lg:px-10">
        <Link to="/" aria-label="ONEDRAW home">
          <Wordmark />
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-7 xl:flex">
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={href(link.href)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
              className="text-[13px] font-medium text-white/55 transition-colors hover:text-white"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* actions */}
        <div className="flex items-center gap-2.5">
          <div className="relative hidden sm:block" ref={walletRef}>
            <button
              type="button"
              onClick={() => setWalletOpen((v) => !v)}
              aria-expanded={walletOpen}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[13px] font-medium text-white/80 transition-colors hover:border-white/25 hover:bg-white/[0.04]"
            >
              <Wallet className="h-3.5 w-3.5" />
              Connect Wallet
            </button>

            {walletOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="od-glass !absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl p-4"
              >
                <p className="text-[13px] font-medium text-white">Wallet connection</p>
                <p className="mt-2 text-xs leading-[1.6] text-white/50">
                  Connect a compatible wallet to Robinhood Chain inside the ONEDRAW app to buy
                  tickets, claim winnings and claim refunds.
                </p>
                <Link
                  to={APP_URL}
                  className="mt-3 inline-flex text-xs font-medium text-azure-ice hover:text-white"
                >
                  Open the app →
                </Link>
              </motion.div>
            )}
          </div>

          <div className="hidden sm:block">
            <EnterApp />
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/80 xl:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* mobile panel */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden border-t border-white/[0.07] bg-black/80 backdrop-blur-xl xl:hidden"
        >
          <div className="mx-auto flex max-w-shell flex-col px-6 py-4 lg:px-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={href(link.href)}
                onClick={() => setMobileOpen(false)}
                className="hairline-b py-3.5 text-sm text-white/65 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-5 flex flex-col gap-2.5 pb-2 sm:hidden">
              <EnterApp />
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/85"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
