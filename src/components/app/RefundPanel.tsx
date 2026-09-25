import { Loader2 } from 'lucide-react';
import type { Pool } from '../../app/store';
import { soldCount, useDemo } from '../../app/store';
import { fmtMoney } from '../../app/format';
import StatusBadge from './StatusBadge';
import { useWallet } from '../../providers/wallet/WalletProvider';
import { configuredNetworkName } from '../../config/env';

/**
 * Expired pool + refund claim.
 *
 * The refund record is never removed, and its status moves AVAILABLE →
 * CLAIMING → CLAIMED so the history stays auditable in the UI.
 */
export default function RefundPanel({ pool }: { pool: Pool }) {
  const { state, claimRefund } = useDemo();
  const wallet = useWallet();

  const sold = soldCount(state, pool.id);
  const owned = state.holdings[pool.id] ?? [];
  const refund = state.refunds[pool.id];
  const contribution = owned.length * pool.ticketPrice;
  const connected = wallet.connected;

  const status =
    refund?.status === 'CLAIMED' ? 'REFUNDED' : refund ? 'REFUND AVAILABLE' : 'NO REFUND DUE';

  return (
    <div className="od-panel rounded-2xl">
      <div className="border-b border-white/[0.07] px-5 py-5 md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
          <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/45">
            Pool expired
          </span>
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">
          Pool Did Not Fill
        </h2>
        <p className="mt-3 max-w-lg text-[13px] leading-[1.65] text-white/45">
          This pool did not reach its required ticket capacity before the timer expired. No winner
          was selected. Refunds are now available.
        </p>
      </div>

      {/* outcome */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.07]">
        {[
          { v: `${sold} / ${pool.capacity}`, l: 'Tickets sold' },
          { v: '00:00', l: 'Timer' },
          { v: '—', l: 'Winner' },
        ].map((s) => (
          <div key={s.l} className="px-5 py-5">
            <div className="tabular text-lg font-semibold tracking-[-0.02em] text-white">{s.v}</div>
            <div className="mt-2 text-[9px] uppercase tracking-[0.18em] text-white/30">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="px-5 py-6 md:px-6">
        {!connected ? (
          <>
            <p className="text-[13.5px] font-medium text-white">Connect Wallet to Claim</p>
            <p className="mt-2.5 text-[12px] leading-[1.6] text-white/40">
              Connect the wallet that contributed to this pool to see and claim its refund.
            </p>
            <button
              type="button"
              onClick={wallet.connectWallet}
              className="mt-5 w-full rounded-xl bg-white py-3 text-[13px] font-semibold text-black transition-colors hover:bg-white/90"
            >
              Connect Wallet
            </button>
          </>
        ) : !wallet.correctNetwork ? (
          <>
            <p className="text-[13.5px] font-medium text-white">Switch Network</p>
            <p className="mt-2.5 text-[12px] leading-[1.6] text-white/40">
              Switch to {configuredNetworkName} before using the refund flow.
            </p>
            <button type="button" onClick={wallet.switchToRobinhood} className="mt-5 w-full rounded-xl bg-white py-3 text-[13px] font-semibold text-black transition-colors hover:bg-white/90">
              Switch to {configuredNetworkName}
            </button>
          </>
        ) : owned.length === 0 ? (
          <p className="text-[13px] leading-[1.65] text-white/40">
            This wallet did not purchase tickets in pool #{pool.id}, so there is nothing to claim.
          </p>
        ) : (
          <>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-white/45">Your Contribution</span>
                <span className="tabular text-[13.5px] font-medium text-white">
                  {fmtMoney(contribution, pool.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-white/45">Your Tickets</span>
                <span className="tabular text-[13.5px] text-white/70">{owned.length}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5">
                <span className="text-[12.5px] text-white/45">Refund Available</span>
                <span className="tabular text-[15px] font-semibold text-mint-soft">
                  {fmtMoney(contribution, pool.currency)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/35">
                  Refund status
                </span>
                <span
                  className={`text-[9.5px] font-medium uppercase tracking-[0.18em] ${
                    refund?.status === 'CLAIMED' ? 'text-mint-soft' : 'text-azure-ice'
                  }`}
                >
                  {status}
                </span>
              </div>

              {refund?.status === 'CLAIMED' ? (
                <div className="mt-4 rounded-xl border border-mint/25 bg-mint/[0.05] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-white/70">Refund Claimed</span>
                    <span className="tabular text-[13.5px] font-semibold text-mint-soft">
                      {fmtMoney(refund.amount, refund.currency)}
                    </span>
                  </div>
                  {refund.claimedAt && (
                    <div className="mt-2 font-mono text-[10.5px] text-white/30">
                      {refund.claimedAt}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled={refund?.status === 'CLAIMING'}
                  onClick={() => claimRefund(pool.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-white py-3.5 text-[13.5px] font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-70"
                >
                  {refund?.status === 'CLAIMING' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Claiming Refund...
                    </>
                  ) : (
                    'Claim Refund'
                  )}
                </button>
              )}

              <p className="mt-3.5 text-center text-[10.5px] text-white/30">
                Network gas is paid by your wallet.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="border-t border-white/[0.07] px-5 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/35">Pool status</span>
          <StatusBadge status={refund?.status === 'CLAIMED' ? 'EXPIRED' : 'REFUNDABLE'} size="sm" />
        </div>
      </div>
    </div>
  );
}
