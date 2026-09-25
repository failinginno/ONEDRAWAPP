import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { displayStatus, useDemo } from '../../app/store';
import { fmtMoney } from '../../app/format';
import Panel from '../../components/app/Panel';
import EmptyState from '../../components/app/EmptyState';
import { useWallet } from '../../providers/wallet/WalletProvider';

export default function RefundsPage() {
  const { state, claimRefund } = useDemo();
  const wallet = useWallet();

  const { claimable, history, totals } = useMemo(() => {
    const all = Object.values(state.refunds);
    const open = all.filter((r) => r.status !== 'CLAIMED');
    const closed = all.filter((r) => r.status === 'CLAIMED');

    // group by currency so the total is never a mix of USDG and ETH
    const byCurrency = new Map<string, number>();
    for (const r of open) {
      byCurrency.set(r.currency, (byCurrency.get(r.currency) ?? 0) + r.amount);
    }

    return {
      claimable: open,
      history: closed,
      totals: [...byCurrency.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [state.refunds]);

  const currencyOf = (poolId: string) => state.pools[poolId]?.currency ?? 'USDG';
  const ticketsOf = (poolId: string) => state.holdings[poolId]?.length ?? 0;
  const expiredPools = useMemo(
    () => state.order
      .map((id) => state.pools[id])
      .filter((pool) => pool && ['EXPIRED', 'REFUNDABLE'].includes(displayStatus(state, pool)))
      .sort((a, b) => Number(b.id) - Number(a.id)),
    [state],
  );

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-8 lg:py-14">
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-azure-cyan" />
        <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-white/45">
          Refunds
        </span>
      </div>

      <h1 className="mt-5 text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-[2.6rem]">
        Refunds
      </h1>
      <p className="mt-3 max-w-lg text-[13.5px] leading-[1.65] text-white/45">
        When a pool expires without filling, no winner is selected and no protocol fee is collected.
        Every participant can claim back the USDG they contributed.
      </p>

      {/* top statistic */}
      <div className="mt-9 grid gap-px overflow-hidden rounded-2xl bg-white/[0.07] sm:grid-cols-3">
        <div className="bg-[#08090B] px-5 py-6">
          <div className="text-[9.5px] uppercase tracking-[0.2em] text-white/35">
            Available to Claim
          </div>
          {totals.length === 0 ? (
            <div className="tabular mt-3 text-[2rem] font-semibold leading-none tracking-[-0.035em] text-mint-soft/50">
              0 USDG
            </div>
          ) : (
            <div className="mt-3 space-y-1.5">
              {totals.map(([currency, amount]) => (
                <div
                  key={currency}
                  className={`tabular font-semibold leading-none tracking-[-0.035em] text-mint-soft ${
                    currency === totals[0][0] ? 'text-[2rem]' : 'text-[1.1rem]'
                  }`}
                >
                  {fmtMoney(amount, currency as 'USDG' | 'ETH')}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#08090B] px-5 py-6">
          <div className="text-[9.5px] uppercase tracking-[0.2em] text-white/35">Open Claims</div>
          <div className="tabular mt-3 text-[2rem] font-semibold leading-none tracking-[-0.035em] text-white">
            {claimable.length}
          </div>
        </div>
        <div className="bg-[#08090B] px-5 py-6">
          <div className="text-[9.5px] uppercase tracking-[0.2em] text-white/35">Wallet</div>
          <div className="mt-3 text-[13px] font-medium text-white">
            {wallet.connected ? (
              <span className="font-mono">{wallet.displayAddress}</span>
            ) : (
              <span className="text-white/40">Not connected</span>
            )}
          </div>
        </div>
      </div>

      {!wallet.connected && (
        <div className="od-panel mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-5">
          <p className="text-[13px] text-white/60">
            Connect a wallet to see the refunds available to it.
          </p>
          <button
            type="button"
            onClick={wallet.connectWallet}
            className="rounded-xl bg-white px-5 py-2.5 text-[12.5px] font-semibold text-black transition-colors hover:bg-white/90"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* claimable */}
      <div className="mt-10">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Claimable
        </h2>

        <div className="mt-5 space-y-4">
          {claimable.length === 0 ? (
            <Panel>
              <EmptyState
                icon="refunds"
                title="No Refunds Available"
                body="You have no refunds waiting to be claimed."
              />
            </Panel>
          ) : (
            claimable.map((r, i) => (
              <motion.div
                key={r.poolId}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="od-panel rounded-2xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-6 px-5 py-5 md:px-6 md:py-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/app/pool/${r.poolId}`}
                        className="font-mono text-[11px] text-white/40 transition-colors hover:text-white"
                      >
                        POOL #{r.poolId}
                      </Link>
                      <span className="rounded-full border border-brand/45 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-azure-ice">
                        {r.status === 'CLAIMING' ? 'Claiming' : 'Refund Available'}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-9 gap-y-4">
                      <Field label="Contribution" value={fmtMoney(r.amount, r.currency)} />
                      <Field label="Tickets" value={String(ticketsOf(r.poolId))} />
                      <Field
                        label="Refund"
                        value={fmtMoney(r.amount, r.currency)}
                        tone="mint"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!wallet.connected) wallet.connectWallet();
                      else if (!wallet.correctNetwork) wallet.switchToRobinhood();
                      else claimRefund(r.poolId);
                    }}
                    disabled={r.status === 'CLAIMING'}
                    className="flex items-center gap-2.5 rounded-xl bg-white px-5 py-3 text-[12.5px] font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-70"
                  >
                    {r.status === 'CLAIMING' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {r.status === 'CLAIMING'
                      ? 'Claiming Refund...'
                      : !wallet.connected
                        ? 'Connect Wallet'
                        : !wallet.correctNetwork
                          ? 'Switch Network'
                          : 'Claim Refund'}
                  </button>
                </div>

                <div className="border-t border-white/[0.06] px-5 py-3.5 md:px-6">
                  <p className="text-[10.5px] text-white/30">
                    Network gas is paid by your wallet.
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Expired pools are archived here instead of appearing beside open entry cards. */}
      <div className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Expired Pool History</h2>
            <p className="mt-2 text-[12.5px] text-white/35">Pools that reached their deadline below capacity. No winner or protocol fee was recorded.</p>
          </div>
          <span className="text-[11.5px] text-white/25">{expiredPools.length} {expiredPools.length === 1 ? 'pool' : 'pools'}</span>
        </div>

        <Panel className="mt-5 overflow-hidden">
          {expiredPools.length === 0 ? (
            <EmptyState icon="refunds" title="No Expired Pools" body="Pools that close below capacity will be archived here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {['Pool', 'Prize', 'Tickets Sold', 'Your Tickets', 'Refund Status', ''].map((heading) => (
                      <th key={heading || 'action'} className="px-5 py-4 text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expiredPools.map((pool) => {
                    const refund = state.refunds[pool.id];
                    const status = refund?.status === 'CLAIMED'
                      ? 'Refunded'
                      : refund
                        ? 'Refund available'
                        : ticketsOf(pool.id) > 0
                          ? 'Checking refund'
                          : 'Not participated';
                    return (
                      <tr key={pool.id} className="border-b border-white/[0.04] last:border-b-0">
                        <td className="px-5 py-4 font-mono text-[12px] text-white/55">#{pool.id}</td>
                        <td className="tabular px-5 py-4 text-[12.5px] font-medium text-white">{fmtMoney(pool.prize, pool.currency)}</td>
                        <td className="tabular px-5 py-4 text-[12.5px] text-white/55">{pool.ticketsSold} / {pool.capacity}</td>
                        <td className="tabular px-5 py-4 text-[12.5px] text-white/55">{ticketsOf(pool.id)}</td>
                        <td className={`px-5 py-4 text-[10px] font-medium uppercase tracking-[0.14em] ${refund && refund.status !== 'CLAIMED' ? 'text-azure-ice' : refund?.status === 'CLAIMED' ? 'text-mint-soft' : 'text-white/35'}`}>{status}</td>
                        <td className="px-5 py-4 text-right">
                          <Link to={`/app/pool/${pool.id}`} className="inline-flex items-center gap-1.5 text-[11.5px] text-white/45 transition-colors hover:text-white">View <ArrowRight className="h-3.5 w-3.5" /></Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {/* history — deliberately retained after claiming */}
      <div className="mt-12">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Refund History
        </h2>

        <Panel className="mt-5 overflow-hidden">
          {history.length === 0 ? (
            <EmptyState
              icon="refunds"
              title="No Refunds Claimed Yet"
              body="Refunds you claim will be recorded here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {['Pool', 'Amount', 'Tickets', 'Status', 'Claimed'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-5 py-4 text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((r) => (
                    <tr
                      key={r.poolId}
                      className="border-b border-white/[0.04] last:border-b-0"
                    >
                      <td className="px-5 py-4 font-mono text-[12px] text-white/50">
                        #{r.poolId}
                      </td>
                      <td className="tabular px-5 py-4 text-[12.5px] font-medium text-white">
                        {fmtMoney(r.amount, currencyOf(r.poolId))}
                      </td>
                      <td className="tabular px-5 py-4 text-[12.5px] text-white/60">
                        {ticketsOf(r.poolId)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-mint-soft">
                          Refunded
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-white/40">
                        {r.claimedAt ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'mint';
}) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">{label}</div>
      <div
        className={`tabular mt-2 text-[13.5px] font-medium ${
          tone === 'mint' ? 'text-mint-soft' : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
