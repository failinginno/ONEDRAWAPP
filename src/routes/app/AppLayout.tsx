import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import AppHeader from '../../components/app/AppHeader';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { DemoProvider } from '../../providers/demo/DemoProvider';
import { OnchainProvider } from '../../providers/onchain/OnchainProvider';
import { chainConfig, isMainnet } from '../../config/env';
import PrizeNotification from '../../components/app/PrizeNotification';

function DataProvider({ children }: { children: ReactNode }) {
  return chainConfig.dataMode === 'onchain'
    ? <OnchainProvider>{children}</OnchainProvider>
    : <DemoProvider>{children}</DemoProvider>;
}

/**
 * Shell for the ONEDRAW application.
 *
 * Shares the brand palette with the marketing site but deliberately drops the
 * cinematic video/particle field — the app should read as a fast, dense
 * financial interface rather than a landing page.
 */
export default function AppLayout() {
  const { pathname } = useLocation();

  // route changes should land at the top of the page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <WalletProvider>
    <DataProvider>
    <div className="relative min-h-screen bg-[#05060A] text-white">
      {/* restrained ambient background — no video */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(900px circle at 78% -8%, rgba(11,37,81,0.55), transparent 62%), radial-gradient(700px circle at 6% 8%, rgba(0,210,255,0.05), transparent 66%)',
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppHeader />
        <PrizeNotification />

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-white/[0.07] px-5 py-8 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/"
                className="text-[11.5px] text-white/40 transition-colors hover:text-white"
              >
                ← Back to onedraw.com
              </Link>
              <Link
                to="/docs"
                className="text-[11.5px] text-white/40 transition-colors hover:text-white"
              >
                Docs
              </Link>
              <Link
                to="/protocol"
                className="text-[11.5px] text-white/40 transition-colors hover:text-white"
              >
                Protocol
              </Link>
              <Link
                to="/security"
                className="text-[11.5px] text-white/40 transition-colors hover:text-white"
              >
                Security
              </Link>
              <span className="hidden items-center gap-2 text-[11.5px] text-white/30 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-mint-soft" />
                Robinhood Chain
              </span>
            </div>
            <p className="text-[10.5px] leading-[1.6] text-white/25">
              {chainConfig.dataMode === 'onchain'
                ? (isMainnet ? 'Robinhood Chain mainnet. Draws use the configured verifiable randomness provider.' : 'Robinhood Testnet only. Draws use development-only mock randomness.')
                : 'Demo interface with simulated data. No contract calls and no funds move at this stage.'}
            </p>
          </div>
        </footer>
      </div>
    </div>
    </DataProvider>
    </WalletProvider>
  );
}
