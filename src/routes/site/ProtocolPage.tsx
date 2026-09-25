import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Coins, Radio, Receipt, Shuffle, Ticket, Timer } from 'lucide-react';
import SitePage from '../../components/SitePage';
import { Eyebrow, SectionHeading, StatCell } from '../../components/primitives';
import {
  CodeBlock,
  DemoNote,
  Note,
  P,
  Stack,
  Strong,
} from '../../components/docs/Prose';
import { FlowDiagram, OddsLadder, SplitBar, StackDiagram } from '../../components/docs/Diagrams';

const AREAS = [
  { icon: Receipt, label: 'Prize Pools', id: 'prize-pools' },
  { icon: Ticket, label: 'Ticket Management', id: 'ticket-management' },
  { icon: Shuffle, label: 'Random Selection', id: 'random-selection' },
  { icon: Coins, label: 'Settlement', id: 'settlement' },
  { icon: Radio, label: 'Fee Distribution', id: 'fee-distribution' },
];

export default function ProtocolPage() {
  return (
    <SitePage>
      {/* header */}
      <section className="mx-auto max-w-shell px-6 pb-14 pt-20 lg:px-10 lg:pb-16 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Eyebrow>Protocol</Eyebrow>
          <SectionHeading as="h1" className="mt-7">
            The architecture
            <br />
            of a single draw.
          </SectionHeading>
          <p className="mt-8 text-[15px] leading-[1.8] text-white/50 md:text-[16px]">
            ONEDRAW is deliberately small. Five moving parts take a filled pool from collected tickets
            to a settled outcome, and each one has a single job. Nothing in the pipeline can be adjusted
            after participants have committed funds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.08] md:grid-cols-4"
        >
          <StatCell value="1 USDG" label="One ticket" />
          <StatCell value="11" label="Reference capacity" />
          <StatCell value="1" label="Winning ticket" accent />
          <StatCell value="Onchain" label="Settlement" />
        </motion.div>

        <div className="mt-8">
          <DemoNote>
            The pipeline below describes intended protocol behaviour. The application at{' '}
            <strong className="font-medium text-white/70">/app</strong> simulates it locally with demo
            data — no contract calls are made and no funds move.
          </DemoNote>
        </div>
      </section>

      {/* system map */}
      <section className="mx-auto max-w-shell px-6 lg:px-10">
        <StackDiagram
          layers={[
            {
              name: 'User Wallet',
              kind: 'Participant',
              tone: 'accent',
              body: (
                <>
                  Signs purchases and holds ticket ownership. Only this wallet can claim a refund for
                  the tickets it bought.
                </>
              ),
            },
            {
              name: 'Prize Pool Contract',
              kind: 'Per-pool instance',
              body: (
                <>
                  Owns one pool&apos;s parameters and balance. Issues tickets up to capacity, tracks
                  remaining inventory and exposes the state the interface renders.
                </>
              ),
            },
            {
              name: 'Randomness System',
              kind: 'Verification oracle',
              tone: 'accent',
              body: (
                <>Returns a verifiable random value to a filled pool. No valid response, no draw.</>
              ),
            },
            {
              name: 'Winner Settlement',
              kind: 'Finalising step',
              body: (
                <>
                  Maps that value onto one issued ticket number and credits the prize in the same
                  settled flow.
                </>
              ),
            },
            {
              name: 'Fee Vault',
              kind: 'Protocol accounting',
              tone: 'mint',
              body: (
                <>
                  Receives the deterministic surplus of a filled pool. An expired pool contributes
                  nothing.
                </>
              ),
            },
          ]}
        />
      </section>

      {/* areas */}
      <section className="mx-auto max-w-shell px-6 lg:px-10">
        {/* 1 · prize pools */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          id="prize-pools"
          className="scroll-mt-28 hairline-b py-16 lg:py-20"
        >
          <div className="flex items-center gap-3">
            <Receipt className="h-4 w-4 text-azure-cyan/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Area 01
            </span>
          </div>
          <h2 className="mt-6 text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-white lg:text-[2.2rem]">
            Prize Pools
          </h2>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.8] text-white/50">
            A pool is a fixed-size, time-limited container. Its four parameters define everything that
            can happen to it, and they are published before the first ticket is sold.
          </p>

          <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <CodeBlock
              label="Reference pool"
              lines={[
                { k: 'prize', v: '10 USDG' },
                { k: 'ticket price', v: '1 USDG' },
                { k: 'max tickets', v: '11' },
                { k: 'timer', v: '3 minutes' },
              ]}
            />
            <div className="rounded-xl border border-white/[0.08] bg-[#070809] p-6">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                <Timer className="h-3.5 w-3.5" />
                Timer behaviour
              </div>
              <Stack gap="sm">
                <P>
                  The clock starts with the <Strong>first ticket</Strong>, not at creation — a pool
                  nobody enters simply waits.
                </P>
                <P>
                  If capacity is reached first, the timer becomes irrelevant: the pool moves straight
                  to its draw.
                </P>
                <P>
                  If time runs out first, the pool expires and refunds unlock. No draw happens and no
                  fee is taken.
                </P>
              </Stack>
            </div>
          </div>
        </motion.div>

        {/* 2 · ticket management */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          id="ticket-management"
          className="scroll-mt-28 hairline-b py-16 lg:py-20"
        >
          <div className="flex items-center gap-3">
            <Ticket className="h-4 w-4 text-azure-cyan/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Area 02
            </span>
          </div>
          <h2 className="mt-6 text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-white lg:text-[2.2rem]">
            Ticket Management
          </h2>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.8] text-white/50">
            Tickets are numbered units of a finite inventory. One USDG buys exactly one ticket, and
            probability scales strictly linearly — there are no tiers, multipliers or weights.
          </p>

          <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <OddsLadder
              capacity={11}
              rows={[
                { tickets: 1, note: 'Baseline entry' },
                { tickets: 3, note: 'Three of eleven' },
                { tickets: 7, note: 'Majority of the pool' },
              ]}
            />
            <div className="rounded-xl border border-white/[0.08] bg-[#070809] p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Invariants
              </div>
              <Stack gap="sm">
                <P>
                  Issued tickets never exceed <Strong>capacity</Strong>.
                </P>
                <P>
                  Every issued ticket maps to <Strong>exactly one wallet</Strong>.
                </P>
                <P>
                  Ticket numbers are <Strong>unique</Strong> within a pool, so selection always
                  resolves to one holder.
                </P>
              </Stack>
            </div>
          </div>
        </motion.div>

        {/* 3 · random selection */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          id="random-selection"
          className="scroll-mt-28 hairline-b py-16 lg:py-20"
        >
          <div className="flex items-center gap-3">
            <Shuffle className="h-4 w-4 text-azure-cyan/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Area 03
            </span>
          </div>
          <h2 className="mt-6 text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-white lg:text-[2.2rem]">
            Random Selection
          </h2>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.8] text-white/50">
            Selection is the only step allowed to be unpredictable. It is also the only step that waits
            on external input — and it will not proceed until that input is validated.
          </p>

          <div className="mt-9">
            <FlowDiagram
              steps={[
                {
                  index: 'Step 01',
                  title: 'Sales Stop',
                  body: 'The final ticket closes the pool and disables further issuance.',
                },
                {
                  index: 'Step 02',
                  title: 'Randomness Requested',
                  body: 'The pool requests a verifiable random value and waits.',
                  tone: 'accent',
                },
                {
                  index: 'Step 03',
                  title: 'Ticket Selected',
                  body: 'The validated value maps onto one issued ticket number.',
                  tone: 'accent',
                },
              ]}
            />
          </div>

          <div className="mt-6">
            <Note tone="neutral" title="Deployment-defined">
              The randomness source is part of deployment configuration. Its assumptions and verification
              steps will be published with contract addresses — no audit is claimed here.
            </Note>
          </div>
        </motion.div>

        {/* 4 · settlement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          id="settlement"
          className="scroll-mt-28 hairline-b py-16 lg:py-20"
        >
          <div className="flex items-center gap-3">
            <Coins className="h-4 w-4 text-azure-cyan/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Area 04
            </span>
          </div>
          <h2 className="mt-6 text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-white lg:text-[2.2rem]">
            Settlement
          </h2>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.8] text-white/50">
            Settlement closes the event. For a filled pool it fixes the winner and enables a winner-only prize claim; for an
            expired pool it opens refund claims instead. Either way there is exactly one terminal path.
          </p>

          <div className="mt-9">
            <FlowDiagram
              steps={[
                {
                  index: 'Filled',
                  title: 'Prize credited to the winning wallet',
                  body:
                    'Winning ticket and wallet are recorded publicly. No claim interaction is required from the winner.',
                  tone: 'accent',
                },
                {
                  index: 'Expired',
                  title: 'Refund claims open',
                  body:
                    'Each participant claims their contribution from their own wallet and pays their own gas.',
                  tone: 'mint',
                },
              ]}
            />
          </div>
        </motion.div>

        {/* 5 · fee distribution */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          id="fee-distribution"
          className="scroll-mt-28 py-16 lg:py-20"
        >
          <div className="flex items-center gap-3">
            <Radio className="h-4 w-4 text-azure-cyan/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Area 05
            </span>
          </div>
          <h2 className="mt-6 text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-white lg:text-[2.2rem]">
            Fee Distribution
          </h2>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.8] text-white/50">
            There is one fee, it is deterministic, and it is visible on every pool card before you buy:
            whatever a filled pool collects beyond the prize.
          </p>

          <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <SplitBar
              total={11}
              unit="USDG"
              segments={[
                { label: 'Winner reward', value: 10, tone: 'accent' },
                { label: 'Protocol fee', value: 1, tone: 'mint' },
              ]}
            />
            <div className="rounded-xl border border-white/[0.08] bg-[#070809] p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Rules
              </div>
              <Stack gap="sm">
                <P>
                  Eleven tickets at 1 USDG collect <Strong>11 USDG</Strong>.
                </P>
                <P>
                  The winner receives the advertised <Strong>10 USDG</Strong> prize.
                </P>
                <P>
                  The remaining <Strong>1 USDG</Strong> is the protocol fee, forwarded to the vault.
                </P>
                <P className="text-white/35">
                  An expired pool collects nothing at all — no draw, no fee.
                </P>
              </Stack>
            </div>
          </div>
        </motion.div>
      </section>

      {/* read next */}
      <section className="mx-auto max-w-shell px-6 pb-24 lg:px-10">
        <div className="hairline-t pt-10">
          <div className="flex flex-wrap items-center gap-3 text-[12.5px]">
            {AREAS.map((area) => (
              <a
                key={area.id}
                href={`#${area.id}`}
                className="rounded-full border border-white/10 px-3.5 py-1.5 text-white/50 transition-colors hover:border-white/20 hover:text-white"
              >
                {area.label}
              </a>
            ))}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Link
              to="/docs"
              className="group flex items-center justify-between rounded-xl border border-white/[0.08] px-5 py-4 text-[13px] text-white/70 transition-colors hover:border-white/[0.16] hover:text-white"
            >
              Read the documentation
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
            </Link>
            <Link
              to="/security"
              className="group flex items-center justify-between rounded-xl border border-white/[0.08] px-5 py-4 text-[13px] text-white/70 transition-colors hover:border-white/[0.16] hover:text-white"
            >
              Security guarantees
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
            </Link>
            <Link
              to="/app"
              className="group flex items-center justify-between rounded-xl border border-white/[0.08] px-5 py-4 text-[13px] text-white/70 transition-colors hover:border-white/[0.16] hover:text-white"
            >
              Open the demo app
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
            </Link>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
