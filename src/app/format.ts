import type { Currency } from '../domain/models';

export type { Currency } from '../domain/models';

export const CURRENCIES: Currency[] = ['USDG', 'ETH'];

/** 10 -> "10 USDG" · 0.01 -> "0.01 ETH" (trailing zeros trimmed) */
export function fmtMoney(amount: number, currency: Currency): string {
  if (currency === 'ETH') {
    const trimmed = amount
      .toFixed(4)
      .replace(/0+$/, '')
      .replace(/\.$/, '');
    return `${trimmed} ETH`;
  }
  return `${amount.toLocaleString('en-US')} USDG`;
}

/** Bare number, no currency — for dense stat grids. */
export function fmtAmount(amount: number, currency: Currency): string {
  if (currency === 'ETH') {
    return amount
      .toFixed(4)
      .replace(/0+$/, '')
      .replace(/\.$/, '');
  }
  return amount.toLocaleString('en-US');
}

/** 102 -> "01:42" */
export function fmtCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/** Ticket numbers render zero-padded: 8 -> "#08" */
export function fmtTicket(n: number): string {
  return `#${String(n).padStart(2, '0')}`;
}

/** 27.2727 -> "27.27%" */
export function fmtOdds(tickets: number, capacity: number): string {
  if (capacity <= 0) return '0.00%';
  return `${((tickets / capacity) * 100).toFixed(2)}%`;
}

export function oddsValue(tickets: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return (tickets / capacity) * 100;
}

/** Percent of a pool that has been sold. */
export function fmtProgress(sold: number, capacity: number): string {
  if (capacity <= 0) return '0.0%';
  return `${((sold / capacity) * 100).toFixed(1)}%`;
}

export function shortWallet(wallet: string): string {
  return wallet;
}

/** Protocol fee is whatever the pool collects beyond the winner's prize. */
export function protocolFee(
  ticketPrice: number,
  capacity: number,
  prize: number,
): number {
  return Math.max(0, ticketPrice * capacity - prize);
}
