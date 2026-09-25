import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  ActivityEvent,
  DrawPhase,
  Participant,
  Pool,
  PoolStatus,
  RefundRecord,
} from '../../domain/models';
import { OnedrawContext } from '../OnedrawContext';
import type { OnedrawProviderValue, OnedrawState } from '../types';

/**
 * ONEDRAW application — local demo state.
 *
 * Everything here is simulated in the browser. There is no contract call, no
 * network request and no fund movement. Values are demo UI data used to build
 * and review the complete product journey.
 */

export const USER_WALLET = '0x7F3...91C2';
export const FILLER_WALLET = '0x5D2...7Af9';

export type DemoState = OnedrawState;

type DemoPoolSeed = Omit<
  Pool,
  | 'asset'
  | 'prizeAmount'
  | 'ticketsSold'
  | 'startTime'
  | 'deadline'
  | 'protocolFee'
  | 'winner'
  | 'winningTicket'
  | 'randomnessRequestId'
  | 'createdAt'
  | 'transactionHash'
> & { winner?: string; winningTicket?: number };

type DemoRefundSeed = Pick<RefundRecord, 'poolId' | 'amount' | 'currency' | 'status' | 'claimedAt'>;

/* ------------------------------------------------------------------
   Seeds
   ------------------------------------------------------------------ */

const SEED_POOLS: DemoPoolSeed[] = [
  // ---- open pools -------------------------------------------------
  {
    id: '1042',
    prize: 10,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 11,
    remaining: 102,
    started: true,
    status: 'LIVE',
    createdLabel: '12 minutes ago',
    drawPhase: 'NONE',
  },
  {
    id: '1043',
    prize: 50,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 55,
    remaining: 136,
    started: true,
    status: 'FILLING_FAST',
    createdLabel: '21 minutes ago',
    drawPhase: 'NONE',
  },
  {
    id: '1044',
    prize: 100,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 110,
    remaining: 48,
    started: true,
    status: 'LIVE',
    createdLabel: '9 minutes ago',
    drawPhase: 'NONE',
  },
  {
    id: '1045',
    prize: 0.01,
    currency: 'ETH',
    ticketPrice: 0.001,
    capacity: 11,
    remaining: 88,
    started: true,
    status: 'LIVE',
    createdLabel: '6 minutes ago',
    drawPhase: 'NONE',
  },
  {
    id: '1037',
    prize: 25,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 26,
    remaining: 180,
    started: false,
    status: 'WAITING',
    createdLabel: '2 minutes ago',
    drawPhase: 'NONE',
  },
  {
    id: '1038',
    prize: 10,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 11,
    remaining: 0,
    started: true,
    status: 'EXPIRED',
    createdLabel: '34 minutes ago',
    drawPhase: 'NONE',
  },
  {
    id: '1033',
    prize: 10,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 11,
    remaining: 0,
    started: true,
    status: 'EXPIRED',
    createdLabel: '2 days ago',
    drawPhase: 'NONE',
  },
  // ---- completed pools -------------------------------------------
  {
    id: '1041',
    prize: 10,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 11,
    remaining: 0,
    started: true,
    status: 'COMPLETED',
    createdLabel: '2 minutes ago',
    winningTicket: 8,
    winner: USER_WALLET,
    completedLabel: '2m ago',
    drawPhase: 'DONE',
  },
  {
    id: '1040',
    prize: 25,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 26,
    remaining: 0,
    started: true,
    status: 'COMPLETED',
    createdLabel: '18 minutes ago',
    winningTicket: 12,
    winner: '0x8Be...4C10',
    completedLabel: '18m ago',
    drawPhase: 'DONE',
  },
  {
    id: '1039',
    prize: 50,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 55,
    remaining: 0,
    started: true,
    status: 'COMPLETED',
    createdLabel: '1 hour ago',
    winningTicket: 27,
    winner: USER_WALLET,
    completedLabel: '1h ago',
    drawPhase: 'DONE',
  },
  {
    id: '1036',
    prize: 100,
    currency: 'USDG',
    ticketPrice: 1,
    capacity: 110,
    remaining: 0,
    started: true,
    status: 'COMPLETED',
    createdLabel: '3 hours ago',
    winningTicket: 64,
    winner: '0x5D2...7Af9',
    completedLabel: '3h ago',
    drawPhase: 'DONE',
  },
  {
    id: '1035',
    prize: 0.01,
    currency: 'ETH',
    ticketPrice: 0.001,
    capacity: 11,
    remaining: 0,
    started: true,
    status: 'COMPLETED',
    createdLabel: '5 hours ago',
    winningTicket: 4,
    winner: '0x21A...83F1',
    completedLabel: '5h ago',
    drawPhase: 'DONE',
  },
];

/**
 * Participant ticket counts always sum to the pool's sold count, so the
 * tables and the progress bars can never disagree.
 */
const SEED_PARTICIPANTS: Record<string, Participant[]> = {
  '1042': [
    { wallet: USER_WALLET, tickets: 3 },
    { wallet: '0x91B...21A5', tickets: 2 },
    { wallet: '0x4C1...8Ae2', tickets: 2 },
    { wallet: '0xA32...91DF', tickets: 1 },
  ],
  '1043': [
    { wallet: '0x91B...21A5', tickets: 8 },
    { wallet: '0x5D2...7Af9', tickets: 6 },
    { wallet: '0x8Be...4C10', tickets: 5 },
    { wallet: '0xA32...91DF', tickets: 4 },
    { wallet: USER_WALLET, tickets: 3 },
    { wallet: '0x21A...83F1', tickets: 3 },
  ],
  '1044': [
    { wallet: '0x5D2...7Af9', tickets: 18 },
    { wallet: '0x21A...83F1', tickets: 14 },
    { wallet: '0x8Be...4C10', tickets: 12 },
    { wallet: '0x91B...21A5', tickets: 11 },
    { wallet: '0xA32...91DF', tickets: 10 },
    { wallet: '0x4C1...8Ae2', tickets: 9 },
  ],
  '1045': [
    { wallet: '0xA32...91DF', tickets: 3 },
    { wallet: '0x4C1...8Ae2', tickets: 2 },
    { wallet: '0x21A...83F1', tickets: 1 },
  ],
  '1037': [],
  '1038': [
    { wallet: USER_WALLET, tickets: 3 },
    { wallet: '0x91B...21A5', tickets: 2 },
    { wallet: '0x4C1...8Ae2', tickets: 2 },
  ],
  '1033': [
    { wallet: '0x91B...21A5', tickets: 3 },
    { wallet: USER_WALLET, tickets: 2 },
  ],
  '1041': [
    { wallet: '0x91B...21A5', tickets: 4 },
    { wallet: '0x4C1...8Ae2', tickets: 4 },
    { wallet: '0xA32...91DF', tickets: 2 },
    { wallet: USER_WALLET, tickets: 1 },
  ],
  '1040': [
    { wallet: '0x8Be...4C10', tickets: 10 },
    { wallet: '0x91B...21A5', tickets: 8 },
    { wallet: '0x21A...83F1', tickets: 8 },
  ],
  '1039': [
    { wallet: '0x91B...21A5', tickets: 15 },
    { wallet: '0x5D2...7Af9', tickets: 13 },
    { wallet: '0x21A...83F1', tickets: 13 },
    { wallet: '0x8Be...4C10', tickets: 12 },
    { wallet: USER_WALLET, tickets: 2 },
  ],
  '1036': [
    { wallet: '0x5D2...7Af9', tickets: 40 },
    { wallet: '0x21A...83F1', tickets: 35 },
    { wallet: '0x91B...21A5', tickets: 35 },
  ],
  '1035': [
    { wallet: '0x21A...83F1', tickets: 6 },
    { wallet: '0x4C1...8Ae2', tickets: 5 },
  ],
};

const SEED_HOLDINGS: Record<string, number[]> = {
  // the demo wallet's own ticket numbers, per pool
  '1042': [2, 6, 8],
  '1043': [27, 28, 29],
  '1038': [1, 4, 7],
  '1033': [3, 5],
  '1041': [8],
  '1039': [27],
};

const SEED_REFUNDS: Record<string, DemoRefundSeed> = {
  '1038': { poolId: '1038', amount: 3, currency: 'USDG', status: 'AVAILABLE' },
  '1033': {
    poolId: '1033',
    amount: 2,
    currency: 'USDG',
    status: 'CLAIMED',
    claimedAt: '2 days ago',
  },
};

const ev = (
  id: string,
  label: string,
  at: string,
  tone: ActivityEvent['tone'] = 'default',
  detail?: string,
): ActivityEvent => ({ id, label, at, tone, detail });

const SEED_ACTIVITY: Record<string, ActivityEvent[]> = {
  '1042': [
    ev('e1', 'Pool created', '12m ago'),
    ev('e2', 'First ticket purchased', '11m ago', 'accent'),
    ev('e3', 'Timer started — 03:00', '11m ago', 'accent'),
    ev('e4', 'Wallet 0x91B...21A5 bought 2 tickets', '9m ago', 'default', 'tickets #03, #05'),
    ev('e5', `Wallet ${USER_WALLET} bought 3 tickets`, '6m ago', 'mint', 'tickets #02, #06, #08'),
    ev('e6', 'Wallet 0x4C1...8Ae2 bought 2 tickets', '4m ago', 'default', 'tickets #01, #07'),
    ev('e7', '8 / 11 tickets filled', '2m ago', 'accent'),
  ],
  '1043': [
    ev('e1', 'Pool created', '21m ago'),
    ev('e2', 'First ticket purchased', '20m ago', 'accent'),
    ev('e3', 'Timer started — 03:00', '20m ago', 'accent'),
    ev('e4', `Wallet ${USER_WALLET} bought 3 tickets`, '7m ago', 'mint', 'tickets #27, #28, #29'),
    ev('e5', '29 / 55 tickets filled', '1m ago', 'accent'),
  ],
  '1044': [
    ev('e1', 'Pool created', '9m ago'),
    ev('e2', 'First ticket purchased', '8m ago', 'accent'),
    ev('e3', 'Timer started — 03:00', '8m ago', 'accent'),
    ev('e4', '74 / 110 tickets filled', '40s ago', 'accent'),
  ],
  '1045': [
    ev('e1', 'Pool created', '6m ago'),
    ev('e2', 'First ticket purchased', '5m ago', 'accent'),
    ev('e3', 'Timer started — 03:00', '5m ago', 'accent'),
  ],
  '1037': [ev('e1', 'Pool created', '2m ago')],
  '1038': [
    ev('e1', 'Pool created', '34m ago'),
    ev('e2', 'First ticket purchased', '33m ago', 'accent'),
    ev('e3', 'Timer started — 03:00', '33m ago', 'accent'),
    ev('e4', `Wallet ${USER_WALLET} bought 3 tickets`, '30m ago', 'mint', 'tickets #01, #04, #07'),
    ev('e5', 'Timer expired at 7 / 11', '30m ago', 'accent'),
    ev('e6', 'Pool expired — no winner selected', '30m ago'),
    ev('e7', 'Refunds available', '30m ago', 'mint'),
  ],
  '1033': [
    ev('e1', 'Pool created', '2 days ago'),
    ev('e2', 'Timer expired at 5 / 11', '2 days ago', 'accent'),
    ev('e3', 'Refund claimed — 2 USDG', '2 days ago', 'mint'),
  ],
};

/* ------------------------------------------------------------------
   Initial state
   ------------------------------------------------------------------ */

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function initialState(): DemoState {
  const pools: Record<string, Pool> = {};
  const now = Date.now();
  for (const seed of SEED_POOLS) {
    const ticketsSold = (SEED_PARTICIPANTS[seed.id] ?? []).reduce((sum, p) => sum + p.tickets, 0);
    pools[seed.id] = {
      ...clone(seed),
      asset: seed.currency,
      prizeAmount: seed.prize,
      ticketsSold,
      startTime: seed.started ? now - Math.max(0, 180 - seed.remaining) * 1000 : null,
      deadline: seed.started && seed.remaining > 0 ? now + seed.remaining * 1000 : null,
      protocolFee: Math.max(0, seed.ticketPrice * seed.capacity - seed.prize),
      winner: seed.winner,
      winningTicket: seed.winningTicket,
      randomnessRequestId: null,
      createdAt: now,
      transactionHash: null,
    };
  }

  const refunds: Record<string, RefundRecord> = {};
  for (const [poolId, refund] of Object.entries(SEED_REFUNDS)) {
    refunds[poolId] = {
      ...clone(refund),
      asset: refund.currency,
      wallet: USER_WALLET,
      transactionHash: null,
    };
  }

  return {
    pools,
    order: SEED_POOLS.map((p) => p.id),
    participants: clone(SEED_PARTICIPANTS),
    holdings: clone(SEED_HOLDINGS),
    refunds,
    activity: clone(SEED_ACTIVITY),
  };
}

export function soldCount(state: DemoState, poolId: string): number {
  const onchainCount = state.pools[poolId]?.ticketsSold;
  if (onchainCount !== undefined) return onchainCount;
  const participants = state.participants[poolId];
  return participants
    ? participants.reduce((sum, p) => sum + p.tickets, 0)
    : 0;
}

/** EXPIRED becomes REFUNDABLE when the connected wallet actually has a claim. */
export function displayStatus(state: DemoState, pool: Pool): PoolStatus {
  if (pool.status === 'EXPIRED') {
    const refund = state.refunds[pool.id];
    if (refund && refund.status !== 'CLAIMED') return 'REFUNDABLE';
    if (refund) return 'EXPIRED';
    // no refund record: still show REFUNDABLE if the wallet holds tickets
    if ((state.holdings[pool.id] ?? []).length > 0) return 'REFUNDABLE';
  }
  return pool.status;
}

export const OPEN_STATUSES: PoolStatus[] = [
  'WAITING',
  'LIVE',
  'FILLING_FAST',
  'SOLD_OUT',
  'DRAWING',
];

export function isOpen(state: DemoState, pool: Pool): boolean {
  return OPEN_STATUSES.includes(displayStatus(state, pool));
}

/* ------------------------------------------------------------------
   Context
   ------------------------------------------------------------------ */

let seq = 0;
const nextId = () => `d${++seq}`;

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const timers = useRef<number[]>([]);
  const scheduledDraws = useRef(new Set<string>());

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  /* ---------------- countdown ---------------- */
  useEffect(() => {
    const id = window.setInterval(() => {
      // Pausing while the tab is hidden keeps the demo from silently expiring.
      if (typeof document !== 'undefined' && document.hidden) return;

      setState((prev) => {
        let changed = false;
        const pools = { ...prev.pools };
        let refunds = prev.refunds;
        let activity = prev.activity;

        for (const poolId of Object.keys(pools)) {
          const pool = pools[poolId];
          if (!pool.started) continue;
          if (pool.status !== 'LIVE' && pool.status !== 'FILLING_FAST') continue;
          if (pool.remaining <= 0) continue;

          const remaining = pool.remaining - 1;
          changed = true;

          if (remaining > 0) {
            pools[poolId] = { ...pool, remaining };
            continue;
          }

          // timer hit zero — the pool did not fill
          pools[poolId] = { ...pool, remaining: 0, status: 'EXPIRED' };

          const owned = prev.holdings[poolId] ?? [];
          if (owned.length > 0) {
            refunds = {
              ...refunds,
              [poolId]: {
                poolId,
                amount: owned.length * pool.ticketPrice,
                asset: pool.asset,
                currency: pool.currency,
                status: 'AVAILABLE',
                wallet: USER_WALLET,
                transactionHash: null,
              },
            };
          }

          const sold = soldCount(prev, poolId);
          activity = {
            ...activity,
            [poolId]: [
              ...(activity[poolId] ?? []),
              ev(nextId(), `Timer expired at ${sold} / ${pool.capacity}`, 'just now', 'accent'),
              ev(nextId(), 'Pool expired — no winner selected', 'just now'),
              ...(owned.length > 0
                ? [ev(nextId(), 'Refunds available', 'just now', 'mint')]
                : []),
            ],
          };
        }

        return changed ? { ...prev, pools, refunds, activity } : prev;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /* ---------------- draw sequence ---------------- */
  const beginDraw = useCallback(
    (poolId: string) => {
      const setPhase = (phase: DrawPhase, status?: PoolStatus) =>
        setState((prev) => {
          const pool = prev.pools[poolId];
          if (!pool) return prev;
          return {
            ...prev,
            pools: {
              ...prev.pools,
              [poolId]: {
                ...pool,
                drawPhase: phase,
                status: status ?? pool.status,
              },
            },
          };
        });

      /**
       * Ticket #08 is selected for the demo so the journey lands on the
       * documented outcome (#08 → 0x7F3...91C2). Swap this for the contract's
       * verifiable random result once the draw is integrated onchain.
       */
      later(() => setPhase('COUNTING', 'DRAWING'), 1100);
      later(() => setPhase('VERIFYING'), 3400);

      // The winning ticket resolves at reveal, so the winning wallet can be
      // shown next to it rather than only after settlement.
      later(() => {
        setState((prev) => {
          const pool = prev.pools[poolId];
          if (!pool) return prev;

          /**
           * Ticket #08 is selected for the demo so the journey lands on the
           * documented outcome (#08 → 0x7F3...91C2). Swap this for the
           * contract's verifiable random result once the draw is onchain.
           */
          const winningTicket = pool.capacity >= 8 ? 8 : Math.max(1, pool.capacity);
          const owned = prev.holdings[poolId] ?? [];
          const userOwnsIt = owned.includes(winningTicket);
          const fallback = [...(prev.participants[poolId] ?? [])].sort(
            (a, b) => b.tickets - a.tickets,
          )[0];
          const winner = userOwnsIt ? USER_WALLET : (fallback?.wallet ?? FILLER_WALLET);

          return {
            ...prev,
            pools: {
              ...prev.pools,
              [poolId]: { ...pool, drawPhase: 'REVEALED', winningTicket, winner },
            },
          };
        });
      }, 5200);

      later(() => {
        setState((prev) => {
          const pool = prev.pools[poolId];
          if (!pool) return prev;

          return {
            ...prev,
            pools: {
              ...prev.pools,
              [poolId]: {
                ...pool,
                status: 'COMPLETED',
                drawPhase: 'DONE',
                completedLabel: 'just now',
              },
            },
            activity: {
              ...prev.activity,
              [poolId]: [
                ...(prev.activity[poolId] ?? []),
                ev(
                  nextId(),
                  `${pool.capacity} / ${pool.capacity} filled — sales stopped`,
                  'just now',
                  'accent',
                ),
                ev(nextId(), 'Draw executed', 'just now', 'accent'),
                ev(
                  nextId(),
                  `Winning ticket #${String(pool.winningTicket ?? 8).padStart(2, '0')}`,
                  'just now',
                  'mint',
                ),
                ev(nextId(), `Prize settled to ${pool.winner ?? FILLER_WALLET}`, 'just now', 'mint'),
              ],
            },
          };
        });
      }, 7400);
    },
    [later],
  );

  /* ---------------- actions ---------------- */
  const buyTickets = useCallback(
    (poolId: string, qty: number) => {
      if (qty <= 0) return;

      setState((prev) => {
        const pool = prev.pools[poolId];
        if (!pool) return prev;

        const sold = soldCount(prev, poolId);
        const take = Math.min(qty, pool.capacity - sold);
        if (take <= 0) return prev;

        const existing = prev.holdings[poolId] ?? [];
        const newNumbers = Array.from({ length: take }, (_, i) => sold + i + 1).filter(
          (n) => !existing.includes(n),
        );

        const participants = [...(prev.participants[poolId] ?? [])];
        const idx = participants.findIndex((p) => p.wallet === USER_WALLET);
        if (idx >= 0) {
          participants[idx] = { ...participants[idx], tickets: participants[idx].tickets + take };
        } else {
          participants.push({ wallet: USER_WALLET, tickets: take });
        }

        const nextSold = sold + take;
        const filled = nextSold >= pool.capacity;
        const fillRatio = nextSold / pool.capacity;

        const status: PoolStatus = filled
          ? 'SOLD_OUT'
          : fillRatio >= 0.75
            ? 'FILLING_FAST'
            : 'LIVE';

        const label = newNumbers.length
          ? `tickets ${newNumbers.map((n) => `#${String(n).padStart(2, '0')}`).join(', ')}`
          : undefined;

        return {
          ...prev,
          pools: {
            ...prev.pools,
            [poolId]: {
              ...pool,
              status,
              // the first purchase in a pool starts its countdown
              started: true,
              ticketsSold: nextSold,
              startTime: pool.startTime ?? Date.now(),
              deadline: pool.deadline ?? Date.now() + 180_000,
              remaining: pool.started ? pool.remaining : 180,
            },
          },
          holdings: { ...prev.holdings, [poolId]: [...existing, ...newNumbers] },
          participants: { ...prev.participants, [poolId]: participants },
          activity: {
            ...prev.activity,
            [poolId]: [
              ...(prev.activity[poolId] ?? []),
              ev(
                nextId(),
                `Wallet ${USER_WALLET} bought ${take} ${take === 1 ? 'ticket' : 'tickets'}`,
                'just now',
                'mint',
                label,
              ),
              ...(filled
                ? [ev(nextId(), `${nextSold} / ${pool.capacity} tickets filled`, 'just now', 'accent')]
                : []),
            ],
          },
        };
      });

    },
    [],
  );

  // React state is the single source of truth for starting a draw. This avoids
  // stale closure races when purchases arrive close together.
  useEffect(() => {
    for (const pool of Object.values(state.pools)) {
      if (pool.status !== 'SOLD_OUT' || pool.drawPhase !== 'NONE') continue;
      if (scheduledDraws.current.has(pool.id)) continue;
      scheduledDraws.current.add(pool.id);
      beginDraw(pool.id);
    }
  }, [state.pools, beginDraw]);

  const claimRefund = useCallback(
    (poolId: string) => {
      setState((prev) => {
        const refund = prev.refunds[poolId];
        if (!refund || refund.status === 'CLAIMED') return prev;
        return {
          ...prev,
          refunds: { ...prev.refunds, [poolId]: { ...refund, status: 'CLAIMING' } },
        };
      });

      later(() => {
        setState((prev) => {
          const refund = prev.refunds[poolId];
          if (!refund) return prev;
          return {
            ...prev,
            refunds: {
              ...prev.refunds,
              [poolId]: { ...refund, status: 'CLAIMED', claimedAt: 'just now' },
            },
            activity: {
              ...prev.activity,
              [poolId]: [
                ...(prev.activity[poolId] ?? []),
                ev(nextId(), `Refund claimed — ${refund.amount} ${refund.currency}`, 'just now', 'mint'),
              ],
            },
          };
        });
      }, 1600);
    },
    [later],
  );

  /** Demo control: sell every remaining ticket to another wallet, then draw. */
  const fillPool = useCallback(
    (poolId: string) => {
      const current = state.pools[poolId];
      if (!current) return;
      if (current.status === 'COMPLETED' || current.status === 'EXPIRED') return;
      if (current.status === 'DRAWING' || current.status === 'SOLD_OUT') return;
      if (current.capacity - soldCount(state, poolId) <= 0) return;

      setState((prev) => {
        const pool = prev.pools[poolId];
        if (!pool) return prev;

        const sold = soldCount(prev, poolId);
        const room = pool.capacity - sold;
        if (room <= 0) return prev;

        const participants = [...(prev.participants[poolId] ?? [])];
        const idx = participants.findIndex((p) => p.wallet === FILLER_WALLET);
        if (idx >= 0) {
          participants[idx] = { ...participants[idx], tickets: participants[idx].tickets + room };
        } else {
          participants.push({ wallet: FILLER_WALLET, tickets: room });
        }

        return {
          ...prev,
          pools: {
            ...prev.pools,
            [poolId]: {
              ...pool,
              status: 'SOLD_OUT',
              started: true,
              ticketsSold: pool.capacity,
              startTime: pool.startTime ?? Date.now(),
              deadline: pool.deadline ?? Date.now() + 180_000,
            },
          },
          participants: { ...prev.participants, [poolId]: participants },
          activity: {
            ...prev.activity,
            [poolId]: [
              ...(prev.activity[poolId] ?? []),
              ev(
                nextId(),
                `Wallet ${FILLER_WALLET} bought ${room} ${room === 1 ? 'ticket' : 'tickets'}`,
                'just now',
                'default',
              ),
              ev(nextId(), `${pool.capacity} / ${pool.capacity} tickets filled`, 'just now', 'accent'),
            ],
          },
        };
      });

    },
    [state],
  );

  /** Demo control: jump the countdown to zero. */
  const expirePool = useCallback((poolId: string) => {
    setState((prev) => {
      const pool = prev.pools[poolId];
      if (!pool) return prev;
      if (pool.status === 'COMPLETED' || pool.status === 'EXPIRED') return prev;

      const sold = soldCount(prev, poolId);
      const owned = prev.holdings[poolId] ?? [];

      return {
        ...prev,
        pools: {
          ...prev.pools,
          [poolId]: { ...pool, remaining: 0, started: true, status: 'EXPIRED', drawPhase: 'NONE' },
        },
        refunds:
          owned.length > 0
            ? {
                ...prev.refunds,
                [poolId]: {
                  poolId,
                  amount: owned.length * pool.ticketPrice,
                  asset: pool.asset,
                  currency: pool.currency,
                  status: 'AVAILABLE',
                  wallet: USER_WALLET,
                  transactionHash: null,
                },
              }
            : prev.refunds,
        activity: {
          ...prev.activity,
          [poolId]: [
            ...(prev.activity[poolId] ?? []),
            ev(nextId(), `Timer expired at ${sold} / ${pool.capacity}`, 'just now', 'accent'),
            ev(nextId(), 'Pool expired — no winner selected', 'just now'),
            ...(owned.length > 0
              ? [ev(nextId(), 'Refunds available', 'just now', 'mint')]
              : []),
          ],
        },
      };
    });
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    scheduledDraws.current.clear();
    setState(initialState());
  }, [clearTimers]);

  const value = useMemo<OnedrawProviderValue>(
    () => ({
      state,
      buyTickets,
      claimRefund,
      claimPrize: async () => undefined,
      fillPool,
      expirePool,
      reset,
    }),
    [state, buyTickets, claimRefund, fillPool, expirePool, reset],
  );

  return <OnedrawContext.Provider value={value}>{children}</OnedrawContext.Provider>;
}

export type { ActivityEvent, Participant, Pool, PoolStatus, RefundRecord } from '../../domain/models';
export { useDemo, useOnedraw } from '../OnedrawContext';
