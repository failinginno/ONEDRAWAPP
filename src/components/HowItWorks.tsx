import { motion } from 'motion/react';
import { Eyebrow, SectionHeading } from './primitives';

const STEPS = [
  {
    n: '01',
    title: 'Connect Wallet',
    body: 'Connect a compatible wallet to Robinhood Chain.',
  },
  {
    n: '02',
    title: 'Choose a Pool',
    body: 'Choose a prize pool and view its rules — prize, ticket price, pool size and time limit are all published before you buy.',
  },
  {
    n: '03',
    title: 'Buy Tickets',
    body: '1 USDG gives you one ticket. Buy multiple tickets to increase your odds, since your chance is proportional to the share of the pool you hold.',
  },
  {
    n: '04',
    title: 'Pool Fills or Expires',
    body: 'If every ticket sells before the deadline, ticket sales stop and the draw starts. If the pool does not fill, refunds become available instead.',
  },
  {
    n: '05',
    title: 'Winner Selected',
    body: 'One valid ticket is randomly selected. The prize is settled onchain to the winning wallet.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 hairline-t">
      <div className="mx-auto grid max-w-shell gap-14 px-6 py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24 lg:px-10 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <Eyebrow>How it works</Eyebrow>
          <SectionHeading className="mt-7">
            From wallet
            <br />
            to draw.
          </SectionHeading>
          <p className="mt-8 max-w-sm text-[15px] leading-[1.7] text-white/50">
            Five steps, no hidden conditions. The rules of a pool are visible before you participate,
            and the outcome is settled onchain.
          </p>
        </motion.div>

        <div>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.75, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="hairline-b grid gap-4 py-10 first:pt-0 sm:grid-cols-[5.5rem_1fr] sm:gap-8 lg:py-14"
            >
              <div className="tabular text-[1.5rem] font-semibold leading-none tracking-[-0.02em] text-white/18 lg:text-[1.9rem]">
                {step.n}
              </div>
              <div>
                <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-white lg:text-[1.6rem]">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-lg text-[14px] leading-[1.7] text-white/45">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
