import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useCycle, useInView } from '../hooks';
import { Eyebrow, Pill, SectionHeading, StatCell } from './primitives';

const TOTAL = 11;

const STEP_PHASES = [
  { filled: 1, time: '02:48', status: 'LIVE', note: 'First ticket purchased — timer running' },
  { filled: 4, time: '02:11', status: 'LIVE', note: 'More tickets enter the pool' },
  { filled: 8, time: '01:06', status: 'LIVE', note: 'Pool filling toward 11 / 11' },
  { filled: 11, time: '00:37', status: 'SOLD OUT', note: '11 / 11 filled — sales stop immediately' },
  { filled: 11, time: '00:37', status: 'DRAWING', note: 'One of the 11 valid tickets is selected' },
  { filled: 11, time: '00:37', status: 'WINNER', note: 'Winning ticket #08 settles onchain' },
] as const;

const TIMELINE = [
  'First ticket purchased',
  '03:00 timer starts',
  'More tickets enter',
  '11 / 11 filled',
  'Draw',
  'One winner',
];

export default function DrawExample() {
  const shellRef = useRef<HTMLDivElement>(null);
  const inView = useInView(shellRef, 0.25);
  const step = useCycle(STEP_PHASES.length, 1500, inView);

  const phase = STEP_PHASES[step];
  const isWinner = phase.status === 'WINNER';
  const isDrawing = phase.status === 'DRAWING';
  const pct = (phase.filled / TOTAL) * 100;

  return (
    <section id="protocol" className="relative z-10 hairline-t">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyebrow>The draw, end to end</Eyebrow>
          <SectionHeading className="mt-7 max-w-[16ch]">
            A draw,
            <br />
            explained in seconds.
          </SectionHeading>
        </motion.div>

        {/* ----------------------------------------------
            Pool specification
            ---------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="od-panel mt-16 rounded-[28px]"
        >
          <div className="grid grid-cols-2 divide-x divide-white/[0.07] md:grid-cols-4">
            <StatCell value="10 USDG" label="Prize" />
            <StatCell value="1 USDG" label="Per Ticket" />
            <StatCell value={TOTAL} label="Total Tickets" />
            <StatCell value="03:00" label="Time Limit" />
          </div>

          {/* live sequence */}
          <div ref={shellRef} className="hairline-t px-6 py-8 md:px-9 md:py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isWinner
                      ? 'bg-mint-soft'
                      : isDrawing
                        ? 'bg-azure-cyan animate-pulse-dot'
                        : 'bg-azure-cyan animate-pulse-dot'
                  }`}
                />
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
                  {phase.status}
                </span>
              </div>

              <div className="flex items-center gap-6 md:gap-9">
                <div className="text-right">
                  <div className="tabular text-lg font-semibold tracking-[-0.02em] text-white">
                    {String(phase.filled).padStart(2, '0')} / {TOTAL}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/30">
                    Tickets
                  </div>
                </div>
                <div className="text-right">
                  <div className="tabular text-lg font-semibold tracking-[-0.02em] text-white">
                    {phase.time}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/30">
                    Remaining
                  </div>
                </div>
              </div>
            </div>

            {/* progress */}
            <div className="relative mt-6 h-[5px] w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{
                  backgroundImage: isWinner
                    ? 'linear-gradient(to right, #2F9E75 0%, #6FD3A8 100%)'
                    : 'linear-gradient(to right, #0B2551 0%, #3D81E3 55%, #00d2ff 100%)',
                  boxShadow: isWinner
                    ? '0 0 16px rgba(111,211,168,0.55)'
                    : '0 0 16px rgba(0,210,255,0.45)',
                }}
              />
              {isDrawing && (
                <div className="pointer-events-none absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-sweep" />
              )}
            </div>

            {/* ticket strip — 11 valid tickets, one resolves */}
            <div className="mt-8 flex items-end gap-[3px] md:gap-1.5">
              {Array.from({ length: TOTAL }, (_, i) => {
                const idx = i + 1;
                const filled = idx <= phase.filled;
                const winner = isWinner && idx === 8;

                return (
                  <div key={idx} className="flex-1">
                    <motion.div
                      animate={{
                        backgroundColor: winner
                          ? 'rgba(0,210,255,0.95)'
                          : filled
                            ? 'rgba(164,244,253,0.3)'
                            : 'rgba(255,255,255,0.06)',
                        scaleY: winner ? 1 : 0.62,
                      }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="h-9 w-full origin-bottom rounded-[2px] md:h-11"
                      style={winner ? { boxShadow: '0 0 20px rgba(0,210,255,0.8)' } : undefined}
                    />
                    <div
                      className={`tabular mt-2 text-center text-[9px] ${
                        winner ? 'font-semibold text-azure-ice' : 'text-white/20'
                      }`}
                    >
                      {String(idx).padStart(2, '0')}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 h-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phase.note}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className={`font-mono text-[11.5px] ${
                    isWinner ? 'text-mint-soft' : isDrawing ? 'text-azure-ice' : 'text-white/40'
                  }`}
                >
                  {isWinner ? 'WINNING TICKET #08' : phase.note}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* ----------------------------------------------
              Timeline
              ---------------------------------------------- */}
          <div className="hairline-t px-6 py-10 md:px-9 md:py-12">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6 md:gap-x-0">
              {TIMELINE.map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="md:px-5 md:first:pl-0 md:last:pr-0"
                >
                  <div className="hidden h-px w-full bg-white/10 md:block" />
                  <div className="flex items-start gap-3 md:mt-5">
                    <span
                      className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: i >= 4 ? '#00d2ff' : 'rgba(255,255,255,0.35)',
                        boxShadow: i >= 4 ? '0 0 8px rgba(0,210,255,0.85)' : 'none',
                      }}
                    />
                    <div>
                      <div className="tabular text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/30">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="mt-2 text-[12.5px] font-medium uppercase leading-[1.4] tracking-[0.04em] text-white/85">
                        {label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------
              Settlement split
              ---------------------------------------------- */}
          <div className="hairline-t grid gap-px bg-white/[0.07] md:grid-cols-2">
            <div className="bg-[#08090B]/80 px-6 py-8 md:px-9 md:py-10">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="tabular text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
                  10 USDG
                </span>
                <span className="text-xl font-light text-white/25">→</span>
                <span className="text-2xl font-semibold tracking-[-0.03em] text-mint-soft md:text-3xl">
                  Winner
                </span>
              </div>
              <p className="mt-5 text-[13px] leading-[1.65] text-white/45">
                The winning wallet receives the full prize, settled onchain in the same transaction
                that concludes the draw.
              </p>
            </div>

            <div className="bg-[#08090B]/80 px-6 py-8 md:px-9 md:py-10">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="tabular text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
                  1 USDG
                </span>
                <span className="text-xl font-light text-white/25">→</span>
                <span className="text-2xl font-semibold tracking-[-0.03em] text-white/60 md:text-3xl">
                  Protocol Fee
                </span>
              </div>
              <p className="mt-5 text-[13px] leading-[1.65] text-white/45">
                On an 11-ticket pool, 1 USDG covers the protocol fee. The fee is only collected when a
                pool completes with a winner.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center gap-3 text-[13px] leading-[1.6] text-white/40"
        >
          <Pill tone="cyan">Early fill</Pill>
          If the pool reaches 11 / 11 before the timer expires, ticket sales stop and the draw starts
          immediately — it does not wait for the countdown.
        </motion.p>
      </div>
    </section>
  );
}
