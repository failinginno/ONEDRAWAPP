import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CircleDot,
  Code2,
  FlaskConical,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import SitePage from '../../components/SitePage';
import { Eyebrow, SectionHeading } from '../../components/primitives';

const EXPLORER = 'https://explorer.testnet.chain.robinhood.com';

const CONTRACTS = [
  {
    name: 'OneDrawPoolManager V3',
    role: 'Pool lifecycle, tickets, claims and recurring templates',
    address: '0xD6Ccc1D4539f9D14b87E8327f0f34e7713A462af',
    block: '122,810,322',
  },
  {
    name: 'FeeVault',
    role: 'Receives only protocol fees realized by completed pools',
    address: '0xf205A4a78B44d0386b4ecA4248c266201298aEee',
    block: '122,810,283',
  },
  {
    name: 'MockRandomnessProvider',
    role: 'Testnet-only draw fulfillment; never suitable for production',
    address: '0x7FeD26C98357CDA77913e98197Edc35f09A9A6cE',
    block: '122,810,300',
  },
  {
    name: 'USDG',
    role: 'Testnet settlement asset · 6 decimals',
    address: '0x7E955252E15c84f5768B83c41a71F9eba181802F',
    block: 'Network contract',
  },
];

const LIFECYCLE_TESTS = [
  ['Pool creation', 'Immutable prize, ticket price, capacity, duration and fee economics'],
  ['Ticket purchase', 'Sequential tickets, multi-buy accumulation, no overselling or partial fill'],
  ['Deadline', 'First purchase starts the timer once; exact deadline boundary is enforced'],
  ['Draw request', 'Final ticket requests randomness once and enters DRAWING'],
  ['Settlement', 'First and last ticket can win; settlement cannot execute twice'],
  ['Winner claim', 'Prize remains claimable by the recorded winner under the pull model'],
  ['Refunds', 'Expired pools return exact contributions independently without administrator action'],
  ['Fees', 'FeeVault can withdraw only recorded, realized protocol fees'],
  ['Recurring pools', 'Enabled immutable templates roll over once after completion or expiration'],
  ['Emergency pause', 'Blocks new risk while preserving refunds and pending settlement'],
];

const INVARIANTS = [
  'Tickets sold never exceed pool capacity.',
  'A completed pool has exactly one valid winner.',
  'An incomplete expired pool never has a winner.',
  'Manager balance equals and covers recorded participant liabilities.',
  'FeeVault accounting never exceeds its token balance.',
];

const LIMITATIONS = [
  'The deployed randomness provider is intentionally a mock controlled by the test automation wallet.',
  'This report records development testing; it is not an independent security audit.',
  'Testnet tokens have no real-world value and results must not be presented as mainnet performance.',
  'Production deployment requires reviewed verifiable randomness, multisig administration and a new deployment review.',
];

function Stat({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#06090d]/85 p-6">
      <div className="tabular text-[2rem] font-semibold tracking-[-0.04em] text-white">{value}</div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-azure-ice">{label}</div>
      <p className="mt-3 text-[12px] leading-[1.65] text-white/35">{detail}</p>
    </div>
  );
}

export default function TestnetReportPage() {
  return (
    <SitePage>
      <section className="mx-auto max-w-shell px-6 pb-14 pt-20 lg:px-10 lg:pb-20 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <Eyebrow>Public test record · Robinhood Chain Testnet</Eyebrow>
          <SectionHeading as="h1" className="mt-7">
            Tested in public.
            <br />
            Documented in full.
          </SectionHeading>
          <p className="mt-8 max-w-2xl text-[15px] leading-[1.8] text-white/50 md:text-[16px]">
            This page preserves the current ONEDRAW V3 testnet deployment, automated test results and
            lifecycle coverage in one public record. It contains no private keys, passwords or secret
            environment values.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200/80">
              <CircleDot className="h-3.5 w-3.5" /> Test flows passed
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
              Chain ID 46630
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.05] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200/70">
              Testnet · Mock randomness
            </span>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat value="29 / 29" label="Contract tests" detail="Unit, boundary and fuzz cases passed with zero failures." />
          <Stat value="21 / 21" label="Frontend tests" detail="Domain and Web3 service checks passed with zero failures." />
          <Stat value="16,384" label="Invariant calls" detail="256 runs across purchase, time, settlement and refund actions." />
          <Stat value="0" label="Invariant reverts" detail="No handler reverts or discarded invariant calls in the recorded run." />
        </div>
        <p className="mt-4 text-right text-[10px] uppercase tracking-[0.16em] text-white/25">
          Last reproduced · 23 September 2026
        </p>
      </section>

      <section className="mx-auto max-w-shell px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex items-end justify-between gap-8 hairline-b pb-7">
          <div>
            <Eyebrow>Deployment record</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white">V3 testnet contracts</h2>
          </div>
          <a href={EXPLORER} target="_blank" rel="noreferrer" className="hidden items-center gap-2 text-[12px] text-white/45 transition-colors hover:text-white sm:flex">
            Open explorer <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div>
          {CONTRACTS.map((contract) => (
            <div key={contract.address} className="grid gap-4 hairline-b py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-center md:gap-8">
              <div>
                <div className="text-[14px] font-semibold text-white">{contract.name}</div>
                <p className="mt-1.5 text-[12px] leading-[1.6] text-white/35">{contract.role}</p>
              </div>
              <a href={`${EXPLORER}/address/${contract.address}`} target="_blank" rel="noreferrer" className="group flex min-w-0 items-center gap-2 font-mono text-[11px] text-azure-ice/70 hover:text-azure-ice">
                <span className="truncate">{contract.address}</span>
                <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <div className="font-mono text-[10px] text-white/30">Block {contract.block}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto grid max-w-shell gap-14 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-28">
          <div>
            <Eyebrow>Lifecycle coverage</Eyebrow>
            <h2 className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-[-0.035em] text-white">
              Every terminal path was exercised.
            </h2>
            <p className="mt-5 max-w-md text-[13px] leading-[1.8] text-white/40">
              The suite covers both successful draws and unfilled-pool refunds, including deadline
              boundaries and competing final purchases.
            </p>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {LIFECYCLE_TESTS.map(([title, detail]) => (
              <div key={title} className="flex gap-3 hairline-b py-5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/70" />
                <div>
                  <h3 className="text-[13px] font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-[11.5px] leading-[1.65] text-white/35">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-shell gap-5 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div className="rounded-2xl border border-[#4fc3ff]/15 bg-[#06101a]/65 p-7 sm:p-9">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-azure-cyan/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">Stateful invariants</span>
          </div>
          <ul className="mt-6 space-y-4">
            {INVARIANTS.map((item) => (
              <li key={item} className="flex gap-3 text-[13px] leading-[1.7] text-white/50">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-azure-cyan" />{item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.045] p-7 sm:p-9">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-300/80" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">Limits of this report</span>
          </div>
          <ul className="mt-6 space-y-4">
            {LIMITATIONS.map((item) => (
              <li key={item} className="flex gap-3 text-[13px] leading-[1.7] text-white/50">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-amber-300/70" />{item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="rounded-2xl border border-white/[0.09] bg-[#060708] p-7 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Code2 className="h-4 w-4 text-white/45" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">Reproduce locally</span>
              </div>
              <p className="mt-5 text-[13px] leading-[1.8] text-white/40">
                These commands rerun the public automated checks. They require no wallet and make no
                onchain transaction.
              </p>
            </div>
            <div className="space-y-3 font-mono text-[12px]">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black px-4 py-3 text-white/55"><FlaskConical className="h-3.5 w-3.5 text-azure-cyan/60" />npm run test</div>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black px-4 py-3 text-white/55"><Code2 className="h-3.5 w-3.5 text-azure-cyan/60" />cd contracts &amp;&amp; forge test --summary</div>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black px-4 py-3 text-white/55"><RefreshCw className="h-3.5 w-3.5 text-azure-cyan/60" />npm run typecheck &amp;&amp; npm run build</div>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
