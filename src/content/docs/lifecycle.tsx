import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  DemoNote,
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
import { FlowDiagram } from '../../components/docs/Diagrams';
import type { DocPage } from './types';

export const drawProcess: DocPage = {
  slug: 'draw-process',
  group: 'Lifecycle',
  nav: 'Draw Process',
  title: 'Draw Process',
  reading: '4 min',
  lede: (
    <>
      When a pool fills, sales stop and one ticket is selected. The selection is the only part of
      ONEDRAW that is allowed to be unpredictable — everything around it is deterministic.
    </>
  ),
  body: () => (
    <>
      <Section>
        <FlowDiagram
          steps={[
            {
              index: 'Step 01',
              title: 'Sales Stop',
              body:
                'The final ticket closes the pool. No further ticket can be issued against it, and the state is visible onchain.',
            },
            {
              index: 'Step 02',
              title: 'Random Selection Begins',
              body:
                'The pool requests randomness and waits for the response to settle. Selection cannot be reordered or replayed.',
              tone: 'accent',
            },
            {
              index: 'Step 03',
              title: 'One Valid Ticket Wins',
              body:
                'Exactly one issued ticket number is selected. Every issued ticket belongs to exactly one wallet, so the winner is unambiguous.',
            },
            {
              index: 'Step 04',
              title: 'Settlement',
              body:
                'After settlement completes, the prize is credited to the winning wallet. The winning ticket and wallet become publicly readable.',
              tone: 'accent',
            },
          ]}
        />
      </Section>

      <Section>
        <H2 id="sequence">What happens, in order</H2>
        <div className="mt-6">
          <SpecRows
            rows={[
              {
                k: 'Close',
                v: 'Capacity reached',
                note: 'The pool leaves its live state. Ticket issuance is permanently disabled.',
              },
              {
                k: 'Request',
                v: 'Randomness',
                note:
                  'The draw requests a random value from the randomness source configured for the deployment.',
              },
              {
                k: 'Select',
                v: 'One ticket',
                note: 'The returned value maps to a single number in the issued ticket set.',
              },
              {
                k: 'Verify',
                v: 'Response checked',
                note: 'The draw only proceeds to settlement once the randomness response is validated.',
              },
              {
                k: 'Settle',
                v: 'Prize credited',
                note: 'The winning result is permanent; the winning wallet submits the prize claim.',
              },
            ]}
          />
        </div>
      </Section>

      <Section>
        <Note tone="info" title="Defined over deployed specifics">
          This section describes intended draw behaviour. The concrete randomness source, its security
          assumptions and the settlement path are part of the deployment configuration and will be
          published together with contract addresses. No audit should be assumed unless it is
          published by us.
        </Note>
      </Section>

      <Section>
        <P>
          If the pool never fills, none of this runs — see{' '}
          <Link to="/docs/refunds" className="text-azure-ice underline decoration-white/20">
            Refund Mechanism
          </Link>
          .
        </P>
      </Section>
    </>
  ),
};

export const refunds: DocPage = {
  slug: 'refunds',
  group: 'Lifecycle',
  nav: 'Refund Mechanism',
  title: 'Refund Mechanism',
  reading: '3 min',
  lede: (
    <>
      A pool that expires without filling is a non-event. No winner is selected, no protocol fee is
      collected, and every participant can claim their contribution back in full.
    </>
  ),
  body: () => (
    <>
      <Section>
        <Stack>
          <Lead>
            Expiry is not a failure state with penalties attached to it. It simply means the
            conditions required to draw a winner were never met, so the pool reverts to returning what
            each participant put in.
          </Lead>
          <UL
            items={[
              <>
                <Strong>No winner is selected.</Strong> Expiry never produces a draw.
              </>,
              <>
                <Strong>No protocol fee is collected.</Strong> The fee exists only when a draw and
                settlement occur.
              </>,
              <>
                <Strong>Original contribution is claimable.</Strong> Participants reclaim the exact
                amount they spent on tickets.
              </>,
              <>
                <Strong>Refunds are user-controlled.</Strong> The claim is submitted by the claiming
                wallet — not pushed by an operator.
              </>,
            ]}
          />
        </Stack>
      </Section>

      <Section>
        <H2 id="claim-flow">Claiming</H2>
        <div className="mt-6">
          <FlowDiagram
            steps={[
              {
                index: 'Step 01',
                title: 'Pool Expires',
                body: 'The timer elapses with unsold tickets remaining. The pool moves to Expired.',
              },
              {
                index: 'Step 02',
                title: 'Refund Unlocks',
                body:
                  'Each participant’s contribution becomes claimable against the pool that holds it.',
                tone: 'mint',
              },
              {
                index: 'Step 03',
                title: 'Wallet Submits Claim',
                body: 'The claiming wallet sends the refund transaction and pays its own gas.',
                tone: 'mint',
              },
            ]}
          />
        </div>
      </Section>

      <Section>
        <Note tone="caution" title="Gas is paid by the claiming wallet">
          Refunds are not automatic payouts. A refund requires an onchain transaction initiated by the
          participant, and the gas for that transaction is paid by the claiming wallet. If you hold
          tickets across several expired pools, each claim is a separate transaction.
        </Note>
      </Section>

      <Section>
        <H2 id="see-in-app">See it in the demo app</H2>
        <div className="mt-6">
          <Stack gap="lg">
            <Link
              to="/app/refunds"
              className="group inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-[13px] font-medium text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.04]"
            >
              Open Refunds
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
            </Link>
            <DemoNote>
              The refunds panel runs entirely on demo data. It demonstrates the interface states —
              available, claiming, claimed — without moving any funds.
            </DemoNote>
          </Stack>
        </div>
      </Section>
    </>
  ),
};

export const pages = [drawProcess, refunds];
