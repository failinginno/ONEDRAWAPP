import { useRef } from 'react';
import { motion } from 'motion/react';
import { useInView } from '../hooks';
import { Eyebrow, SectionHeading } from './primitives';

const FIXED = [
  { k: 'A fixed prize', v: 'Every pool publishes its prize before it opens.' },
  { k: 'A fixed ticket price', v: 'One ticket always costs the same, for everyone.' },
  { k: 'A fixed number of tickets', v: 'Pool size is capped, so odds are knowable upfront.' },
  { k: 'A fixed time limit', v: 'The countdown starts with the first ticket purchased.' },
];

const ODDS = [
  { tickets: '1 Ticket', pct: 9.09, label: '9.09%' },
  { tickets: '3 Tickets', pct: 27.27, label: '27.27%' },
  { tickets: '7 Tickets', pct: 63.64, label: '63.64%' },
];

export default function WhatIs() {
  const oddsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(oddsRef, 0.4);

  return (
    <section id="about" className="relative z-10 hairline-t">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyebrow>What is ONEDRAW</Eyebrow>
          <SectionHeading className="mt-7 max-w-[18ch]">
            A simpler way
            <br />
            to join an onchain draw.
          </SectionHeading>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md text-[15px] leading-[1.7] text-white/55 md:text-base"
          >
            ONEDRAW turns prize draws into transparent smart-contract based pools. Nothing about a
            pool is decided in private — the rules are set when the pool opens, and the draw is
            settled onchain.
          </motion.p>

          <motion.dl
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pt-2"
          >
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">
              Every pool has
            </div>
            {FIXED.map((item) => (
              <div
                key={item.k}
                className="hairline-b grid gap-1.5 py-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8"
              >
                <dt className="text-[15px] font-medium text-white/90">{item.k}</dt>
                <dd className="text-[13.5px] leading-[1.6] text-white/45">{item.v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ----------------------------------------------
            Mechanics, stated in typography rather than cards
            ---------------------------------------------- */}
        <div className="mt-24 grid gap-12 lg:mt-32 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="tabular text-[2.6rem] font-semibold leading-none tracking-[-0.04em] md:text-[3.4rem]">
                1 USDG
              </span>
              <span className="text-[1.6rem] font-light leading-none text-white/25 md:text-[2rem]">
                =
              </span>
              <span className="tabular text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-azure-ice md:text-[3.4rem]">
                1 Ticket
              </span>
            </div>
            <p className="mt-6 max-w-sm text-[13.5px] leading-[1.65] text-white/45">
              Ticket price is fixed and identical for every participant. A wallet can purchase
              multiple tickets in the same pool.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pt-1"
          >
            <div className="text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[2.6rem]">
              More tickets
              <br />
              <span className="text-white/25">=</span>{' '}
              <span className="text-mint-soft">higher odds</span>
            </div>
            <p className="mt-6 max-w-sm text-[13.5px] leading-[1.65] text-white/45">
              Your chance of winning is proportional to the share of tickets you hold. The more of a
              fixed pool you own, the larger your share of the draw.
            </p>
          </motion.div>
        </div>

        {/* ----------------------------------------------
            Probability example
            ---------------------------------------------- */}
        <div ref={oddsRef} className="mt-24 lg:mt-32">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">
              Probability example
            </div>
            <div className="text-[11px] text-white/35">Based on an 11-ticket pool</div>
          </div>

          <div className="mt-10 space-y-9">
            {ODDS.map((row, i) => (
              <div key={row.tickets} className="grid items-center gap-5 md:grid-cols-[10rem_1fr_8rem] md:gap-8">
                <div className="text-sm font-medium text-white/80">{row.tickets}</div>

                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: row.pct / 100 } : { scaleX: 0 }}
                    transition={{ duration: 1.3, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full origin-left rounded-full"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #0B2551 0%, #3D81E3 55%, #00d2ff 100%)',
                      boxShadow: '0 0 14px rgba(0,210,255,0.45)',
                    }}
                  />
                </div>

                <div className="tabular text-2xl font-semibold tracking-[-0.03em] text-white md:text-right md:text-[2rem]">
                  {row.label}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-[13px] leading-[1.65] text-white/35">
            If a pool contains 11 tickets, one ticket represents a 1/11 share of the draw. Probability
            is proportional to tickets held, not to the order in which they are purchased.
          </p>
        </div>
      </div>
    </section>
  );
}
