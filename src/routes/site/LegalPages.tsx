import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, FileText, Lock, ShieldCheck } from 'lucide-react';
import SitePage from '../../components/SitePage';
import { Eyebrow, SectionHeading } from '../../components/primitives';

export default function TermsPage() {
  return (
    <SitePage>
      <div className="mx-auto max-w-[820px] px-6 py-20 lg:px-10 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyebrow>Legal</Eyebrow>
          <SectionHeading as="h1" className="mt-6">Terms of use.</SectionHeading>
          <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-white/30">
            Last updated — placeholder, published with deployment
          </p>
        </motion.div>

        <div className="mt-12 space-y-10">
          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">Status</h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              ONEDRAW is under active development. The application available at{' '}
              <code className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-azure-ice">
                /app
              </code>{' '}
              runs entirely on simulated demo data: it performs no contract calls, moves no funds and
              produces no transaction record. Nothing you see there should be treated as an onchain
              event or as an offer to participate.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              Description of service
            </h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              ONEDRAW is intended to be a non-custodial protocol for fixed-size, time-limited prize
              pools denominated in USDG on Robinhood Chain. A pool publishes a prize, a ticket price, a
              maximum number of tickets and a timer. If the pool fills before expiry, one ticket is
              randomly selected and the prize is settled to its holder. If it does not fill, no winner
              is selected and participants may claim their contribution back, paying their own gas.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              No financial advice
            </h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              Nothing published by ONEDRAW is investment, legal or tax advice. Participation in a prize
              pool involves the risk of losing the amount spent on tickets, and access to the protocol
              may be restricted in some jurisdictions. You are responsible for understanding the rules
              that apply where you live.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              Your responsibilities
            </h2>
            <ul className="mt-4 space-y-3 text-[14px] leading-[1.85] text-white/50">
              <li className="flex gap-3">
                <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-azure-cyan/70" />
                You control your wallet. Lost keys cannot be recovered by the protocol.
              </li>
              <li className="flex gap-3">
                <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-azure-cyan/70" />
                Every purchase and every refund claim is a transaction you authorise, paid for with
                your own gas.
              </li>
              <li className="flex gap-3">
                <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-azure-cyan/70" />
                You must not use the protocol where doing so would breach applicable law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              Software risk
            </h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              Smart contracts can contain defects. The protocol has not been audited at this stage, and
              no website, documentation or demo interface constitutes an assurance of correctness or
              security. Use the protocol at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">Changes</h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              These terms will be updated before launch and will be versioned publicly. The full,
              binding version will be published alongside contract addresses and deployment details.
            </p>
          </section>

          <div className="hairline-t pt-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                to="/docs"
                className="group flex items-center justify-between rounded-xl border border-white/[0.08] px-5 py-4 text-[13px] text-white/70 transition-colors hover:border-white/[0.16] hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Documentation
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>
              <Link
                to="/security"
                className="group flex items-center justify-between rounded-xl border border-white/[0.08] px-5 py-4 text-[13px] text-white/70 transition-colors hover:border-white/[0.16] hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Security
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>
              <Link
                to="/privacy"
                className="group flex items-center justify-between rounded-xl border border-white/[0.08] px-5 py-4 text-[13px] text-white/70 transition-colors hover:border-white/[0.16] hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Privacy
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SitePage>
  );
}

/* ------------------------------------------------------------------
   Privacy — separate route, same layout
   ------------------------------------------------------------------ */
export function PrivacyPage() {
  return (
    <SitePage>
      <div className="mx-auto max-w-[820px] px-6 py-20 lg:px-10 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyebrow>Privacy</Eyebrow>
          <SectionHeading as="h1" className="mt-6">
            What we collect,
            <br />
            and what we cannot.
          </SectionHeading>
          <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-white/30">
            Last updated — placeholder, published with deployment
          </p>
        </motion.div>

        <div className="mt-12 space-y-10">
          <section>
            <p className="text-[15px] leading-[1.8] text-white/55">
              ONEDRAW is designed so that participation requires no identity. You interact with a
              wallet address, not an account, and the protocol holds no profile.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              What this website collects
            </h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              The marketing site and documentation do not require registration and do not request
              personal data. The interface loads its typeface from a font delivery network, which
              receives ordinary request metadata such as your IP address and user agent — this is how
              fonts are served, and it applies to essentially every website that uses a web font. No
              advertising or cross-site tracking scripts are loaded.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              Wallet and onchain data
            </h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              A wallet address is pseudonymous, but everything associated with it onchain is public and
              permanent: balances, tickets held, draws entered and results. Anyone can read this
              information directly from Robinhood Chain without our involvement, and we cannot delete
              or hide it. Do not use a wallet whose address you intend to keep private.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              Demo data in the application
            </h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              The application at{' '}
              <code className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-azure-ice">
                /app
              </code>{' '}
              is simulated locally in your browser. The wallet address, pools, tickets and results it
              displays are placeholders that exist only in your session — none of it leaves your
              device, and none of it represents a real balance or transaction.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              No custody of funds or keys
            </h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              We never hold your private keys or seed phrase, and we cannot recover them if lost. We do
              not ask for them, and any request claiming otherwise is not from us.
            </p>
          </section>

          <section>
            <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-white">
              Updates
            </h2>
            <p className="mt-4 text-[14px] leading-[1.85] text-white/50">
              This policy will be expanded and versioned before launch. Material changes will be
              published here.
            </p>
          </section>
        </div>
      </div>
    </SitePage>
  );
}
