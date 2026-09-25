import type { PoolStatus } from '../../app/store';
import { fmtCountdown } from '../../app/format';
import StatusBadge from './StatusBadge';
import PoolProgress from './PoolProgress';

/**
 * Demo state reference.
 *
 * These cards exist so every lifecycle state can be reviewed without waiting
 * for a timer. They are deliberately static presentation specimens — no link,
 * no purchase — and every value here is fabricated UI data, not a balance or a
 * transaction of any kind.
 */

type DemoState = {
  status: PoolStatus;
  /** what the participant sees next */
  outcome: string;
  sold: number;
  capacity: number;
  seconds: number;
  hint: string;
  countdown: string;
};

const STATES: DemoState[] = [
  {
    status: 'LIVE',
    outcome: 'Open for entry',
    sold: 8,
    capacity: 11,
    seconds: 102,
    hint: 'Timer running, tickets still available.',
    countdown: '01:42 remaining',
  },
  {
    status: 'SOLD_OUT',
    outcome: 'Draw queued',
    sold: 11,
    capacity: 11,
    seconds: 0,
    hint: 'Every ticket sold — sales are closed.',
    countdown: 'Capacity reached',
  },
  {
    status: 'DRAWING',
    outcome: 'Selecting a ticket',
    sold: 11,
    capacity: 11,
    seconds: 0,
    hint: 'Randomness requested; awaiting verification.',
    countdown: 'Draw in progress',
  },
  {
    status: 'COMPLETED',
    outcome: 'Prize settled',
    sold: 11,
    capacity: 11,
    seconds: 0,
    hint: 'One winning ticket is fixed; the winning wallet claims the prize.',
    countdown: 'Settled',
  },
  {
    status: 'EXPIRED',
    outcome: 'No winner selected',
    sold: 6,
    capacity: 11,
    seconds: 0,
    hint: 'Timer elapsed below capacity.',
    countdown: '00:00',
  },
  {
    status: 'REFUNDABLE',
    outcome: 'Claim your contribution',
    sold: 6,
    capacity: 11,
    seconds: 0,
    hint: 'You hold tickets — the refund claim is yours to submit.',
    countdown: 'Refund available',
  },
];

function SpecimenCard({ state }: { state: DemoState }) {
  const closed = state.status === 'COMPLETED' || state.status === 'EXPIRED' || state.status === 'REFUNDABLE';

  return (
    <div
      className="rounded-2xl border border-white/[0.08] bg-[#08090B]"
      aria-label={`Demo state: ${state.status}`}
    >
      <div className="px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[10.5px] text-white/30">DEMO POOL</span>
          <StatusBadge status={state.status} size="sm" />
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <div className="tabular text-[1.7rem] font-semibold leading-none tracking-[-0.04em] text-white">
              10 <span className="text-[0.9rem] font-medium text-white/40">USDG</span>
            </div>
            <div className="mt-2.5 text-[9.5px] uppercase tracking-[0.2em] text-white/35">Prize</div>
          </div>
          <div className="text-right">
            <div
              className={`tabular text-[1.15rem] font-semibold leading-none tracking-[-0.02em] ${
                closed || state.status === 'SOLD_OUT' || state.status === 'DRAWING'
                  ? 'text-white/40'
                  : 'text-white'
              }`}
            >
              {fmtCountdown(state.seconds)}
            </div>
            <div className="mt-2.5 text-[9.5px] uppercase tracking-[0.2em] text-white/35">
              {state.countdown}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <div className="tabular text-[13px] font-medium text-white/85">
              {state.sold} / {state.capacity}
            </div>
            <div className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-white/30">
              Tickets sold
            </div>
          </div>
          <div>
            <div className="tabular text-[13px] font-medium text-white/85">1 USDG</div>
            <div className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-white/30">
              Per ticket
            </div>
          </div>
          <div>
            <div className="tabular text-[13px] font-medium text-white/85">
              {state.status === 'COMPLETED' ? '1 USDG' : '—'}
            </div>
            <div className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-white/30">
              Protocol fee
            </div>
          </div>
        </div>

        <div className="mt-6">
          <PoolProgress sold={state.sold} capacity={state.capacity} status={state.status} />
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-5 py-3.5">
        <div className="text-[11.5px] text-white/50">{state.outcome}</div>
        <div className="mt-1 text-[10.5px] leading-[1.6] text-white/30">{state.hint}</div>
      </div>
    </div>
  );
}

export default function DemoStates() {
  return (
    <section className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-white/12 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Demo reference
            </span>
            <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/35">
              Pool states
            </span>
          </div>
          <h2 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.03em] text-white">
            The six states a pool can be in
          </h2>
          <p className="mt-3 max-w-xl text-[13px] leading-[1.7] text-white/45">
            Every interface state, side by side. These specimens use fabricated values so each
            transition can be reviewed without waiting for a real timer — they are not live pools and
            cannot be entered.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {STATES.map((state) => (
          <SpecimenCard key={state.status} state={state} />
        ))}
      </div>

      <p className="mt-6 text-[10.5px] leading-[1.6] text-white/25">
        Specimens above are static UI examples. No transaction is simulated, no wallet is involved and
        no value moves — the live journey lives in the pool detail view.
      </p>
    </section>
  );
}
