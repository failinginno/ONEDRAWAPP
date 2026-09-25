import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Binary, ExternalLink, ShieldCheck, TicketCheck } from 'lucide-react';
import { Eyebrow, SectionHeading } from './primitives';

const EXPLORER = 'https://robinhoodchain.blockscout.com';
const MANAGER = '0x8cb41dCCeA0ce11108f72b9ca6fd080DcE728096';

const PROOFS = [
  {
    icon: TicketCheck,
    title: 'Tickets are assigned onchain',
    text: 'Every sold ticket index points to its buyer wallet in the PoolManager contract. The operator cannot rewrite that ledger after purchase.',
  },
  {
    icon: ShieldCheck,
    title: 'Randomness is proof-verified',
    text: 'The OpenVRF Router verifies the pinned drand round onchain before its random word can reach the draw contract.',
  },
  {
    icon: Binary,
    title: 'Selection is deterministic',
    text: 'The contract computes one winning ticket from the verified random word. There is no manual choice, reroll button or recipient field.',
  },
];

export default function Transparency() {
  return (
    <section id="transparency" className="relative z-10 hairline-t">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <Eyebrow>Onchain transparency</Eyebrow>
            <SectionHeading className="mt-7 max-w-[15ch]">
              Transparent by design.
              <br />
              Verifiable onchain.
            </SectionHeading>
            <p className="mt-8 max-w-xl text-[15px] leading-[1.75] text-white/50">
              Ticket ownership, randomness delivery, winner selection and prize claims are recorded
              on Robinhood Chain, providing a complete and independently verifiable draw history.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/transparency"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-black"
              >
                See the full verification model
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`${EXPLORER}/address/${MANAGER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-[13px] text-white/70 hover:border-white/25 hover:text-white"
              >
                Inspect PoolManager <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="od-panel overflow-hidden rounded-[24px]"
          >
            <div className="border-b border-white/[0.07] px-6 py-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
                Exact selection rule
              </div>
              <code className="mt-5 block overflow-x-auto font-mono text-[15px] text-azure-ice md:text-[17px]">
                winningTicket = randomValue % pool.capacity
              </code>
              <code className="mt-3 block overflow-x-auto font-mono text-[15px] text-white/75 md:text-[17px]">
                winner = ticketOwners[winningTicket]
              </code>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {PROOFS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="grid gap-3 px-6 py-5 sm:grid-cols-[2rem_1fr]">
                  <Icon className="mt-0.5 h-4 w-4 text-azure-cyan" />
                  <div>
                    <h3 className="text-[13.5px] font-medium text-white/90">{title}</h3>
                    <p className="mt-2 text-[12px] leading-[1.7] text-white/40">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.07] bg-white/[0.015] px-6 py-4 text-[10.5px] leading-[1.65] text-white/30">
              Operator powers and limitations are disclosed in full. The blockchain—not this page—is
              the source of truth.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
