import type { Pool, PoolStatus } from './models';

export const ticketProbability = (walletTickets: number, capacity: number) =>
  capacity > 0 ? walletTickets / capacity : 0;

export const isPoolFull = (pool: Pick<Pool, 'ticketsSold' | 'capacity'>) =>
  pool.ticketsSold >= pool.capacity;

export const isDeadlineReached = (pool: Pick<Pool, 'deadline'>, now = Date.now()) =>
  pool.deadline !== null && now >= pool.deadline;

/**
 * Read-only temporal derivation for adapters. A countdown never executes a
 * transaction; it only projects state from a trusted deadline.
 */
export function deriveTemporalStatus(
  pool: Pick<Pool, 'status' | 'ticketsSold' | 'capacity' | 'deadline'>,
  now = Date.now(),
): PoolStatus {
  if (pool.status === 'COMPLETED' || pool.status === 'DRAWING' || pool.status === 'REFUNDABLE') {
    return pool.status;
  }
  if (pool.ticketsSold >= pool.capacity) return 'SOLD_OUT';
  if (pool.deadline !== null && now >= pool.deadline) return 'EXPIRED';
  return pool.status;
}
