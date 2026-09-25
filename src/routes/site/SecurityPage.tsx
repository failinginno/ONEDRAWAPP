import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Eye,
  FlaskConical,
  Link2,
  Radio,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import SitePage from '../../components/SitePage';
import { Eyebrow, SectionHeading } from '../../components/primitives';

const GUARANTEES = [
  {
    n: '01',
    icon: Boxes,
    title: 'Transparent Architecture',
    lead:
      'Every pool is a bounded object with published parameters. What you read before you buy is what executes after you buy.',
    points: [
      'Prize, ticket price, capacity and timer are fixed at creation and immutable afterwards.',
      'Pool state is readable directly from the contract, not reconstructed from a database.',
      'No administrative path exists to extend a timer or expand capacity once tickets are sold.',
    ],
  },
  {
    n: '02',
    icon: Link2,
    title: 'Onchain Settlement',
    lead:
      'Selection and payout are part of the same settled flow — the result is never decided offchain and reconciled later.',
    points: [
      'Funds are held by the pool contract, not by an operator account.',
      'The prize is credited as part of settlement; there is no manual withdrawal step.',
      'Settlement records the winning ticket and winning wallet in the same transaction.',
    ],
  },
  {
    n: '03',
    icon: Radio,
    title: 'Random Draw Process',
    lead:
      'The only unpredictable input in ONEDRAW arrives with proof attached, and the draw cannot proceed without it.',
    points: [
      'A filled pool requests randomness and waits for a validated response.',
      'The returned value maps onto exactly one issued ticket number.',
      'There are no second prizes, no partial settlements and no re-rolls.',
    ],
  },
  {
    n: '04',
    icon: RefreshCw,
    title: 'Refund Protection',
    lead:
      'An unfilled pool is a non-event: no winner, no fee, and every participant can reclaim what they contributed.',
    points: [
      'No protocol fee is taken when a pool expires without filling.',
      'Refund eligibility derives from ticket ownership, which is recorded onchain.',
      'Claims are submitted by the participant’s own wallet — nobody can trigger them for you.',
    ],
  },
  {
    n: '05',
    icon: Eye,
    title: 'Public Verification',
    lead:
      'Every stage of a draw can be checked independently of this website, using nothing but a block explorer.',
    points: [
      'Pool creation, ticket purchases and draw requests are public events.',
      'Results do not depend on our interface being online or honest.',
      'Anyone can recompute what the pool should have done and compare it to what it did.',
    ],
  },
];

export default function SecurityPage() {
  return (
    <SitePage>
      {/* header */}
      <section className="mx-auto max-w-shell px-6 pb-16 pt-20 lg:px-10 lg:pb-24 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Eyebrow>Security</Eyebrow>
          <SectionHeading as="h1" className="mt-7">
            Five guarantees,
            <br />
            one principle.
          </SectionHeading>
          <p className="mt-8 text-[15px] leading-[1.8] text-white/50 md:text-[16px]">
            Security in ONEDRAW is structural. Rather than asking participants to extend trust to an
            operator, the protocol removes the places where trust would be required — custody,
            discretion over outcomes, and offchain accounting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
            <BadgeCheck className="h-3.5 w-3.5 text-white/45" />
            Non-custodial
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
            <Link2 className="h-3.5 w-3.5 text-white/45" />
            Onchain settlement
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
            <Eye className="h-3.5 w-3.5 text-white/45" />
            Publicly verifiable
          </span>
        </motion.div>
      </section>

      {/* guarantees */}
      <section className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="hairline-t">
          {GUARANTEES.map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.75, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="hairline-b grid gap-8 py-14 lg:grid-cols-[minmax(0,5rem)_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-16"
            >
              <div className="flex items-center gap-4 lg:block">
                <span className="tabular text-[1.5rem] font-semibold leading-none tracking-[-0.02em] text-white/20 lg:text-[1.9rem]">
                  {item.n}
                </span>
                <item.icon className="h-4 w-4 text-azure-cyan/60 lg:mt-5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-white lg:text-[1.75rem]">
                  {item.title}
                </h2>
                <p className="mt-4 max-w-sm text-[14px] leading-[1.75] text-white/45">{item.lead}</p>
              </div>

              <ul className="space-y-3">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[13.5px] leading-[1.8] text-white/45">
                    <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-azure-cyan/70" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* status */}
      <section className="mx-auto max-w-shell px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.05] p-7">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-300/80" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Audit status
              </span>
            </div>
            <p className="mt-5 text-[14px] leading-[1.85] text-white/55">
              ONEDRAW has not been audited. No page on this site — including this one — should be read
              as an assurance of correctness or security. Any independent review will be published in
              full, including unresolved findings, before and after deployment.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#070809] p-7">
            <div className="flex items-center gap-2.5">
              <FlaskConical className="h-4 w-4 text-white/40" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Demo state
              </span>
            </div>
            <p className="mt-5 text-[14px] leading-[1.85] text-white/55">
              The application currently available runs on local demo data. No wallet connection,
              transaction or balance shown there is real. Use it to review the product journey — not as
              a record of anything that happened onchain.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-[13px]">
              <Link
                to="/docs/architecture"
                className="group inline-flex items-center gap-1.5 font-medium text-azure-ice transition-colors hover:text-white"
              >
                Contract architecture
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>
              <Link
                to="/docs/security-model"
                className="group inline-flex items-center gap-1.5 font-medium text-white/70 transition-colors hover:text-white"
              >
                Security model
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
