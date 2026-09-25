import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Pool } from '../../app/store';
import { fmtMoney, fmtTicket, protocolFee } from '../../app/format';
import { useDemo } from '../../app/store';
import { useWallet } from '../../providers/wallet/WalletProvider';
import { getTransactionExplorerUrl } from '../../services/web3/explorer';
import type { Hash } from 'viem';

/**
 * Completed pool result.
 *
 * Anything that is not yet wired to a contract says so plainly rather than
 * implying an onchain settlement that has not happened.
 */
export default function WinnerResult({ pool }: { pool: Pool }) {
  const { claimPrize, state } = useDemo();
  const wallet = useWallet();
  const winner = pool.winningTicket ?? 8;
  const fee = protocolFee(pool.ticketPrice, pool.capacity, pool.prize);

  const rows: [string, string, boolean][] = [
    ['Pool', `#${pool.id}`, false],
    ['Winning Ticket', fmtTicket(winner), true],
    ['Winner', pool.winner ?? '—', false],
    ['Prize', fmtMoney(pool.prize, pool.currency), false],
    ['Protocol Fee', fmtMoney(fee, pool.currency), false],
  ];

  const verification: [string, string, 'mint' | 'neutral'][] = [
    ['Draw Status', 'Completed', 'mint'],
    ['Prize', pool.prizeClaimed === undefined ? 'Paid automatically (legacy)' : pool.prizeClaimed ? 'Claimed' : 'Awaiting winner claim', pool.prizeClaimed ? 'mint' : 'neutral'],
    ['Winning Ticket', fmtTicket(winner), 'neutral'],
  ];
  const isWinner = Boolean(wallet.address && pool.winner && wallet.address.toLowerCase() === pool.winner.toLowerCase());
  const participated = (state.holdings[pool.id]?.length ?? 0) > 0;
  const claimPending = state.transaction?.type === 'CLAIM_PRIZE' && ['AWAITING_SIGNATURE', 'SUBMITTED', 'CONFIRMING'].includes(state.transaction.status);
  const explorer = pool.transactionHash ? getTransactionExplorerUrl(pool.transactionHash as Hash) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="od-panel rounded-2xl"
    >
      <div className="border-b border-white/[0.07] px-5 py-5 md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-soft" />
          <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-mint-soft">
            Draw complete
          </span>
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">
          {isWinner ? 'Congratulations — your ticket won.' : participated ? 'This time, another ticket won.' : 'One ticket was selected.'}
        </h2>
        {participated && !isWinner && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="text-[13px] text-white/50">Your tickets were not selected in this draw.</p>
            <Link to="/app" className="text-[13px] font-medium text-azure-ice transition-colors hover:text-white">
              Try another pool →
            </Link>
          </div>
        )}
      </div>

      {pool.prizeClaimed === false && isWinner && (
        <div className="border-t border-white/[0.07] px-5 py-5 md:px-6">
          <button
            type="button"
            disabled={claimPending}
            onClick={() => void claimPrize(pool.id)}
            className="w-full rounded-xl bg-white py-3.5 text-[13.5px] font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-60"
          >
            {claimPending ? 'Claiming Prize...' : `Claim ${fmtMoney(pool.prize, pool.currency)} Prize`}
          </button>
        </div>
      )}

      <div className="px-5 py-6 md:px-6">
        <dl>
          {rows.map(([k, v, accent], i) => (
            <div
              key={k}
              className={`flex items-center justify-between gap-4 py-3.5 ${
                i > 0 ? 'border-t border-white/[0.05]' : ''
              }`}
            >
              <dt className="text-[12.5px] text-white/45">{k}</dt>
              <dd
                className={`tabular text-[13.5px] font-medium ${
                  accent ? 'font-mono text-azure-ice' : 'text-white'
                }`}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* verification */}
      <div className="border-t border-white/[0.07] px-5 py-5 md:px-6">
        <div className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/35">
          Verification
        </div>

        <div className="mt-4 space-y-3">
          {verification.map(([k, v, tone]) => (
            <div key={k} className="flex items-center justify-between gap-4">
              <span className="text-[12.5px] text-white/45">{k}</span>
              <span
                className={`text-[12.5px] font-medium ${
                  tone === 'mint' ? 'text-mint-soft' : 'font-mono text-white/80'
                }`}
              >
                {v}
              </span>
            </div>
          ))}

          <div className="flex items-start justify-between gap-4">
            <span className="shrink-0 text-[12.5px] text-white/45">Transaction</span>
            {explorer ? <a href={explorer} target="_blank" rel="noreferrer" className="text-right text-[12px] text-azure-ice hover:text-white">View on Explorer</a> : <span className="text-right text-[12px] text-white/40">Unavailable</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
