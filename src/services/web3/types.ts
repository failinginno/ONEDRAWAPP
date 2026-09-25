import type { DrawResult, Pool, Ticket, Transaction } from '../../domain/models';

export type WalletSession = {
  address: string;
  chainId: number;
};

export type PurchaseRequest = { poolId: string; quantity: number };
export type ApprovalRequest = { amount: bigint };

/** SDK-neutral boundary. Implement with the selected wallet/contract library later. */
export interface WalletService {
  connect(): Promise<WalletSession>;
  disconnect(): Promise<void>;
  getSession(): Promise<WalletSession | null>;
  switchNetwork(chainId: number): Promise<void>;
  getNativeBalance(address: string): Promise<bigint>;
  getTokenBalance(address: string, tokenAddress: string): Promise<bigint>;
  getTokenAllowance(owner: string, spender: string, tokenAddress: string): Promise<bigint>;
  approve(request: ApprovalRequest): Promise<Transaction>;
}

export interface OnedrawReadService {
  getPools(): Promise<Pool[]>;
  getPool(poolId: string): Promise<Pool | null>;
  getTickets(poolId: string, wallet?: string): Promise<Ticket[]>;
  getResult(poolId: string): Promise<DrawResult | null>;
  getEvents(poolId: string): Promise<ReadonlyArray<unknown>>;
}

export interface OnedrawWriteService {
  buyTickets(request: PurchaseRequest): Promise<Transaction>;
  claimRefund(poolId: string): Promise<Transaction>;
  waitForTransaction(hash: string): Promise<Transaction>;
}

export type Web3Service = WalletService & OnedrawReadService & OnedrawWriteService;
