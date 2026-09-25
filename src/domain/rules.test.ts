import { describe, expect, it } from 'vitest';
import { deriveTemporalStatus, isDeadlineReached, isPoolFull, ticketProbability } from './rules';

describe('ONEDRAW pool rules', () => {
  it('calculates probability from wallet tickets and capacity', () => {
    expect(ticketProbability(3, 11)).toBeCloseTo(3 / 11);
  });

  it('detects capacity without allowing overselling', () => {
    expect(isPoolFull({ ticketsSold: 11, capacity: 11 })).toBe(true);
    expect(isPoolFull({ ticketsSold: 10, capacity: 11 })).toBe(false);
  });

  it('treats the exact deadline as expired', () => {
    expect(isDeadlineReached({ deadline: 1000 }, 1000)).toBe(true);
    expect(deriveTemporalStatus({ status: 'LIVE', ticketsSold: 5, capacity: 11, deadline: 1000 }, 1000)).toBe('EXPIRED');
  });

  it('prioritizes a full pool over expiration projection', () => {
    expect(deriveTemporalStatus({ status: 'LIVE', ticketsSold: 11, capacity: 11, deadline: 1000 }, 1000)).toBe('SOLD_OUT');
  });
});
