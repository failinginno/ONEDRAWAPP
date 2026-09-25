import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDemo } from '../../app/store';
import { fmtMoney, fmtTicket } from '../../app/format';
import Panel from '../../components/app/Panel';
import EmptyState from '../../components/app/EmptyState';
import { chainConfig, configuredNetworkName } from '../../config/env';
import { getTransactionExplorerUrl } from '../../services/web3/explorer';
import type { Hash } from 'viem';

type Filter = 'All' | 'USDG' | 'ETH';
const FILTERS: Filter[] = ['All', 'USDG', 'ETH'];

export default function ResultsPage() {
  const { state } = useDemo();
  const [filter, setFilter] = useState<Filter>('All');

  const completed = useMemo(
    () =>
      state.order
        .map((id) => state.pools[id])
        .filter(Boolean)
        .filter((p) => p.status === 'COMPLETED')
        .filter((p) => (filter === 'All' ? true : p.currency === filter)),
    [state.order, state.pools, filter],
  );

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-8 lg:py-14">
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-mint-soft" />
        <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-white/45">
          Settled draws
        </span>
      </div>

      <h1 className="mt-5 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-[2.6rem]">
        Results
      </h1>
      <p className="mt-3 max-w-lg text-[13.5px] leading-[1.65] text-white/45">
        Every completed draw, with the ticket that was selected and the wallet that received the
        prize.
      </p>

      {/* filters */}
      <div className="mt-9 flex flex-wrap items-center gap-2 border-b border-white/[0.07] pb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
              filter === f
                ? 'bg-white/[0.08] text-white'
                : 'text-white/45 hover:bg-white/[0.03] hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[11.5px] text-white/25">
          {completed.length} {completed.length === 1 ? 'draw' : 'draws'}
        </span>
      </div>

      <div className="mt-6">
        {completed.length === 0 ? (
          <Panel>
            <EmptyState
              icon="results"
              title="No Results Yet"
              body="Completed draws will appear here."
            />
          </Panel>
        ) : (
          <Panel className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {['Pool', 'Prize', 'Winning Ticket', 'Winner', 'Completed', 'Transaction'].map(
                      (h) => (
                        <th
                          key={h}
                          scope="col"
                          className={`px-5 py-4 text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35 ${
                            h === 'Transaction' ? 'text-right' : ''
                          }`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {completed.map((pool, i) => (
                    <motion.tr
                      key={pool.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
                      className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4 font-mono text-[12px] text-white/55">
                        #{pool.id}
                      </td>
                      <td className="tabular px-5 py-4 text-[12.5px] font-medium text-white">
                        {fmtMoney(pool.prize, pool.currency)}
                      </td>
                      <td className="px-5 py-4 font-mono text-[12.5px] text-azure-ice">
                        {fmtTicket(pool.winningTicket ?? 0)}
                      </td>
                      <td className="px-5 py-4 font-mono text-[12px] text-white/75">
                        {pool.winner ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-[12px] text-white/40">
                        {pool.completedLabel ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {pool.transactionHash ? (
                          <a
                            href={getTransactionExplorerUrl(pool.transactionHash as Hash)}
                            target="_blank"
                            rel="noreferrer"
                            className="whitespace-nowrap text-[12px] text-azure-ice transition-colors hover:text-white"
                          >
                            Explorer ↗
                          </a>
                        ) : (
                          <Link
                            to={`/app/pool/${pool.id}`}
                            className="whitespace-nowrap text-[12px] text-white/45 transition-colors hover:text-white"
                          >
                            View →
                          </Link>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/[0.07] px-5 py-4">
              <p className="text-[10.5px] leading-[1.6] text-white/25">
                {chainConfig.dataMode === 'onchain'
                  ? `Results, winning tickets, wallets and transaction links are read from ${configuredNetworkName}.`
                  : 'Demo data. Transaction links and block references become available once the draw contracts are integrated.'}
              </p>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
