import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Mark } from '../brand';
import WalletButton from './WalletButton';
import { useDemo } from '../../app/store';
import { useWallet } from '../../providers/wallet/WalletProvider';
import { chainConfig, configuredNetworkName, isMainnet, showDemoIndicator } from '../../config/env';

const LINKS = [
  { label: 'Pools', to: '/app' },
  { label: 'My Tickets', to: '/app/tickets' },
  { label: 'Results', to: '/app/results' },
  { label: 'Refunds', to: '/app/refunds' },
];

export default function AppHeader() {
  const { pathname } = useLocation();
  const { state } = useDemo();
  const wallet = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  const refundCount = Object.values(state.refunds).filter(
    (r) => r.status === 'AVAILABLE' || r.status === 'CLAIMING',
  ).length;

  const isActive = (to: string) => {
    if (to === '/app') return pathname === '/app' || pathname.startsWith('/app/pool');
    return pathname.startsWith(to);
  };

  const badgeFor = (to: string) => (to === '/app/refunds' && refundCount > 0 ? refundCount : null);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#05060A]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 lg:px-8">
        {/* logo — returns to the marketing homepage */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="ONEDRAW home">
          <Mark className="h-6 w-auto -ml-2" />
          <span className="text-[13px] font-semibold tracking-[0.16em] text-white">ONEDRAW</span>
        </Link>

        {/* primary nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active = isActive(link.to);
            const badge = badgeFor(link.to);
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`relative rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  active ? 'bg-white/[0.06] text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {link.label}
                {badge !== null && (
                  <span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-azure-cyan/15 px-1 text-[9.5px] font-semibold text-azure-ice">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
          <Link
            to="/docs"
            className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-white/50 transition-colors hover:text-white"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {(showDemoIndicator || chainConfig.dataMode === 'onchain') && (
            <span
              title={chainConfig.dataMode === 'onchain' ? (isMainnet ? 'Live Robinhood Chain contracts using verifiable randomness.' : 'Real Robinhood Testnet contracts using mock randomness.') : 'Wallet, network and balances are live testnet data. Pools remain simulated.'}
              className="hidden rounded-full border border-white/12 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45 sm:inline-flex"
            >
              {chainConfig.dataMode === 'onchain' ? (isMainnet ? 'Mainnet / Verifiable Randomness' : 'Testnet / Mock Randomness') : 'Testnet / Demo Pools'}
            </span>
          )}

          {/* network indicator */}
          <div className="hidden items-center gap-2 rounded-lg border border-white/[0.09] px-3 py-2 md:flex">
            <span className={`h-1.5 w-1.5 rounded-full ${wallet.connected && !wallet.correctNetwork ? 'bg-amber-300' : 'bg-mint-soft'}`} />
            <span className="text-[11.5px] font-medium text-white/60">{wallet.connected && !wallet.correctNetwork ? 'Wrong Network' : configuredNetworkName}</span>
          </div>

          <WalletButton />

          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.12] text-white/70 lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/[0.07] bg-[#05060A]/95 lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col px-5 py-2">
            {[...LINKS, { label: 'Docs', to: '/docs' }].map((link) =>
              link.to.startsWith('#') ? (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/[0.05] py-3.5 text-[13.5px] text-white/65 last:border-b-0"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/[0.05] py-3.5 text-[13.5px] text-white/65 last:border-b-0"
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="flex items-center gap-2 py-4 text-[11.5px] text-white/45">
              <span className={`h-1.5 w-1.5 rounded-full ${wallet.connected && !wallet.correctNetwork ? 'bg-amber-300' : 'bg-mint-soft'}`} />
              {wallet.connected && !wallet.correctNetwork ? 'Wrong Network' : configuredNetworkName}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
