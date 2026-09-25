import { motion } from 'motion/react';
import type { Pool } from '../../app/store';
import { fmtTicket } from '../../app/format';

const MAX_SHOWN = 24;

/**
 * Simulated draw. Deliberately restrained: the ticket numbers simply settle,
 * one of them resolves, and nothing spins, rattles or celebrates.
 */
export default function DrawAnimation({ pool }: { pool: Pool }) {
  const phase = pool.drawPhase;
  const revealed = phase === 'REVEALED' || phase === 'DONE';
  const winner = pool.winningTicket ?? 8;

  const all = Array.from({ length: pool.capacity }, (_, i) => i + 1);
  const shown = all.slice(0, Math.min(all.length, MAX_SHOWN));

  const heading =
    phase === 'VERIFYING'
      ? 'Verifying random result'
      : revealed
        ? 'Winning ticket'
        : 'Selecting a ticket';

  const body =
    phase === 'VERIFYING'
      ? 'The result is being confirmed before the prize is settled.'
      : revealed
        ? 'One of the valid tickets in this pool has been selected.'
        : `Sales have stopped. One of the ${pool.capacity} valid tickets is being selected.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="od-panel rounded-2xl"
    >
      <div className="border-b border-white/[0.07] px-5 py-5 md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-azure-cyan animate-pulse-dot" />
          <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-azure-ice">
            {phase === 'VERIFYING' ? 'Verifying' : revealed ? 'Result' : 'Drawing'}
          </span>
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">
          {heading}
        </h2>
        <p className="mt-3 max-w-lg text-[13px] leading-[1.65] text-white/45">{body}</p>
      </div>

      {/* ticket field */}
      <div className="px-5 py-7 md:px-6 md:py-8">
        <div className="flex flex-wrap gap-2">
          {shown.map((n, i) => {
            const isWinner = revealed && n === winner;
            const dimmed = revealed && !isWinner;

            return (
              <motion.span
                key={n}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: dimmed ? 0.25 : 1,
                  scale: isWinner ? 1.06 : 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: revealed ? 0 : i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`tabular flex h-11 min-w-[3.1rem] items-center justify-center rounded-lg border px-2 font-mono text-[13px] ${
                  isWinner
                    ? 'border-azure-cyan/70 bg-azure-cyan/[0.14] text-white shadow-[0_0_24px_rgba(0,210,255,0.4)]'
                    : 'border-white/[0.09] bg-white/[0.02] text-white/55'
                }`}
              >
                {fmtTicket(n)}
              </motion.span>
            );
          })}
        </div>

        {all.length > shown.length && (
          <p className="mt-4 font-mono text-[10.5px] text-white/25">
            Showing {shown.length} of {all.length} tickets
          </p>
        )}
      </div>

      {/* reveal footer */}
      <div className="border-t border-white/[0.07] px-5 py-5 md:px-6">
        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <div className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/35">
                Winning ticket
              </div>
              <div className="tabular mt-2.5 text-[1.8rem] font-semibold leading-none tracking-[-0.03em] text-azure-ice">
                {fmtTicket(winner)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/35">
                Winner
              </div>
              <div className="mt-2.5 font-mono text-[13px] text-white">
                {pool.winner ?? '—'}
              </div>
            </div>
          </motion.div>
        ) : (
          <p className="font-mono text-[11px] text-white/35">
            {phase === 'VERIFYING' ? 'VERIFYING RANDOM RESULT' : 'DRAWING…'}
          </p>
        )}
      </div>
    </motion.div>
  );
}
