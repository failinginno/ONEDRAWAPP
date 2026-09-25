import type { Address, Hash } from 'viem';
import { chainConfig } from '../../config/env';

const base = () => chainConfig.explorerUrl?.replace(/\/$/, '');

export function getAddressExplorerUrl(address: Address): string | undefined {
  const explorer = base();
  return explorer ? `${explorer}/address/${address}` : undefined;
}

export function getTransactionExplorerUrl(hash: Hash): string | undefined {
  const explorer = base();
  return explorer ? `${explorer}/tx/${hash}` : undefined;
}
