import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Ticket, Trophy } from 'lucide-react';
import type { PoolStatus } from '../../app/store';
import { displayStatus, useDemo } from '../../app/store';
import PoolCard from '../../components/app/PoolCard';
import { useWallet } from '../../providers/wallet/WalletProvider';
import { chainConfig, configuredNetworkName, isMainnet } from '../../config/env';

type Filter = 'All' | 'USDG' | 'ETH' | 'Live' | 'Filling Fast';

const FILTERS: Filter[] = ['All', 'USDG', 'ETH', 'Live', 'Filling Fast'];

const JOURNEY = [
  {
    icon: Ticket,
    step: '01',
    title: 'Choose your pool',
    copy: 'Every pool shows its prize, ticket price, capacity and timer before you enter.',
  },
  {
    icon: ShieldCheck,
    step: '02',
    title: 'Draw verified onchain',
    copy: 'When a pool fills, verifiable randomness selects one ticket and records the result on Robinhood Chain.',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Claim from your wallet',
    copy: 'The winning wallet claims its prize directly. Unfilled expired pools return contributions through refunds.',
  },
] as const;

export default function PoolsPage() {
  const { state } = useDemo();
  const wallet = useWallet();
  const [filter, setFilter] = useState<Filter>('All');

  const pools = useMemo(
    () => state.order
      .map((id) => state.pools[id])
      .filter(Boolean)
      .sort((a, b) => a.prize - b.prize || Number(a.id) - Number(b.id)),
    [state.order, state.pools],
  );

  /** Each terminal/pending state has its own destination instead of cluttering entry cards. */
  const openPools = useMemo(
    () => pools.filter((p) => {
      const status = displayStatus(state, p);
      return status === 'WAITING' || status === 'LIVE' || status === 'FILLING_FAST';
    }),
    [pools, state],
  );

  const drawingPools = useMemo(
    () => pools.filter((p) => {
      const status = displayStatus(state, p);
      return status === 'DRAWING' || status === 'SOLD_OUT';
    }),
    [pools, state],
  );

  const filtered = useMemo(() => {
    return openPools.filter((p) => {
      const status: PoolStatus = displayStatus(state, p);
      switch (filter) {
        case 'USDG':
          return p.currency === 'USDG';
        case 'ETH':
          return p.currency === 'ETH';
        case 'Live':
          return status === 'LIVE';
        case 'Filling Fast':
          return status === 'FILLING_FAST';
        default:
          return true;
      }
    });
  }, [openPools, filter, state]);

  const myTickets = openPools.reduce((sum, p) => {
    const status = displayStatus(state, p);
    if (status === 'EXPIRED' || status === 'REFUNDABLE' || status === 'COMPLETED') return sum;
    return sum + (state.holdings[p.id]?.length ?? 0);
  }, 0);

  const liveCount = openPools.filter((p) => {
    const s = displayStatus(state, p);
    return s === 'LIVE' || s === 'FILLING_FAST';
  }).length;

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-8 lg:py-14">
      {/* header row */}
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-soft animate-pulse-dot" />
            <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-mint-soft">
              Live draws
            </span>
          </div>
          <h1 className="mt-5 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-[2.6rem]">
            Open pools
          </h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-[1.65] text-white/45">
            Choose a pool, buy tickets, and enter before time runs out.
          </p>
        </div>

        {/* wallet summary */}
        <div className="flex gap-px overflow-hidden rounded-xl bg-white/[0.07]">
          <div className="bg-[#08090B] px-5 py-4">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">My Tickets</div>
            <div className="tabular mt-2 text-xl font-semibold text-white">{myTickets}</div>
          </div>
          <div className="bg-[#08090B] px-5 py-4">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">Live Pools</div>
            <div className="tabular mt-2 text-xl font-semibold text-white">{liveCount}</div>
          </div>
          <div className="bg-[#08090B] px-5 py-4">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">Wallet</div>
            <div className="mt-2 text-[12.5px] font-medium text-white">
              {wallet.connected ? (
                <span className="font-mono">{wallet.displayAddress}</span>
              ) : (
                <span className="text-white/40">Not connected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-white/[0.07] pb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
              filter === f
                ? 'bg-white/[0.08] text-white'
                : 'text-white/45 hover:bg-white/[0.03] hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[11.5px] text-white/25">
          {filtered.length} {filtered.length === 1 ? 'pool' : 'pools'}
        </span>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[14px] text-white/60">No pools match this filter.</p>
          <button
            type="button"
            onClick={() => setFilter('All')}
            className="mt-4 text-[12.5px] text-azure-ice transition-colors hover:text-white"
          >
            Show all pools
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((pool, i) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <PoolCard pool={pool} />
            </motion.div>
          ))}
        </div>
      )}

      {drawingPools.length > 0 && (
        <section className="mt-14 border-t border-white/[0.07] pt-9">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-azure-ice">Draws in progress</div>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-white">Waiting for a verified result</h2>
              <p className="mt-2 text-[12.5px] text-white/40">Ticket sales are closed. These pools move to Results automatically after settlement.</p>
            </div>
            <span className="text-[11.5px] text-white/25">{drawingPools.length} {drawingPools.length === 1 ? 'draw' : 'draws'}</span>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {drawingPools.map((pool) => <PoolCard key={pool.id} pool={pool} />)}
          </div>
        </section>
      )}

      <section className="mt-16 border-t border-white/[0.07] pt-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-azure-ice">One pool. One result.</div>
            <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] text-white">From entry to settlement</h2>
          </div>
          <p className="max-w-md text-[12.5px] leading-[1.7] text-white/40">
            Pool rules are fixed before entry. Funds and outcomes remain visible onchain throughout the full lifecycle.
          </p>
        </div>

        <div className="mt-7 grid overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.07] md:grid-cols-3 md:gap-px">
          {JOURNEY.map(({ icon: Icon, step, title, copy }) => (
            <div key={step} className="bg-[#08090B] px-6 py-7 md:min-h-56 md:px-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.18em] text-white/25">STEP {step}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.09] text-azure-ice">
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </span>
              </div>
              <h3 className="mt-8 text-[15px] font-medium text-white">{title}</h3>
              <p className="mt-3 text-[12px] leading-[1.75] text-white/38">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-[10.5px] leading-[1.6] text-white/25">
        {chainConfig.dataMode === 'onchain'
          ? `Pools above are read from ${configuredNetworkName}. ${isMainnet ? 'Draws use the configured verifiable randomness provider.' : 'Testnet draws currently use explicitly labeled mock randomness.'}`
          : 'All pools, balances and outcomes shown here are demo UI data for frontend development. Ticket prices are shown per pool; the protocol fee is what a pool collects beyond the winner\'s prize.'}
      </p>
    </div>
  );
}
