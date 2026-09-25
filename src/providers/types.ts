import type { ActivityEvent, Pool, RefundRecord, Transaction } from '../domain/models';

export type OnedrawState = {
  pools: Record<string, Pool>;
  order: string[];
  participants: Record<string, Array<{ wallet: string; tickets: number }>>;
  holdings: Record<string, number[]>;
  refunds: Record<string, RefundRecord>;
  activity: Record<string, ActivityEvent[]>;
  transaction?: Transaction;
  error?: string;
  loading?: boolean;
};

/** Stable UI-facing contract implemented by DemoProvider now and OnchainProvider later. */
export type OnedrawProviderValue = {
  state: OnedrawState;
  buyTickets: (poolId: string, quantity: number) => void | Promise<void>;
  claimRefund: (poolId: string) => void | Promise<void>;
  claimPrize: (poolId: string) => void | Promise<void>;
  /** Demo-only controls. An onchain provider must reject these explicitly. */
  fillPool: (poolId: string) => void;
  expirePool: (poolId: string) => void;
  reset: () => void;
  refresh?: () => Promise<void>;
};

export type DataSource = 'demo' | 'onchain';
