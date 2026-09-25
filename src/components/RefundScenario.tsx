import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useCycle, useInView } from '../hooks';
import { Eyebrow, Pill, SectionHeading } from './primitives';

const TOTAL = 11;

const PHASES = [
  { filled: 3, time: '01:24', status: 'LIVE', state: 'live' },
  { filled: 5, time: '00:41', status: 'LIVE', state: 'live' },
  { filled: 7, time: '00:12', status: 'LIVE', state: 'live' },
  { filled: 7, time: '00:00', status: 'POOL EXPIRED', state: 'expired' },
  { filled: 7, time: '00:00', status: 'REFUND AVAILABLE', state: 'refund' },
] as const;

const CONTRIBUTIONS = [
  { user: 'User A', wallet: '0x4c1...8Ae2', amount: '3 USDG', tickets: 3 },
  { user: 'User B', wallet: '0x91b...2Df7', amount: '2 USDG', tickets: 2 },
  { user: 'User C', wallet: '0x7F3...91C2', amount: '2 USDG', tickets: 2 },
];

export default function RefundScenario() {
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, 0.3);
  const step = useCycle(PHASES.length, 1700, inView);

  const phase = PHASES[step];
  const refundable = phase.state === 'refund';
  const pct = (phase.filled / TOTAL) * 100;

  return (
    <section className="relative z-10 hairline-t">
      <div className="mx-auto grid max-w-shell gap-14 px-6 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20 lg:px-10 lg:py-36">
        {/* copy */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <Eyebrow>Refund protection</Eyebrow>
          <SectionHeading className="mt-7 max-w-[15ch]">
            Not filled?
            <br />
            Your funds stay yours.
          </SectionHeading>

          <p className="mt-8 max-w-md text-[15px] leading-[1.7] text-white/55">
            A pool only completes if every ticket sells before the time limit. If the countdown
            reaches zero with tickets still unsold, the pool expires instead: no winner is selected
            and no protocol fee is collected.
          </p>

          <ul className="mt-10 max-w-md">
            {[
              'No winner is selected',
              'No protocol fee is collected',
              'Every participant can claim back the full USDG they contributed',
            ].map((line) => (
              <li
                key={line}
                className="hairline-b flex items-start gap-3.5 py-4 text-[13.5px] leading-[1.6] text-white/70"
              >
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-mint-soft" />
                {line}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-md text-[12.5px] leading-[1.65] text-white/35">
            Refund transactions are claimed by users. Transaction gas is paid by the claiming wallet.
          </p>
        </motion.div>

        {/* panel */}
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="od-panel self-start rounded-[28px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-7 md:px-9 md:py-8">
            <div className="flex items-center gap-3">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  refundable
                    ? 'bg-mint-soft'
                    : phase.state === 'expired'
                      ? 'bg-white/40'
                      : 'bg-azure-cyan animate-pulse-dot'
                }`}
              />
              <div className="h-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phase.status}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className={`block text-[10px] font-medium uppercase tracking-[0.22em] ${
                      refundable ? 'text-mint-soft' : 'text-white/45'
                    }`}
                  >
                    {phase.status}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <Pill tone={refundable ? 'mint' : 'neutral'}>No fee collected</Pill>
          </div>

          <div className="hairline-t px-6 py-8 md:px-9 md:py-9">
            <div className="flex items-end justify-between">
              <div>
                <div className="tabular text-3xl font-semibold tracking-[-0.03em] text-white">
                  {phase.filled} / {TOTAL}
                </div>
                <div className="mt-1.5 text-[9.5px] uppercase tracking-[0.2em] text-white/30">
                  Tickets sold
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`tabular text-3xl font-semibold tracking-[-0.03em] ${
                    phase.time === '00:00' ? 'text-white/45' : 'text-white'
                  }`}
                >
                  {phase.time}
                </div>
                <div className="mt-1.5 text-[9.5px] uppercase tracking-[0.2em] text-white/30">
                  Remaining
                </div>
              </div>
            </div>

            <div className="relative mt-7 h-[5px] w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{
                  backgroundImage: refundable
                    ? 'linear-gradient(to right, #2F9E75 0%, #6FD3A8 100%)'
                    : 'linear-gradient(to right, #0B2551 0%, #3D81E3 55%, #00d2ff 100%)',
                  boxShadow: refundable
                    ? '0 0 16px rgba(111,211,168,0.5)'
                    : '0 0 16px rgba(0,210,255,0.4)',
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-white/30">
              <span className="tabular">Tickets unsold: {TOTAL - phase.filled}</span>
              <span>Draw not executed</span>
            </div>
          </div>

          {/* refund ledger */}
          <div className="hairline-t px-6 py-7 md:px-9 md:py-8">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/35">
                Claimable by participant
              </span>
              <span
                className={`text-[9.5px] font-medium uppercase tracking-[0.22em] transition-colors duration-500 ${
                  refundable ? 'text-mint-soft' : 'text-white/20'
                }`}
              >
                Refund available
              </span>
            </div>

            <div className="mt-5">
              {CONTRIBUTIONS.map((row, i) => (
                <div
                  key={row.user}
                  className="hairline-b flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="text-[13.5px] font-medium text-white/85">{row.user}</span>
                    <span className="hidden truncate font-mono text-[11px] text-white/30 sm:inline">
                      {row.wallet}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="tabular text-[13.5px] text-white/50">
                      {row.tickets} {row.tickets === 1 ? 'ticket' : 'tickets'}
                    </span>
                    <motion.span
                      animate={{
                        opacity: refundable ? 1 : 0.25,
                        color: refundable ? '#6FD3A8' : 'rgba(255,255,255,0.35)',
                      }}
                      transition={{ duration: 0.5, delay: refundable ? i * 0.12 : 0 }}
                      className="tabular w-20 text-right text-[15px] font-semibold"
                    >
                      {row.amount}
                    </motion.span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 h-4">
              <AnimatePresence>
                {refundable && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[11.5px] text-white/40">
                      Total refundable across participants
                    </span>
                    <span className="tabular text-[13.5px] font-semibold text-mint-soft">
                      7 USDG
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
