import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { formatUnits, type Address, type Hash } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { chainConfig, isOnchainConfigured } from '../../config/env';
import type { OnedrawState } from '../types';
import { OnedrawContext } from '../OnedrawContext';
import { oneDrawAbi } from '../../services/web3/onedrawAbi';
import { minimalErc20Abi } from '../../services/web3/erc20';
import { accumulateParticipant, decodeOnedrawError, mapChainPool, needsApproval, validatePurchase, type ChainPoolTuple } from '../../services/web3/onedraw';
import { readOnedrawEvents } from '../../services/web3/events';
import { createTransaction, transitionTransaction } from '../../services/web3/transactions';

const emptyState = (): OnedrawState => ({ pools: {}, order: [], participants: {}, holdings: {}, refunds: {}, activity: {} });

export function OnchainProvider({ children }: { children: ReactNode }) {
  const account = useAccount();
  const publicClient = usePublicClient();
  const wallet = useWalletClient();
  const [state, setState] = useState<OnedrawState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [transaction, setTransaction] = useState<OnedrawState['transaction']>();
  const manager = chainConfig.poolManagerAddress as Address;
  const token = chainConfig.usdgAddress as Address;

  const refresh = useCallback(async () => {
    if (!publicClient || !manager) return;
    try {
      setError(undefined);
      const nextId = await publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'nextPoolId' });
      const ids = Array.from({ length: Math.max(0, Number(nextId) - 1) }, (_, i) => BigInt(i + 1));
      const rows = await Promise.all(ids.map(async (id) => {
        const [raw, effective, claimed] = await Promise.all([
          publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'getPool', args: [id] }),
          publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'getEffectiveStatus', args: [id] }),
          publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'prizeClaimed', args: [id] }).catch(() => undefined),
        ]);
        const pool = mapChainPool(raw as ChainPoolTuple, Number(effective));
        const ticketOwners = await Promise.all(
          Array.from({ length: Number(pool.ticketsSold) }, (_, ticketIndex) =>
            publicClient.readContract({
              address: manager,
              abi: oneDrawAbi,
              functionName: 'getTicketOwner',
              args: [id, ticketIndex],
            }),
          ),
        );
        const tickets = account.address
          ? await publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'getUserTickets', args: [id, account.address] })
          : [];
        const [refundable, claimable] = account.address
          ? await Promise.all([
              publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'getRefundableAmount', args: [id, account.address] }),
              publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'getClaimablePrize', args: [id, account.address] }).catch(() => 0n),
            ])
          : [0n, 0n];
        pool.prizeClaimed = claimed;
        pool.claimablePrize = Number(formatUnits(claimable, 6));
        return { pool, tickets: [...tickets].map(Number), refundable, ticketOwners };
      }));
      const events = chainConfig.deploymentBlock !== undefined
        ? await readOnedrawEvents(publicClient, manager, chainConfig.deploymentBlock).catch(() => [])
        : [];
      const next = emptyState();
      for (const row of rows) {
        const id = row.pool.id;
        next.pools[id] = row.pool;
        next.order.push(id);
        next.holdings[id] = row.tickets;
        next.participants[id] = row.ticketOwners.reduce(
          (participants, owner) => accumulateParticipant(participants, owner, 1),
          [] as OnedrawState['participants'][string],
        );
        if (row.refundable > 0n && account.address) next.refunds[id] = {
          poolId: id, wallet: account.address, amount: Number(formatUnits(row.refundable, 6)),
          asset: 'USDG', currency: 'USDG', status: 'AVAILABLE', transactionHash: null,
        };
      }
      for (const entry of events) {
        const args = entry.log.args as { poolId?: bigint; buyer?: Address; wallet?: Address; quantity?: number; firstTicketIndex?: number; amount?: bigint };
        const poolId = String(args.poolId ?? '');
        if (!poolId) continue;
        next.activity[poolId] = [...(next.activity[poolId] ?? []), entry.activity];
        if (entry.log.eventName === 'PoolCreated' && next.pools[poolId]) {
          next.pools[poolId].transactionHash = entry.log.transactionHash;
        }
        if (entry.log.eventName === 'WinnerSelected' && next.pools[poolId]) {
          next.pools[poolId].transactionHash = entry.log.transactionHash;
          next.pools[poolId].completedLabel = `block ${entry.log.blockNumber}`;
        }
        // Participant balances are rebuilt from getTicketOwner above, which is the
        // authoritative onchain ticket ledger. TicketsPurchased remains activity-only;
        // accumulating it here would count every purchased ticket a second time.
        if (
          entry.log.eventName === 'RefundClaimed'
          && account.address
          && args.wallet?.toLowerCase() === account.address.toLowerCase()
          && args.amount !== undefined
        ) {
          const currency = next.pools[poolId]?.currency ?? 'USDG';
          next.refunds[poolId] = {
            poolId,
            wallet: account.address,
            amount: Number(formatUnits(args.amount, 6)),
            asset: currency,
            currency,
            status: 'CLAIMED',
            claimedAt: `block ${entry.log.blockNumber}`,
            transactionHash: entry.log.transactionHash,
          };
        }
      }
      setState(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally { setLoading(false); }
  }, [account.address, manager, publicClient]);

  const refreshDelay = Object.values(state.pools).some((pool) =>
    ['DRAWING', 'SOLD_OUT'].includes(pool.status)) ? 3_000 : 12_000;

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), refreshDelay);
    return () => window.clearInterval(timer);
  }, [refresh, refreshDelay]);

  const runWrite = useCallback(async (type: 'BUY_TICKETS' | 'CLAIM_REFUND' | 'CLAIM_PRIZE', fn: () => Promise<Hash>) => {
    let tx = createTransaction(`${type}-${Date.now()}`, type);
    tx = transitionTransaction(tx, 'AWAITING_SIGNATURE'); setTransaction(tx);
    try {
      const hash = await fn();
      tx = transitionTransaction(tx, 'SUBMITTED', { hash }); setTransaction(tx);
      tx = transitionTransaction(tx, 'CONFIRMING'); setTransaction(tx);
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });
      if (receipt.status !== 'success') throw new Error('Transaction reverted');
      tx = transitionTransaction(tx, 'CONFIRMED'); setTransaction(tx);
      await refresh();
    } catch (cause) {
      const decoded = decodeOnedrawError(cause);
      const status = decoded === 'REJECTED' ? 'REJECTED' : 'REVERTED';
      setTransaction(transitionTransaction(tx, status, { error: decoded }));
      await refresh();
      throw cause;
    }
  }, [publicClient, refresh]);

  const buyTickets = useCallback(async (poolId: string, quantity: number) => {
    if (!publicClient || !wallet.data || !account.address) throw new Error('Wallet disconnected');
    if (account.chainId !== chainConfig.chainId) throw new Error('Wrong network');
    const raw = await publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'getPool', args: [BigInt(poolId)] }) as ChainPoolTuple;
    const effective = Number(await publicClient.readContract({ address: manager, abi: oneDrawAbi, functionName: 'getEffectiveStatus', args: [BigInt(poolId)] }));
    if (validatePurchase(effective, raw.capacity - raw.ticketsSold, quantity)) throw new Error('Pool sold out or expired before confirmation');
    const required = raw.ticketPrice * BigInt(quantity);
    const [allowance, balance, gas] = await Promise.all([
      publicClient.readContract({ address: token, abi: minimalErc20Abi, functionName: 'allowance', args: [account.address, manager] }),
      publicClient.readContract({ address: token, abi: minimalErc20Abi, functionName: 'balanceOf', args: [account.address] }),
      publicClient.getBalance({ address: account.address }),
    ]);
    if (balance < required) throw new Error('Insufficient USDG balance');
    if (gas === 0n) throw new Error('Insufficient ETH for gas');
    if (needsApproval(allowance, required)) {
      let approval = createTransaction(`APPROVE-${Date.now()}`, 'APPROVE');
      approval = transitionTransaction(approval, 'AWAITING_SIGNATURE'); setTransaction(approval);
      const hash = await wallet.data.writeContract({ address: token, abi: minimalErc20Abi, functionName: 'approve', args: [manager, required], chain: wallet.data.chain });
      approval = transitionTransaction(approval, 'CONFIRMING', { hash }); setTransaction(approval);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== 'success') throw new Error('USDG approval reverted');
      setTransaction(transitionTransaction(approval, 'CONFIRMED'));
    }
    await runWrite('BUY_TICKETS', () => wallet.data.writeContract({ address: manager, abi: oneDrawAbi, functionName: 'buyTickets', args: [BigInt(poolId), quantity], chain: wallet.data.chain }));
  }, [account, manager, publicClient, runWrite, token, wallet.data]);

  const claimRefund = useCallback(async (poolId: string) => {
    if (!wallet.data) throw new Error('Wallet disconnected');
    await runWrite('CLAIM_REFUND', () => wallet.data!.writeContract({ address: manager, abi: oneDrawAbi, functionName: 'claimRefund', args: [BigInt(poolId)], chain: wallet.data!.chain }));
  }, [manager, runWrite, wallet.data]);

  const claimPrize = useCallback(async (poolId: string) => {
    if (!wallet.data) throw new Error('Wallet disconnected');
    await runWrite('CLAIM_PRIZE', () => wallet.data!.writeContract({ address: manager, abi: oneDrawAbi, functionName: 'claimPrize', args: [BigInt(poolId)], chain: wallet.data!.chain }));
  }, [manager, runWrite, wallet.data]);

  const value = useMemo(() => ({ state: { ...state, transaction, error, loading }, buyTickets, claimRefund, claimPrize,
    fillPool: () => { throw new Error('Unavailable in onchain mode'); },
    expirePool: () => { throw new Error('Unavailable in onchain mode'); },
    reset: () => void refresh(), refresh,
  }), [buyTickets, claimPrize, claimRefund, error, loading, refresh, state, transaction]);

  if (!isOnchainConfigured()) throw new Error('Onchain mode requires VITE_POOL_MANAGER_ADDRESS');
  return <OnedrawContext.Provider value={value}>{children}</OnedrawContext.Provider>;
}
