import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Check, ExternalLink, Minus, ShieldAlert } from 'lucide-react';
import SitePage from '../../components/SitePage';
import { Eyebrow, SectionHeading } from '../../components/primitives';

const EXPLORER = 'https://robinhoodchain.blockscout.com';
const CONTRACTS = [
  ['PoolManager', '0x8cb41dCCeA0ce11108f72b9ca6fd080DcE728096'],
  ['OpenVRF Router', '0x4820F1DABC267fD4d8Cd00E1dB30B2Cbef1de0f'],
  ['Randomness Adapter', '0x95CA6615b4c0514B56b07631A010d488B4EB2B99'],
  ['FeeVault', '0x493c4e56eE3C8Be45b50455fBCFE8e831C05e5e6'],
] as const;

const FLOW = [
  ['01', 'Tickets become a public ledger', 'Each ticket receives a sequential index and is mapped to the purchasing wallet in PoolManager storage.'],
  ['02', 'A full pool requests randomness', 'PoolManager stops sales and records the request ID and provider. The request is tied to that draw.'],
  ['03', 'OpenVRF pins a drand round', 'The Router records the consumer, round and callback before the result exists.'],
  ['04', 'The proof is verified onchain', 'An authorized relayer submits the drand signature. Invalid proof cannot produce an accepted random word.'],
  ['05', 'The contract computes one winner', 'Modulo maps the verified word to exactly one issued ticket, whose recorded owner becomes the winner.'],
] as const;

const POWERS = [
  ['Create pools and immutable templates', true],
  ['Pause new purchases and pool creation', true],
  ['Change the provider used by future requests', true],
  ['Choose a winning ticket or wallet', false],
  ['Rewrite ticket ownership after purchase', false],
  ['Reroll or replace a completed result', false],
  ['Claim a winner’s prize', false],
] as const;

export default function TransparencyPage() {
  return (
    <SitePage>
      <section className="mx-auto max-w-shell px-6 pb-20 pt-20 lg:px-10 lg:pb-28 lg:pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Eyebrow>Onchain transparency / Mainnet</Eyebrow>
          <SectionHeading as="h1" className="mt-7 max-w-[15ch]">
            Transparent by design.
            <br />Verifiable onchain.
          </SectionHeading>
          <p className="mt-8 max-w-2xl text-[15px] leading-[1.8] text-white/50 md:text-[16px]">
            Every material stage of an ONEDRAW prize draw is recorded on Robinhood Chain. This page
            documents the deployed selection logic, randomness verification process, administrative
            permissions and mainnet contracts so that every outcome can be independently verified.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="https://github.com/failinginno/ONEDRAWA-Transparent" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-black">
              View source on GitHub <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a href={`${EXPLORER}/address/${CONTRACTS[0][1]}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-[13px] text-white/70 hover:text-white">
              Inspect mainnet contract <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link to="/app/results" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-[13px] text-white/70 hover:text-white">
              View completed draws <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-shell px-6 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-azure-cyan/20 bg-azure-cyan/[0.035] p-7 md:p-10">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-azure-ice/65">The exact winner equation</div>
            <pre className="mt-8 overflow-x-auto font-mono text-[13px] leading-[2] text-white/75 md:text-[15px]"><code>{`uint32 winningTicket =\n  uint32(randomValue % pool.capacity);\n\naddress winner =\n  ticketOwners[pool.id][winningTicket];`}</code></pre>
            <p className="mt-7 max-w-xl text-[13px] leading-[1.75] text-white/40">
              This is the operative selection logic. The callback accepts the request only once,
              requires the pool to be completely sold, and rejects a pool that already has a winner.
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-[#070809] p-7 md:p-10">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">Winner attribution</div>
            <p className="mt-7 text-[20px] font-medium leading-[1.45] tracking-[-0.02em] text-white">
              The winning wallet is read from the owner of the selected ticket. It is not supplied by the website, relayer or administrator.
            </p>
            <p className="mt-6 text-[13px] leading-[1.75] text-white/40">
              A relayer can submit a valid proof or fail to submit one. It cannot make an invalid proof pass verification or substitute a wallet address.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-32">
        <Eyebrow>From purchase to result</Eyebrow>
        <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] text-white md:text-5xl">A five-step public trail.</h2>
        <div className="mt-12 hairline-t">
          {FLOW.map(([n, title, text]) => (
            <div key={n} className="hairline-b grid gap-4 py-7 md:grid-cols-[4rem_0.75fr_1.25fr] md:gap-10">
              <span className="font-mono text-sm text-azure-cyan/60">{n}</span>
              <h3 className="text-[16px] font-medium text-white/90">{title}</h3>
              <p className="max-w-2xl text-[13px] leading-[1.8] text-white/40">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hairline-y bg-white/[0.012]">
        <div className="mx-auto grid max-w-shell gap-14 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div>
            <Eyebrow>Operator authority</Eyebrow>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] text-white">What the owner can—and cannot—do.</h2>
            <p className="mt-6 max-w-xl text-[13.5px] leading-[1.8] text-white/45">Transparency includes administrator powers. Hiding them would be more dangerous than having them.</p>
          </div>
          <div className="divide-y divide-white/[0.07] rounded-2xl border border-white/[0.08] px-6">
            {POWERS.map(([label, allowed]) => (
              <div key={label} className="flex items-center gap-3 py-4">
                {allowed ? <Check className="h-4 w-4 shrink-0 text-amber-300/80" /> : <Minus className="h-4 w-4 shrink-0 text-mint-soft" />}
                <span className="text-[13px] text-white/65">{label}</span>
                <span className="ml-auto text-[9px] font-semibold uppercase tracking-[0.16em] text-white/25">{allowed ? 'Owner can' : 'No function'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Live deployment</Eyebrow>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] text-white">Verify the contracts yourself.</h2>
            <p className="mt-6 text-[13.5px] leading-[1.8] text-white/45">These are the addresses used by the current Robinhood Chain mainnet application. Always compare addresses before relying on an explorer page.</p>
          </div>
          <div className="divide-y divide-white/[0.07] border-y border-white/[0.08]">
            {CONTRACTS.map(([name, address]) => (
              <a key={name} href={`${EXPLORER}/address/${address}`} target="_blank" rel="noreferrer" className="group grid gap-2 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:gap-5">
                <span className="text-[13px] font-medium text-white/80">{name}</span>
                <code className="break-all text-[11px] text-white/35 group-hover:text-white/55">{address}</code>
                <ExternalLink className="hidden h-3.5 w-3.5 text-white/25 sm:block" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-amber-400/20 bg-amber-400/[0.045] p-7">
          <div className="flex items-center gap-2.5"><ShieldAlert className="h-4 w-4 text-amber-300/80" /><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">Remaining trust and availability risks</span></div>
          <p className="mt-5 max-w-4xl text-[13px] leading-[1.85] text-white/45">
            The owner can pause protocol entry, manage templates and configure the provider used for future requests. Authorized relayer or RPC downtime can delay a result. The website can display stale or incorrect data, so contract state is authoritative. Smart-contract verification reduces operator discretion; it does not eliminate implementation, infrastructure, wallet or economic risk.
          </p>
        </div>
      </section>
    </SitePage>
  );
}
