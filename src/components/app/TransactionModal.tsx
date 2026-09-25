import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2, X } from 'lucide-react';
import type { Pool } from '../../app/store';
import { fmtMoney } from '../../app/format';
import { chainConfig, configuredNetworkName } from '../../config/env';

export type ModalStage = 'confirm' | 'submitting' | 'confirmed';

export default function TransactionModal({
  open,
  stage,
  pool,
  qty,
  onConfirm,
  onClose,
}: {
  open: boolean;
  stage: ModalStage;
  pool: Pool;
  qty: number;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const total = qty * pool.ticketPrice;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={stage === 'submitting' ? undefined : onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="od-panel w-full max-w-md overflow-hidden rounded-2xl"
          >
            {stage === 'confirmed' ? (
              <div className="px-7 py-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-mint/40 bg-mint/[0.1]">
                  <Check className="h-4 w-4 text-mint-soft" />
                </div>
                <h3 className="mt-6 text-[17px] font-semibold text-white">Entry Confirmed</h3>
                <p className="mt-2.5 text-[13px] text-white/50">
                  {qty} {qty === 1 ? 'ticket' : 'tickets'} added.
                </p>
                <p className="mt-5 font-mono text-[10.5px] leading-[1.6] text-white/25">
                  {chainConfig.dataMode === 'onchain'
                    ? `Confirmed on ${configuredNetworkName}.`
                    : 'Demo transaction — no funds moved onchain.'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
                  <h3 className="text-[14.5px] font-semibold text-white">Confirm Entry</h3>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={stage === 'submitting'}
                    aria-label="Close"
                    className="text-white/35 transition-colors hover:text-white disabled:opacity-30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-6 py-5">
                  {[
                    ['Pool', `${fmtMoney(pool.prize, pool.currency)} · #${pool.id}`],
                    ['Tickets', String(qty)],
                    ['Total', fmtMoney(total, pool.currency)],
                  ].map(([k, v], i) => (
                    <div
                      key={k}
                      className={`flex items-center justify-between py-3.5 ${
                        i > 0 ? 'border-t border-white/[0.05]' : ''
                      }`}
                    >
                      <span className="text-[12.5px] text-white/45">{k}</span>
                      <span className="tabular text-[13.5px] font-medium text-white">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.07] px-6 py-5">
                  {stage === 'submitting' ? (
                    <div className="flex items-center justify-center gap-2.5 py-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-azure-cyan" />
                      <span className="text-[13px] text-white/70">
                        {chainConfig.dataMode === 'onchain' ? 'Confirm in wallet / waiting for chain...' : 'Submitting Entry...'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-white/[0.12] py-3 text-[13px] font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-white py-3 text-[13px] font-semibold text-black transition-colors hover:bg-white/90"
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
