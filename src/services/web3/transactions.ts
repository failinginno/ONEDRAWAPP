import type { Hash } from 'viem';
import type { Transaction, TransactionStatus, TransactionType } from '../../domain/models';
import { getTransactionExplorerUrl } from './explorer';

export function createTransaction(id: string, type: TransactionType): Transaction {
  return {
    id,
    hash: null,
    type,
    status: 'IDLE',
    submittedAt: null,
    confirmedAt: null,
    explorerUrl: null,
  };
}

export function transitionTransaction(
  transaction: Transaction,
  status: TransactionStatus,
  options: { hash?: Hash; error?: string; now?: number } = {},
): Transaction {
  const now = options.now ?? Date.now();
  const hash = options.hash ?? transaction.hash;
  return {
    ...transaction,
    status,
    hash,
    error: options.error,
    submittedAt:
      transaction.submittedAt ?? (status === 'SUBMITTED' || status === 'CONFIRMING' ? now : null),
    confirmedAt: status === 'CONFIRMED' ? now : transaction.confirmedAt,
    explorerUrl: hash ? (getTransactionExplorerUrl(hash as Hash) ?? null) : null,
  };
}
