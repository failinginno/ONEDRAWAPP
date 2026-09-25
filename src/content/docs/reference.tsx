import { Link } from 'react-router-dom';
import {
  DemoNote,
  Faq,
  H2,
  Lead,
  Note,
  P,
  Section,
  SpecRows,
  Stack,
  Strong,
  UL,
} from '../../components/docs/Prose';
import { StackDiagram } from '../../components/docs/Diagrams';
import type { DocPage } from './types';

export const architecture: DocPage = {
  slug: 'architecture',
  group: 'Reference',
  nav: 'Smart Contract Architecture',
  title: 'Smart Contract Architecture',
  reading: '5 min',
  lede: (
    <>
      Five components, one direction of flow. Each layer has a single job and no authority over the
      layer before it — which is what keeps participation, selection and payout separable.
    </>
  ),
  body: () => (
    <>
      <Section>
        <StackDiagram
          layers={[
            {
              name: 'User Wallet',
              kind: 'EOA / account abstraction',
              tone: 'accent',
              body: (
                <>
                  Holds USDG and signs the buy transaction. Ticket ownership is recorded against this
                  address, and it is the only address that can later claim a refund for those
                  tickets.
                </>
              ),
            },
            {
              name: 'Prize Pool Contract',
              kind: 'Per-pool instance',
              body: (
                <>
                  Owns one pool&apos;s rules and balance: prize, ticket price, capacity, timer and the
                  ledger of issued tickets. It accepts tickets, tracks remaining capacity and reports
                  the state the interface renders.
                </>
              ),
            },
            {
              name: 'Randomness System',
              kind: 'Verification oracle',
              tone: 'accent',
              body: (
                <>
                  Receives a request from a filled pool and returns a verifiable random value. The
                  pool cannot proceed to settlement without a validated response.
                </>
              ),
            },
            {
              name: 'Winner Settlement',
              kind: 'Finalising step',
              body: (
                <>
                  Maps the returned value onto exactly one issued ticket, records the winning ticket
                  and winning wallet, and credits the prize in the same settled block.
                </>
              ),
            },
            {
              name: 'Fee Vault',
              kind: 'Protocol accounting',
              tone: 'mint',
              body: (
                <>
                  Receives the deterministic protocol fee — the surplus a filled pool collects beyond
                  the prize. Nothing reaches the vault from an expired pool.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section>
        <H2 id="ownership-boundaries">Ownership boundaries</H2>
        <div className="mt-6">
          <SpecRows
            rows={[
              {
                k: 'Funds',
                v: 'Held by the pool contract',
                note: 'Not by an offchain operator, not by a multisig acting as custodian.',
              },
              {
                k: 'Tickets',
                v: 'Recorded against wallets',
                note: 'Ticket ownership is the record used for both winner selection and refunds.',
              },
              {
                k: 'Draw input',
                v: 'Verifiable randomness',
                note: 'The selection input arrives with proof rather than being generated internally.',
              },
              {
                k: 'Payout',
                v: 'Settled onchain',
                note: 'Prize transfer is part of settlement, not a manually triggered withdrawal.',
              },
            ]}
          />
        </div>
      </Section>

      <Section>
        <Note tone="neutral" title="Specification, not deployment">
          This topology describes the intended architecture. Contract names, addresses and
          deployment networks will be published here once the contracts are deployed.
        </Note>
      </Section>
    </>
  ),
};

export const securityModel: DocPage = {
  slug: 'security-model',
  group: 'Reference',
  nav: 'Security Model',
  title: 'Security Model',
  reading: '4 min',
  lede: (
    <>
      Security in ONEDRAW is structural. The protocol removes the places where trust would otherwise
      be required, rather than asking participants to extend it.
    </>
  ),
  body: () => (
    <>
      <Section>
        <UL
          items={[
            <>
              <Strong>Non-custodial design.</Strong> Funds sit in the pool contract, not with an
              operator. There is no intermediate account able to move them off-path.
            </>,
            <>
              <Strong>Transparent rules.</Strong> Prize, ticket price, capacity, timer and fee are
              readable before you buy, and immutable afterwards.
            </>,
            <>
              <Strong>Onchain settlement.</Strong> Selection and payout happen in the same settled
              flow; nothing is decided in a database and reconciled later.
            </>,
            <>
              <Strong>Public verification.</Strong> Pools, tickets, draws and results are legible to
              anyone with a block explorer.
            </>,
            <>
              <Strong>User-controlled refunds.</Strong> Claims are submitted by the participant&apos;s
              own wallet — no operator gate, and nobody else can trigger it for you.
            </>,
          ]}
        />
      </Section>

      <Section>
        <Note tone="caution" title="No audit claim">
          ONEDRAW has not been audited at this stage. Nothing in this documentation, in the{' '}
          <Link to="/security" className="text-white/80 underline decoration-white/20">
            security page
          </Link>{' '}
          or in the application should be read as an assurance of correctness. Any independent review
          will be published in full, including unresolved findings, before and after deployment.
        </Note>
      </Section>

      <Section>
        <H2 id="read-more">Go deeper</H2>
        <div className="mt-6">
          <Stack>
            <P>
              The{' '}
              <Link to="/security" className="text-azure-ice underline decoration-white/20">
                security page
              </Link>{' '}
              covers each guarantee in isolation: transparent architecture, onchain settlement, the
              random draw process, refund protection and public verification.
            </P>
          </Stack>
        </div>
      </Section>
    </>
  ),
};

export const faq: DocPage = {
  slug: 'faq',
  group: 'Reference',
  nav: 'FAQ',
  title: 'FAQ',
  reading: '3 min',
  lede: <>Short answers to the questions that come up first.</>,
  body: () => (
    <>
      <Section>
        <Faq
          items={[
            {
              q: 'How does ONEDRAW work?',
              a: (
                <>
                  Each pool publishes a prize, a ticket price, a maximum number of tickets and a
                  timer. You buy tickets with USDG. If every ticket sells before the timer ends, one
                  ticket is randomly selected and the prize is settled to its owner. If the pool does
                  not fill, no winner is selected and every participant can claim a refund.
                </>
              ),
            },
            {
              q: 'Can I buy multiple tickets?',
              a: (
                <>
                  Yes, up to the remaining capacity of the pool. Each additional ticket adds one more
                  chance, so holding 3 of 11 tickets gives a 3 in 11 chance. Buying more never changes
                  the price or the rules for anyone else in the pool.
                </>
              ),
            },
            {
              q: 'What happens if a pool expires?',
              a: (
                <>
                  Nothing is drawn and no protocol fee is taken. Your contribution becomes claimable
                  and stays claimable — claim it from your own wallet whenever you are ready. The gas
                  for that claim transaction is paid by the claiming wallet.
                </>
              ),
            },
            {
              q: 'How is the winner selected?',
              a: (
                <>
                  A filled pool requests randomness from the randomness source configured for the
                  deployment, validates the response, then maps the returned value onto exactly one
                  issued ticket number. One valid ticket wins; there are no second prizes and no
                  partial settlements.
                </>
              ),
            },
            {
              q: 'Where are results verified?',
              a: (
                <>
                  On Robinhood Chain. Pool state, ticket ownership, the draw request and the settled
                  outcome are all readable onchain, so results can be checked independently of this
                  website or the app interface.
                </>
              ),
            },
            {
              q: 'Does ONEDRAW custody my funds?',
              a: (
                <>
                  No. During a live draw, funds are held by the pool contract itself, and payouts and
                  refunds are executed by that contract. ONEDRAW has no account that can redirect them.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section>
        <DemoNote>
          Answers describe intended protocol behaviour. The application you can open today runs on demo
          data and does not execute any of it.
        </DemoNote>
      </Section>
      <Section>
        <Lead>More definitions live in the Introduction and in What is ONEDRAW.</Lead>
      </Section>
    </>
  ),
};

export const pages = [architecture, securityModel, faq];
