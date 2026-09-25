import { describe, expect, it } from 'vitest';
import { accumulateParticipant, decodeOnedrawError, mapChainPool, needsApproval, parseChainStatus, validatePurchase } from './onedraw';
import type { ChainPoolTuple } from './onedraw';

const ZERO = '0x0000000000000000000000000000000000000000' as const;
const pool = (overrides: Partial<ChainPoolTuple> = {}): ChainPoolTuple => ({
  id: 1n, token: ZERO, prizeAmount: 2_000_000n, ticketPrice: 1_000_000n,
  capacity: 3, ticketsSold: 2, duration: 180n, startTime: 100n, deadline: 280n,
  protocolFee: 1_000_000n, status: 1, winner: ZERO, winningTicket: 0,
  randomnessRequestId: 0n, ...overrides,
});

describe('ONEDRAW onchain adapter', () => {
  it('maps integer token units and chain pool fields', () => {
    const mapped = mapChainPool(pool(), 1, 200_000);
    expect(mapped.prizeAmount).toBe(2);
    expect(mapped.ticketPrice).toBe(1);
    expect(mapped.ticketsSold).toBe(2);
    expect(mapped.deadline).toBe(280_000);
  });

  it('derives only documented frontend display states', () => {
    expect(parseChainStatus(1, 3, 4)).toBe('FILLING_FAST');
    expect(parseChainStatus(2, 3, 3)).toBe('DRAWING');
    expect(() => parseChainStatus(9, 0, 3)).toThrow('Unknown pool status');
  });

  it('requests exact approval only when allowance is insufficient', () => {
    expect(needsApproval(999_999n, 1_000_000n)).toBe(true);
    expect(needsApproval(1_000_000n, 1_000_000n)).toBe(false);
  });

  it('rejects stale sold-out or oversized purchases before signing', () => {
    expect(validatePurchase(2, 0, 1)).toBe('POOL_SOLD_OUT');
    expect(validatePurchase(1, 1, 2)).toBe('POOL_SOLD_OUT');
    expect(validatePurchase(1, 2, 2)).toBeNull();
  });

  it('decodes wallet rejection separately from RPC failures', () => {
    expect(decodeOnedrawError(new Error('User rejected the request'))).toBe('REJECTED');
    expect(decodeOnedrawError(new Error('network down'))).toBe('RPC_FAILURE');
  });

  it('reconstructs every participant and combines repeat purchases', () => {
    const alice = '0x0000000000000000000000000000000000000001';
    const bob = '0x0000000000000000000000000000000000000002';
    let rows = accumulateParticipant([], alice, 1);
    rows = accumulateParticipant(rows, bob, 1);
    rows = accumulateParticipant(rows, alice, 2);
    expect(rows).toEqual([{ wallet: alice, tickets: 3 }, { wallet: bob, tickets: 1 }]);
  });
});
