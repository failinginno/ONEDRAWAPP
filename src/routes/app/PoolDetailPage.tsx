import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { displayStatus, soldCount, useDemo } from '../../app/store';
import { fmtMoney, fmtOdds, protocolFee } from '../../app/format';
import Panel from '../../components/app/Panel';
import StatusBadge from '../../components/app/StatusBadge';
import PoolProgress from '../../components/app/PoolProgress';
import CountdownTimer from '../../components/app/CountdownTimer';
import TicketChip from '../../components/app/TicketChip';
import PurchasePanel from '../../components/app/PurchasePanel';
import RefundPanel from '../../components/app/RefundPanel';
import DrawAnimation from '../../components/app/DrawAnimation';
import WinnerResult from '../../components/app/WinnerResult';
import ParticipantTable from '../../components/app/ParticipantTable';
import PoolActivity from '../../components/app/PoolActivity';
import DemoControls from '../../components/app/DemoControls';

export default function PoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useDemo();
  const pool = id ? state.pools[id] : undefined;

  if (!pool) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-8">
        <h1 className="text-xl font-semibold text-white">Pool not found</h1>
        <p className="mt-3 text-[13.5px] text-white/45">
          Pool #{id} does not exist in this demo dataset.
        </p>
        <Link
          to="/app"
          className="mt-6 inline-block text-[13px] text-azure-ice transition-colors hover:text-white"
        >
          ← Back to all pools
        </Link>
      </div>
    );
  }

  const sold = soldCount(state, pool.id);
  const status = displayStatus(state, pool);
  const owned = state.holdings[pool.id] ?? [];
  const fee = protocolFee(pool.ticketPrice, pool.capacity, pool.prize);
  const participants = state.participants[pool.id] ?? [];
  const activity = state.activity[pool.id] ?? [];

  const drawing = status === 'DRAWING' || status === 'SOLD_OUT';
  const completed = status === 'COMPLETED';
  const expired = status === 'EXPIRED' || status === 'REFUNDABLE';

  const stats: { label: string; value: string }[] = [
    { label: 'Ticket Price', value: fmtMoney(pool.ticketPrice, pool.currency) },
    { label: 'Pool Capacity', value: `${pool.capacity} Tickets` },
    { label: 'Protocol Fee', value: fmtMoney(fee, pool.currency) },
    { label: 'Winner Prize', value: fmtMoney(pool.prize, pool.currency) },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8 lg:py-12">
      <Link
        to="/app"
        className="text-[12px] text-white/40 transition-colors hover:text-white"
      >
        ← All pools
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_25rem] lg:gap-8">
        {/* ---------------- main column ---------------- */}
        <div className="min-w-0 space-y-6">
          {/* pool header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="od-panel rounded-2xl"
          >
            <div className="px-5 py-6 md:px-7 md:py-7">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] text-white/30">POOL #{pool.id}</span>
                <StatusBadge status={status} />
              </div>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                <div>
                <h1 className="tabular text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-white md:text-[3.2rem]">
                  {fmtMoney(pool.prize, pool.currency)}
                </h1>
                <div className="mt-3 text-[9.5px] uppercase tracking-[0.22em] text-white/35">
                  Prize Pool
                </div>
                </div>

                <div className="text-right">
                  <CountdownTimer
                    seconds={pool.remaining}
                    started={pool.started}
                    deadline={pool.deadline}
                    duration={pool.duration ?? (pool.deadline && pool.startTime ? Math.max(0, (pool.deadline - pool.startTime) / 1000) : 180)}
                    status={status}
                    size="xl"
                    className="text-white"
                  />
                  <div className="mt-3 text-[9.5px] uppercase tracking-[0.22em] text-white/35">
                    {drawing ? 'Waiting for randomness' : pool.started ? 'Remaining' : 'Starts on first ticket'}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] text-white/45">Tickets sold</span>
                  <span className="tabular text-[12.5px] font-medium text-white">
                    {sold} / {pool.capacity}
                  </span>
                </div>
                <PoolProgress
                  sold={sold}
                  capacity={pool.capacity}
                  status={status}
                  height="lg"
                  showLabel
                />
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-white/[0.06] border-t border-white/[0.07] md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="px-5 py-5">
                  <div className="tabular text-[13.5px] font-medium text-white/85">{s.value}</div>
                  <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-white/30">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* live draw / result */}
          {drawing && <DrawAnimation pool={pool} />}
          {completed && <WinnerResult pool={pool} />}

          {/* your tickets */}
          {owned.length > 0 && (
            <Panel title="Your Tickets">
              <div className="px-5 py-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {owned.map((n) => (
                      <TicketChip
                        key={n}
                        number={n}
                        variant={completed && pool.winningTicket === n ? 'winner' : 'own'}
                      />
                    ))}
                  </div>
                  <div className="flex gap-7">
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                        Your Tickets
                      </div>
                      <div className="tabular mt-2 text-lg font-semibold text-white">
                        {owned.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                        Your Odds
                      </div>
                      <div className="tabular mt-2 text-lg font-semibold text-azure-ice">
                        {fmtOdds(owned.length, pool.capacity)}
                      </div>
                    </div>
                  </div>
                </div>

                {completed && pool.winningTicket !== undefined && (
                  <p className="mt-4 border-t border-white/[0.06] pt-4 text-[12.5px] text-white/45">
                    Winning ticket was{' '}
                    <span className="font-mono text-azure-ice">
                      #{String(pool.winningTicket).padStart(2, '0')}
                    </span>
                    {owned.includes(pool.winningTicket)
                      ? ' — held by this wallet.'
                      : ' — not held by this wallet.'}
                  </p>
                )}
              </div>
            </Panel>
          )}

          {/* participants */}
          <Panel
            title="Participants"
            right={
              <span className="tabular text-[11.5px] text-white/30">
                {participants.length} {participants.length === 1 ? 'wallet' : 'wallets'}
              </span>
            }
          >
            <ParticipantTable participants={participants} capacity={pool.capacity} />
          </Panel>

          {/* activity */}
          <Panel title="Pool Activity">
            <PoolActivity events={activity} />
          </Panel>

          <DemoControls pool={pool} />
        </div>

        {/* ---------------- action column ---------------- */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {expired ? <RefundPanel pool={pool} /> : <PurchasePanel pool={pool} />}
        </aside>
      </div>
    </div>
  );
}
