import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Pool, PoolStatus } from '../../app/store';
import { displayStatus, soldCount, useDemo } from '../../app/store';
import { fmtMoney, fmtOdds, fmtTicket } from '../../app/format';
import Panel from '../../components/app/Panel';
import TicketChip from '../../components/app/TicketChip';
import CountdownTimer from '../../components/app/CountdownTimer';
import StatusBadge from '../../components/app/StatusBadge';
import EmptyState from '../../components/app/EmptyState';
import { useWallet } from '../../providers/wallet/WalletProvider';

type Tab = 'Active' | 'Won' | 'Expired' | 'Refundable' | 'History';
const TABS: Tab[] = ['Active', 'Won', 'Expired', 'Refundable', 'History'];

type Entry = { pool: Pool; tickets: number[]; status: PoolStatus };

export default function TicketsPage() {
  const { state } = useDemo();
  const [tab, setTab] = useState<Tab>('Active');

  const entries = useMemo<Entry[]>(
    () =>
      state.order
        .map((id) => state.pools[id])
        .filter(Boolean)
        .map((pool) => ({
          pool,
          tickets: state.holdings[pool.id] ?? [],
          status: displayStatus(state, pool),
        }))
        .filter((e) => e.tickets.length > 0),
    [state],
  );

  const grouped = useMemo(() => {
    const active: Entry[] = [];
    const won: Entry[] = [];
    const expired: Entry[] = [];
    const refundable: Entry[] = [];
    const history: Entry[] = [];

    for (const e of entries) {
      const refund = state.refunds[e.pool.id];
      const isOpen =
        e.status === 'LIVE' ||
        e.status === 'FILLING_FAST' ||
        e.status === 'WAITING' ||
        e.status === 'DRAWING' ||
        e.status === 'SOLD_OUT';

      if (isOpen) active.push(e);
      if (e.status === 'COMPLETED') {
        history.push(e);
        if (e.pool.winningTicket !== undefined && e.tickets.includes(e.pool.winningTicket)) {
          won.push(e);
        }
      }
      if (e.status === 'EXPIRED' || e.status === 'REFUNDABLE') {
        expired.push(e);
        history.push(e);
      }
      if (refund && refund.status !== 'CLAIMED') refundable.push(e);
    }

    return { active, won, expired, refundable, history };
  }, [entries, state.refunds]);

  const list = grouped[tab.toLowerCase() as keyof typeof grouped] ?? [];

  const counts: Record<Tab, number> = {
    Active: grouped.active.length,
    Won: grouped.won.length,
    Expired: grouped.expired.length,
    Refundable: grouped.refundable.length,
    History: grouped.history.length,
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-8 lg:py-14">
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-azure-cyan" />
        <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-white/45">
          Portfolio
        </span>
      </div>

      <h1 className="mt-5 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-[2.6rem]">
        My Tickets
      </h1>

      {/* tabs */}
      <div className="mt-9 flex flex-wrap gap-2 border-b border-white/[0.07] pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
              tab === t
                ? 'bg-white/[0.08] text-white'
                : 'text-white/45 hover:bg-white/[0.03] hover:text-white'
            }`}
          >
            {t}
            {counts[t] > 0 && (
              <span className="tabular text-[10.5px] text-white/35">{counts[t]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {list.length === 0 ? (
          <Panel>
            {tab === 'Active' && (
              <EmptyState
                icon="tickets"
                title="No Active Tickets"
                body="You currently have no active pool entries."
                action={
                  <Link
                    to="/app"
                    className="inline-flex rounded-xl bg-white px-5 py-3 text-[13px] font-semibold text-black transition-colors hover:bg-white/90"
                  >
                    Explore Pools
                  </Link>
                }
              />
            )}
            {tab === 'Won' && (
              <EmptyState
                icon="results"
                title="No Winning Tickets Yet"
                body="Pools you win will appear here once their draws are settled."
              />
            )}
            {tab === 'Expired' && (
              <EmptyState
                icon="tickets"
                title="No Expired Entries"
                body="Pools that ended without filling will appear here."
              />
            )}
            {tab === 'Refundable' && (
              <EmptyState
                icon="refunds"
                title="No Refunds Available"
                body="You have no refunds waiting to be claimed."
              />
            )}
            {tab === 'History' && (
              <EmptyState
                icon="results"
                title="No History Yet"
                body="Completed and expired entries will be listed here."
              />
            )}
          </Panel>
        ) : (
          <div className="space-y-4">
            {list.map((e, i) => (
              <motion.div
                key={e.pool.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.05 }}
              >
                <EntryCard entry={e} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  const { state, claimRefund } = useDemo();
  const wallet = useWallet();
  const { pool, tickets, status } = entry;

  const sold = soldCount(state, pool.id);
  const refund = state.refunds[pool.id];
  const contribution = tickets.length * pool.ticketPrice;
  const won = pool.winningTicket !== undefined && tickets.includes(pool.winningTicket);

  return (
    <div className="od-panel rounded-2xl">
      <div className="flex flex-wrap items-start justify-between gap-6 px-5 py-5 md:px-6 md:py-6">
        {/* left: pool + tickets */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10.5px] text-white/30">POOL #{pool.id}</span>
            <StatusBadge status={status} size="sm" />
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
            <div className="tabular text-[1.5rem] font-semibold leading-none tracking-[-0.03em] text-white">
              {fmtMoney(pool.prize, pool.currency)}
            </div>
            <span className="text-[12.5px] text-white/35">Pool</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[9.5px] uppercase tracking-[0.18em] text-white/30">
              Tickets
            </span>
            {tickets.map((n) => (
              <TicketChip
                key={n}
                number={n}
                variant={won && pool.winningTicket === n ? 'winner' : 'own'}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* middle: metrics */}
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {status === 'COMPLETED' ? (
            <>
              <Metric label="Winning Ticket" value={fmtTicket(pool.winningTicket ?? 0)} accent />
              <Metric label="Your Ticket" value={pool.winningTicket !== undefined && won ? fmtTicket(pool.winningTicket) : '—'} />
              <Metric label="Prize" value={fmtMoney(pool.prize, pool.currency)} />
              <Metric label="Status" value={won ? 'Won' : 'Not selected'} tone={won ? 'mint' : undefined} />
            </>
          ) : status === 'EXPIRED' || status === 'REFUNDABLE' ? (
            <>
              <Metric label="Contribution" value={fmtMoney(contribution, pool.currency)} />
              <Metric label="Tickets sold" value={`${sold} / ${pool.capacity}`} />
              <Metric
                label="Refund"
                value={
                  refund?.status === 'CLAIMED'
                    ? 'Claimed'
                    : refund
                      ? 'Available'
                      : 'None'
                }
                tone={refund?.status === 'CLAIMED' ? 'mint' : refund ? 'azure' : undefined}
              />
            </>
          ) : (
            <>
              <Metric label="Your Odds" value={fmtOdds(tickets.length, pool.capacity)} accent />
              <Metric
                label="Time Remaining"
                value={<CountdownTimer seconds={pool.remaining} started={pool.started} deadline={pool.deadline} status={status} size="md" />}
              />
              <Metric label="Progress" value={`${sold} / ${pool.capacity}`} />
            </>
          )}
        </div>

        {/* right: action */}
        <div className="flex shrink-0 items-center gap-3">
          {refund && refund.status !== 'CLAIMED' ? (
            <button
              type="button"
              onClick={() => {
                if (!wallet.connected) wallet.connectWallet();
                else if (!wallet.correctNetwork) wallet.switchToRobinhood();
                else claimRefund(pool.id);
              }}
              disabled={refund.status === 'CLAIMING'}
              className="rounded-xl bg-white px-4 py-2.5 text-[12.5px] font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-70"
            >
              {refund.status === 'CLAIMING'
                ? 'Claiming Refund...'
                : !wallet.connected
                  ? 'Connect Wallet'
                  : !wallet.correctNetwork
                    ? 'Switch Network'
                    : 'Claim Refund'}
            </button>
          ) : (
            <Link
              to={`/app/pool/${pool.id}`}
              className="rounded-xl border border-white/[0.12] px-4 py-2.5 text-[12.5px] font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              View Pool
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = false,
  tone,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
  tone?: 'mint' | 'azure';
}) {
  const color = tone === 'mint' ? 'text-mint-soft' : tone === 'azure' ? 'text-azure-ice' : accent ? 'text-azure-ice' : 'text-white';

  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">{label}</div>
      <div className={`tabular mt-2 text-[13.5px] font-medium ${color}`}>{value}</div>
    </div>
  );
}
