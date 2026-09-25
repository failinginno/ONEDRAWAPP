/** Chain-agnostic ONEDRAW domain models. UI code must depend on these models,
 * never directly on a wallet SDK or contract response shape. */
export type AssetSymbol = 'USDG' | 'ETH';

export type PoolStatus =
  | 'WAITING'
  | 'LIVE'
  | 'FILLING_FAST'
  | 'SOLD_OUT'
  | 'DRAWING'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'REFUNDABLE';

export type DrawPhase = 'NONE' | 'COUNTING' | 'VERIFYING' | 'REVEALED' | 'DONE';

export type Pool = {
  id: string;
  asset: AssetSymbol;
  prizeAmount: number;
  ticketPrice: number;
  capacity: number;
  ticketsSold: number;
  startTime: number | null;
  deadline: number | null;
  protocolFee: number;
  status: PoolStatus;
  winner?: string;
  winningTicket?: number;
  randomnessRequestId: string | null;
  prizeClaimed?: boolean;
  claimablePrize?: number;
  createdAt: number;
  transactionHash: string | null;
  drawPhase: DrawPhase;

  /** Presentation-only demo metadata. Onchain adapters may populate these. */
  remaining: number;
  duration?: number;
  started: boolean;
  createdLabel: string;
  completedLabel?: string;

  /** @deprecated UI compatibility aliases; adapters own this mapping. */
  prize: number;
  /** @deprecated UI compatibility aliases; adapters own this mapping. */
  currency: AssetSymbol;
};

export type Ticket = {
  poolId: string;
  number: number;
  owner: string;
  transactionHash: string | null;
};

export type WalletEntry = {
  poolId: string;
  wallet: string;
  tickets: number;
};

export type DrawResult = {
  poolId: string;
  winner: string;
  winningTicket: number;
  randomnessRequestId: string | null;
  transactionHash: string | null;
};

export type RefundStatus = 'AVAILABLE' | 'CLAIMING' | 'CLAIMED';

export type Refund = {
  poolId: string;
  wallet: string;
  amount: number;
  asset: AssetSymbol;
  status: RefundStatus;
  claimedAt?: string;
  transactionHash: string | null;
  /** @deprecated UI compatibility alias; adapters own this mapping. */
  currency: AssetSymbol;
};

export type TransactionStatus =
  | 'IDLE'
  | 'AWAITING_SIGNATURE'
  | 'SUBMITTED'
  | 'CONFIRMING'
  | 'CONFIRMED'
  | 'REVERTED'
  | 'REJECTED'
  | 'FAILED';

export type TransactionType = 'APPROVE' | 'BUY_TICKETS' | 'CLAIM_REFUND' | 'CLAIM_PRIZE';

export type Transaction = {
  id: string;
  hash: string | null;
  type: TransactionType;
  status: TransactionStatus;
  submittedAt: number | null;
  confirmedAt: number | null;
  error?: OnedrawErrorCode | string;
  explorerUrl: string | null;
};

export type OnedrawErrorCode =
  | 'WALLET_DISCONNECTED'
  | 'WRONG_NETWORK'
  | 'INSUFFICIENT_USDG'
  | 'INSUFFICIENT_GAS'
  | 'APPROVAL_REQUIRED'
  | 'APPROVAL_PENDING'
  | 'PURCHASE_PENDING'
  | 'PURCHASE_CONFIRMED'
  | 'PURCHASE_REVERTED'
  | 'POOL_EXPIRED'
  | 'POOL_SOLD_OUT'
  | 'REFUND_UNAVAILABLE'
  | 'REFUND_PENDING'
  | 'REFUND_COMPLETED'
  | 'PRIZE_UNAVAILABLE'
  | 'RANDOMNESS_PENDING'
  | 'DRAW_SETTLEMENT_PENDING'
  | 'RPC_FAILURE';

export type ActivityEvent = {
  id: string;
  label: string;
  detail?: string;
  at: string;
  tone: 'default' | 'accent' | 'mint';
};

// Compatibility names used by the existing presentation components.
export type Currency = AssetSymbol;
export type Participant = { wallet: string; tickets: number };
export type RefundRecord = {
  poolId: string;
  amount: number;
  asset: AssetSymbol;
  currency: AssetSymbol;
  status: RefundStatus;
  claimedAt?: string;
  wallet?: string;
  transactionHash?: string | null;
};
