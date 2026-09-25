import { formatUnits } from 'viem';

export function formatAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatTokenBalance(value: bigint | undefined, decimals: number | undefined, digits = 4) {
  if (value === undefined || decimals === undefined) return '—';
  const [whole, fraction = ''] = formatUnits(value, decimals).split('.');
  const trimmed = fraction.slice(0, digits).replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole;
}
