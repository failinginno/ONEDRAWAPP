import { describe, expect, it } from 'vitest';
import { ROBINHOOD_TESTNET_DEFAULTS, resolveChainConfig } from '../../config/env';
import { getAddressExplorerUrl, getTransactionExplorerUrl } from './explorer';
import { formatAddress, formatTokenBalance } from './format';
import { createTransaction, transitionTransaction } from './transactions';
import { getWalletNetworkState } from './walletState';

const address = '0x1234567890abcdef1234567890abcdef1234ABCD' as const;
const hash = `0x${'1'.repeat(64)}` as const;

describe('wallet presentation states', () => {
  it('represents disconnected, wrong-network and ready states', () => {
    expect(getWalletNetworkState(false, undefined, 46630)).toBe('DISCONNECTED');
    expect(getWalletNetworkState(true, 1, 46630)).toBe('WRONG_NETWORK');
    expect(getWalletNetworkState(true, 46630, 46630)).toBe('READY');
  });

  it('formats connected addresses', () => {
    expect(formatAddress(address)).toBe('0x1234...ABCD');
  });
});

describe('Robinhood Testnet configuration', () => {
  it('uses safe public defaults when environment values are absent', () => {
    expect(resolveChainConfig({})).toMatchObject(ROBINHOOD_TESTNET_DEFAULTS);
  });

  it('accepts environment overrides and rejects invalid numeric chain input', () => {
    expect(resolveChainConfig({ VITE_CHAIN_ID: '123' }).chainId).toBe(123);
    expect(resolveChainConfig({ VITE_CHAIN_ID: 'not-a-number' }).chainId).toBe(46630);
  });
});

describe('balances and explorer links', () => {
  it('formats verified six-decimal USDG values', () => {
    expect(formatTokenBalance(12_500_000n, 6, 2)).toBe('12.5');
  });

  it('formats 18-decimal ETH values', () => {
    expect(formatTokenBalance(1_234_567_000_000_000_000n, 18, 6)).toBe('1.234567');
  });

  it('generates centralized address and transaction explorer URLs', () => {
    expect(getAddressExplorerUrl(address)).toBe(`${ROBINHOOD_TESTNET_DEFAULTS.explorerUrl}/address/${address}`);
    expect(getTransactionExplorerUrl(hash)).toBe(`${ROBINHOOD_TESTNET_DEFAULTS.explorerUrl}/tx/${hash}`);
  });
});

describe('normalized transaction transitions', () => {
  it('moves from idle through signature, submission, confirmation and completion', () => {
    let transaction = createTransaction('approve-usdg', 'APPROVE');
    expect(transaction.status).toBe('IDLE');
    transaction = transitionTransaction(transaction, 'AWAITING_SIGNATURE', { now: 1 });
    transaction = transitionTransaction(transaction, 'SUBMITTED', { hash, now: 2 });
    expect(transaction.submittedAt).toBe(2);
    transaction = transitionTransaction(transaction, 'CONFIRMING', { now: 3 });
    transaction = transitionTransaction(transaction, 'CONFIRMED', { now: 4 });
    expect(transaction).toMatchObject({ status: 'CONFIRMED', hash, confirmedAt: 4 });
  });

  it.each(['REVERTED', 'REJECTED', 'FAILED'] as const)('records %s terminal state', (status) => {
    const transaction = transitionTransaction(createTransaction('tx', 'APPROVE'), status, { error: status });
    expect(transaction).toMatchObject({ status, error: status, hash: null });
  });
});
