import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Pool } from '../../app/store';
import { displayStatus, soldCount, useDemo } from '../../app/store';
import { fmtMoney, protocolFee } from '../../app/format';
import StatusBadge from './StatusBadge';
import PoolProgress from './PoolProgress';
import CountdownTimer from './CountdownTimer';
import TicketChip from './TicketChip';

export default function PoolCard({ pool }: { pool: Pool }) {
  const { state } = useDemo();

  const sold = soldCount(state, pool.id);
  const status = displayStatus(state, pool);
  const owned = state.holdings[pool.id] ?? [];
  const fee = protocolFee(pool.ticketPrice, pool.capacity, pool.prize);

  const closed = status === 'COMPLETED' || status === 'EXPIRED' || status === 'REFUNDABLE';
  const drawing = status === 'DRAWING' || status === 'SOLD_OUT';

  return (
    <Link
      to={`/app/pool/${pool.id}`}
      className="group block rounded-2xl border border-white/[0.08] bg-[#08090B] transition-all duration-300 hover:border-white/[0.16] hover:bg-[#0A0C10]"
    >
      <div className="px-5 py-5 md:px-6 md:py-6">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10.5px] text-white/30">POOL #{pool.id}</span>
          </div>
          <StatusBadge status={status} size="sm" />
        </div>

        {/* prize */}
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <div className="tabular text-[2rem] font-semibold leading-none tracking-[-0.04em] text-white md:text-[2.2rem]">
              {fmtMoney(pool.prize, pool.currency)}
            </div>
            <div className="mt-2.5 text-[9.5px] uppercase tracking-[0.2em] text-white/35">Prize</div>
          </div>

          <div className="text-right">
            <CountdownTimer
              seconds={pool.remaining}
              started={pool.started}
              deadline={pool.deadline}
              duration={pool.duration ?? (pool.deadline && pool.startTime ? Math.max(0, (pool.deadline - pool.startTime) / 1000) : 180)}
              status={status}
              size="lg"
              className="text-[1.4rem] md:text-[1.6rem]"
            />
            <div className="mt-2.5 text-[9.5px] uppercase tracking-[0.2em] text-white/35">
              {drawing ? 'Waiting for randomness' : pool.started ? 'Remaining' : 'Starts on first ticket'}
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <div className="tabular text-[13.5px] font-medium text-white/85">
              {sold} / {pool.capacity}
            </div>
            <div className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-white/30">
              Tickets sold
            </div>
          </div>
          <div>
            <div className="tabular text-[13.5px] font-medium text-white/85">
              {fmtMoney(pool.ticketPrice, pool.currency)}
            </div>
            <div className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-white/30">
              Per ticket
            </div>
          </div>
          <div>
            <div className="tabular text-[13.5px] font-medium text-white/85">
              {fmtMoney(fee, pool.currency)}
            </div>
            <div className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-white/30">
              Protocol fee
            </div>
          </div>
        </div>

        {/* progress */}
        <div className="mt-6">
          <PoolProgress sold={sold} capacity={pool.capacity} status={status} />
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/30">
            <span className="tabular">
              {((sold / pool.capacity) * 100).toFixed(1)}%
            </span>
            <span className="tabular">{Math.max(0, pool.capacity - sold)} left</span>
          </div>
        </div>

        {/* owned tickets */}
        {owned.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] pt-4">
            <span className="mr-1 text-[9.5px] uppercase tracking-[0.18em] text-white/30">
              Your tickets
            </span>
            {owned.slice(0, 4).map((n) => (
              <TicketChip key={n} number={n} variant="own" size="sm" />
            ))}
            {owned.length > 4 && (
              <span className="tabular text-[10.5px] text-white/35">+{owned.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* footer action */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5 md:px-6">
        <span className="text-[11.5px] text-white/35">
          {closed
            ? status === 'COMPLETED'
              ? `Won by ${pool.winner ?? '—'}`
              : 'Refunds available'
            : drawing
              ? 'Draw in progress'
              : 'Open for entry'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/60 transition-colors group-hover:text-white">
          {closed ? 'View pool' : 'Enter Pool'}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
        </span>
      </div>
    </Link>
  );
}
