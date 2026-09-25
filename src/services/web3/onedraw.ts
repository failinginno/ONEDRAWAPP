import {
  decodeErrorResult,
  formatUnits,
  type Address,
  type Hash,
  type Log,
} from 'viem';
import type { ActivityEvent, OnedrawErrorCode, Pool, PoolStatus } from '../../domain/models';
import type { Participant } from '../../domain/models';
import { oneDrawAbi } from './onedrawAbi';

export const CHAIN_POOL_STATUSES = ['WAITING', 'LIVE', 'DRAWING', 'COMPLETED', 'EXPIRED'] as const;

export const needsApproval = (allowance: bigint, required: bigint) => allowance < required;

export function accumulateParticipant(rows: Participant[], buyer: Address, quantity: number): Participant[] {
  const next = rows.map((row) => ({ ...row }));
  const existing = next.find((row) => row.wallet.toLowerCase() === buyer.toLowerCase());
  if (existing) existing.tickets += quantity;
  else next.push({ wallet: buyer, tickets: quantity });
  return next;
}

export function validatePurchase(status: number, remaining: number, quantity: number) {
  if (status > 1) return 'POOL_SOLD_OUT' as const;
  if (quantity < 1 || quantity > remaining) return 'POOL_SOLD_OUT' as const;
  return null;
}

export function parseChainStatus(status: number, sold: number, capacity: number): PoolStatus {
  const chainStatus = CHAIN_POOL_STATUSES[status];
  if (!chainStatus) throw new Error(`Unknown pool status: ${status}`);
  if (chainStatus === 'LIVE' && sold / capacity >= 0.75) return 'FILLING_FAST';
  return chainStatus;
}

export type ChainPoolTuple = {
  id: bigint; token: Address; prizeAmount: bigint; ticketPrice: bigint;
  capacity: number; ticketsSold: number; duration: bigint; startTime: bigint;
  deadline: bigint; protocolFee: bigint; status: number; winner: Address;
  winningTicket: number; randomnessRequestId: bigint;
};

export function mapChainPool(raw: ChainPoolTuple, effectiveStatus: number, now = Date.now()): Pool {
  const { id, prizeAmount: prize, ticketPrice: price, capacity, ticketsSold: sold,
    duration, startTime: start, deadline, protocolFee: fee, winner, winningTicket: winning,
    randomnessRequestId: request } = raw;
  const status = parseChainStatus(effectiveStatus, sold, capacity);
  return {
    id: id.toString(), asset: 'USDG', currency: 'USDG',
    prizeAmount: Number(formatUnits(prize, 6)), prize: Number(formatUnits(prize, 6)),
    ticketPrice: Number(formatUnits(price, 6)), capacity, ticketsSold: sold,
    startTime: start === 0n ? null : Number(start) * 1000,
    deadline: deadline === 0n ? null : Number(deadline) * 1000,
    protocolFee: Number(formatUnits(fee, 6)), status,
    winner: winner === '0x0000000000000000000000000000000000000000' ? undefined : winner,
    winningTicket: status === 'COMPLETED' ? winning : undefined,
    randomnessRequestId: request === 0n ? null : request.toString(),
    createdAt: now, transactionHash: null,
    drawPhase: status === 'COMPLETED' ? 'DONE' : status === 'DRAWING' ? 'VERIFYING' : 'NONE',
    remaining: deadline === 0n ? 0 : Math.max(0, Number(deadline) - Math.floor(now / 1000)),
    duration: Number(duration),
    started: start !== 0n, createdLabel: 'Onchain',
    completedLabel: status === 'COMPLETED' ? 'Onchain' : undefined,
  };
}

export function decodeOnedrawError(error: unknown): OnedrawErrorCode | string {
  const text = error instanceof Error ? error.message : String(error);
  if (/user rejected|denied transaction/i.test(text)) return 'REJECTED';
  if (/insufficient funds/i.test(text)) return 'INSUFFICIENT_GAS';
  const data = text.match(/0x[0-9a-fA-F]{8,}/)?.[0] as `0x${string}` | undefined;
  if (data) {
    try {
      const decoded = decodeErrorResult({ abi: oneDrawAbi, data });
      if (decoded.errorName === 'PoolExpired') return 'POOL_EXPIRED';
      if (['PoolSoldOut', 'PoolNotOpen', 'InsufficientRemainingTickets'].includes(decoded.errorName)) return 'POOL_SOLD_OUT';
      if (decoded.errorName === 'RefundUnavailable') return 'REFUND_UNAVAILABLE';
      if (decoded.errorName === 'PrizeUnavailable') return 'PRIZE_UNAVAILABLE';
    } catch { /* wallet messages are not always ABI data */ }
  }
  return 'RPC_FAILURE';
}

export function eventToActivity(log: Log & { eventName?: string; args?: Record<string, unknown> }): ActivityEvent {
  const hash = log.transactionHash as Hash | null;
  return {
    id: `${hash ?? 'pending'}-${log.logIndex ?? 0}`,
    label: log.eventName ?? 'Contract event',
    detail: hash ?? undefined,
    at: `block ${log.blockNumber?.toString() ?? 'pending'}`,
    tone: ['WinnerSelected', 'PrizePaid', 'RefundClaimed'].includes(log.eventName ?? '') ? 'mint' : 'accent',
  };
}
