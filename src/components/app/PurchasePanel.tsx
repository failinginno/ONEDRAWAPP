import { useEffect, useRef, useState } from 'react';
import { Wallet } from 'lucide-react';
import type { Pool } from '../../app/store';
import { displayStatus, soldCount, useDemo } from '../../app/store';
import { fmtMoney } from '../../app/format';
import StatusBadge from './StatusBadge';
import TicketSelector from './TicketSelector';
import OddsDisplay from './OddsDisplay';
import TicketChip from './TicketChip';
import TransactionModal from './TransactionModal';
import type { ModalStage } from './TransactionModal';
import { useWallet } from '../../providers/wallet/WalletProvider';
import { chainConfig, configuredNetworkName } from '../../config/env';

export default function PurchasePanel({ pool }: { pool: Pool }) {
  const { state, buyTickets } = useDemo();
  const wallet = useWallet();
  const [qty, setQty] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [stage, setStage] = useState<ModalStage>('confirm');
  const timers = useRef<number[]>([]);

  const sold = soldCount(state, pool.id);
  const owned = state.holdings[pool.id] ?? [];
  const remaining = Math.max(0, pool.capacity - sold);
  const status = displayStatus(state, pool);
  const connected = wallet.connected;

  const drawing = status === 'DRAWING' || status === 'SOLD_OUT';
  const closed = status === 'COMPLETED' || status === 'EXPIRED' || status === 'REFUNDABLE';
  const canBuy = connected && wallet.correctNetwork && !drawing && !closed && remaining > 0;

  // keep the quantity inside what is actually still available
  useEffect(() => {
    setQty((q) => Math.max(1, Math.min(q, Math.max(1, remaining))));
  }, [remaining]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  const total = qty * pool.ticketPrice;
  const after = owned.length + qty;

  const handleConfirm = async () => {
    setStage('submitting');
    try {
      await buyTickets(pool.id, qty);
      setStage('confirmed');
    } catch {
      setModalOpen(false);
      setStage('confirm');
    }
  };

  return (
    <>
      <div className="od-panel rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <h2 className="text-[14px] font-semibold text-white">Buy Tickets</h2>
          <StatusBadge status={status} size="sm" />
        </div>

        <div className="px-5 py-5">
          {/* ticket price */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white/45">Ticket Price</span>
            <span className="tabular text-[14px] font-semibold text-white">
              {fmtMoney(pool.ticketPrice, pool.currency)}
            </span>
          </div>

          <div className="mt-5 h-px w-full bg-white/[0.06]" />

          {!connected ? (
            /* ---------------- wallet required ---------------- */
            <div className="pt-5">
              <p className="text-[13.5px] font-medium text-white">Connect Wallet to Enter</p>
              <p className="mt-2.5 text-[12px] leading-[1.6] text-white/40">
                You can browse pools, review the rules, participants and past results without a
                wallet. Purchasing tickets requires a connection.
              </p>
              <button
                type="button"
                onClick={wallet.connectWallet}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[13px] font-semibold text-black transition-colors hover:bg-white/90"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            </div>
          ) : !wallet.correctNetwork ? (
            <div className="pt-5">
              <p className="text-[13.5px] font-medium text-white">Switch Network</p>
              <p className="mt-2.5 text-[12px] leading-[1.6] text-white/40">
                Entry is enabled after your wallet switches to {configuredNetworkName}.
              </p>
              <button type="button" onClick={wallet.switchToRobinhood} className="mt-5 w-full rounded-xl bg-white py-3 text-[13px] font-semibold text-black transition-colors hover:bg-white/90">
                Switch to {configuredNetworkName}
              </button>
            </div>
          ) : !canBuy ? (
            /* ---------------- not purchasable ---------------- */
            <div className="pt-5">
              <p className="text-[13.5px] font-medium text-white">
                {remaining === 0 && !closed ? 'Sold out' : 'Entry closed'}
              </p>
              <p className="mt-2.5 text-[12px] leading-[1.6] text-white/40">
                {drawing
                  ? 'All tickets are sold. Ticket sales have stopped and the draw is being executed.'
                  : remaining === 0
                    ? 'Every ticket in this pool has been purchased.'
                    : 'This pool is no longer accepting entries.'}
              </p>
            </div>
          ) : (
            /* ---------------- purchasing ---------------- */
            <div className="pt-5">
              <TicketSelector qty={qty} onChange={setQty} max={Math.max(1, remaining)} />

              <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                <div className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35">
                  Your Purchase
                </div>

                <div className="mt-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-white/45">Tickets</span>
                    <span className="tabular text-[13px] font-medium text-white">
                      {qty} {qty === 1 ? 'Ticket' : 'Tickets'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-white/45">Cost</span>
                    <span className="tabular text-[13px] font-medium text-white">
                      {fmtMoney(total, pool.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-white/45">Your current tickets</span>
                    <span className="tabular text-[13px] text-white/70">{owned.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] text-white/45">Tickets after purchase</span>
                    <span className="tabular text-[13px] font-semibold text-white">{after}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <OddsDisplay current={owned.length} next={after} capacity={pool.capacity} />
              </div>

              {owned.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
                  {owned.map((n) => (
                    <TicketChip key={n} number={n} variant="own" size="sm" />
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setStage('confirm');
                  setModalOpen(true);
                }}
                className="mt-6 w-full rounded-xl bg-white py-3.5 text-[13.5px] font-semibold text-black transition-colors hover:bg-white/90"
              >
                Buy {qty} {qty === 1 ? 'Ticket' : 'Tickets'}
              </button>

              <p className="mt-4 text-[10.5px] leading-[1.6] text-white/25">
                {chainConfig.dataMode === 'onchain'
                  ? `Real ${configuredNetworkName} transaction. USDG approval is limited to this purchase.`
                  : 'Demo environment — no contract call is made and no funds move.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <TransactionModal
        open={modalOpen}
        stage={stage}
        pool={pool}
        qty={qty}
        onConfirm={handleConfirm}
        onClose={() => {
          if (stage === 'submitting') return;
          setModalOpen(false);
          setStage('confirm');
        }}
      />
    </>
  );
}
