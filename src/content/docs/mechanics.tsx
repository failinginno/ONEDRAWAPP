import { Link } from 'react-router-dom';
import {
  DemoNote,
  H2,
  Lead,
  Note,
  P,
  Section,
  SpecRows,
  Stack,
  StatStrip,
  Strong,
  UL,
} from '../../components/docs/Prose';
import { FlowDiagram, OddsLadder, SplitBar } from '../../components/docs/Diagrams';
import type { DocPage } from './types';

export const howItWorks: DocPage = {
  slug: 'how-it-works',
  group: 'Mechanics',
  nav: 'How It Works',
  title: 'How It Works',
  reading: '4 min',
  lede: (
    <>
      One pool is a straight line from wallet to settlement. Five steps, one branch, and no outcome
      that is not written into the pool before you enter it.
    </>
  ),
  body: () => (
    <>
      <Section>
        <FlowDiagram
          steps={[
            {
              index: 'Step 01',
              title: 'Connect Wallet',
              body: 'Connect a compatible wallet to Robinhood Chain. Balances are read directly from your wallet — nothing is approved for ongoing spending.',
            },
            {
              index: 'Step 02',
              title: 'Choose Pool',
              body:
                'Every pool publishes its prize, ticket price, capacity and remaining time before you commit anything.',
              tone: 'accent',
            },
            {
              index: 'Step 03',
              title: 'Buy Tickets',
              body:
                'Each USDG buys one ticket. Buy several in a single transaction to increase your share of the pool.',
            },
          ]}
          branch={{
            title: 'Outcome',
            left: {
              label: 'Pool fills',
              title: 'Winner Selected',
              body: 'Sales stop, one valid ticket is drawn, the prize settles to the winning wallet.',
              tone: 'accent',
            },
            right: {
              label: 'Pool expires',
              title: 'Refund Available',
              body: 'No winner is selected. Participants claim their original contribution back.',
              tone: 'mint',
            },
          }}
        />
      </Section>

      <Section>
        <H2 id="step-detail">Step detail</H2>
        <div className="mt-6">
          <SpecRows
            rows={[
              {
                k: 'Connect',
                v: 'Read-only by default',
                note:
                  'The app reads your wallet to show balances and held tickets. Spending permissions are requested per action, not blanket-approved.',
              },
              {
                k: 'Choose',
                v: 'Rules published up front',
                note:
                  'Prize, ticket price, capacity, timer and protocol fee are all visible before purchase.',
              },
              {
                k: 'Buy',
                v: 'Ticket numbers assigned',
                note:
                  'Each purchase returns the ticket numbers you hold. The same numbers are what the draw selects from.',
              },
              {
                k: 'Settle',
                v: 'Automatic after the draw',
                note:
                  'A filled pool pays the winner without a separate claim. An expired pool requires each participant to claim their refund.',
              },
            ]}
          />
        </div>
      </Section>

      <Section>
        <Note tone="neutral" title="Nothing is streamed or streamed later">
          A draw is a discrete event, not a rolling process. Participants wait for either the fill
          event or the expiry event; there is no intermediate state where partial outcomes are paid.
        </Note>
      </Section>
    </>
  ),
};

export const tickets: DocPage = {
  slug: 'tickets',
  group: 'Mechanics',
  nav: 'Ticket System',
  title: 'Ticket System',
  reading: '3 min',
  lede: (
    <>
      Tickets are the unit of participation. They are linear, countable and visible: your chance is
      exactly the number of tickets you hold divided by the pool capacity.
    </>
  ),
  body: () => (
    <>
      <Section>
        <StatStrip
          items={[
            { value: '1 USDG', label: 'Buys' },
            { value: '1 ticket', label: 'Equals' },
            { value: 'Linear', label: 'Probability', accent: true },
          ]}
        />
      </Section>

      <Section>
        <H2 id="rules">Ticket rules</H2>
        <div className="mt-6">
          <UL
            items={[
              <>
                <Strong>1 USDG = 1 ticket.</Strong> The exchange is fixed and identical for every
                participant in a pool.
              </>,
              <>
                <Strong>Multiple tickets are allowed.</Strong> You may buy as many tickets as remain
                unsold, including all of them.
              </>,
              <>
                <Strong>Probability scales linearly.</Strong> Doubling your tickets doubles your
                chance. There is no bonus tier, no discount curve and no weight hidden behind tiers.
              </>,
              <>
                <Strong>Tickets are numbered.</Strong> Each ticket carries a number within the pool;
                the draw selects one of these numbers.
              </>,
            ]}
          />
        </div>
      </Section>

      <Section>
        <H2 id="odds">Odds in an 11-ticket pool</H2>
        <div className="mt-6">
          <OddsLadder
            capacity={11}
            rows={[
              { tickets: 1, note: 'Baseline entry' },
              { tickets: 3, note: 'Three of eleven tickets' },
              { tickets: 7, note: 'Majority share of the pool' },
            ]}
          />
        </div>
        <div className="mt-5">
          <Note tone="info" title="Reading odds">
            Odds always refer to the pool capacity, not to the number of tickets already sold. A
            participant holding 3 of 11 tickets holds a 3 in 11 chance regardless of how the other 8
            tickets are distributed among wallets.
          </Note>
        </div>
      </Section>

      <Section>
        <DemoNote>
          Odds shown anywhere in the application are computed from local demo data. They illustrate
          the formula, they are not a statement about a live pool.
        </DemoNote>
      </Section>
    </>
  ),
};

export const poolMechanics: DocPage = {
  slug: 'pool-mechanics',
  group: 'Mechanics',
  nav: 'Prize Pool Mechanics',
  title: 'Prize Pool Mechanics',
  reading: '3 min',
  lede: (
    <>
      A pool completes when every ticket is sold. Completion does not mean “someone administers a
      payout” — it means the contract that holds the tickets has no remaining inventory and moves to
      its draw state.
    </>
  ),
  body: () => (
    <>
      <Section>
        <H2 id="completion">What completion means</H2>
        <div className="mt-6">
          <Stack>
            <Lead>
              Capacity is a hard boundary. When the final ticket is sold, the sale interface closes,
              the pool transitions out of <Strong>Live</Strong>, and no further ticket can be issued
              against it.
            </Lead>
            <UL
              items={[
                <>Ticket inventory is exhausted — the pool cannot accept further entry.</>,
                <>The prize, ticket price and capacity are unchanged from creation.</>,
                <>The collected pool balance now equals the full economic value of the draw.</>,
              ]}
            />
          </Stack>
        </div>
      </Section>

      <Section>
        <H2 id="economics">Pool economics</H2>
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <SplitBar
            total={11}
            unit="USDG"
            segments={[
              { label: 'Winner reward', value: 10, tone: 'accent' },
              { label: 'Protocol fee', value: 1, tone: 'mint' },
            ]}
          />
          <div className="rounded-xl border border-white/[0.08] bg-[#070809] p-5">
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
              11-ticket example
            </div>
            <Stack gap="sm">
              <P>
                A filled 11-ticket pool at 1 USDG collects <Strong>11 USDG</Strong>.
              </P>
              <P>
                The winner receives the advertised prize of <Strong>10 USDG</Strong>. The remaining{' '}
                <Strong>1 USDG</Strong> is the protocol fee.
              </P>
              <P className="text-white/35">
                The fee only exists when a draw happens. An expired pool collects nothing.
              </P>
            </Stack>
          </div>
        </div>
      </Section>

      <Section>
        <Note tone="info" title="Fee transparency">
          The protocol fee is deterministic: it is whatever the pool collects beyond the winner&apos;s
          prize. Because prize, ticket price and capacity are fixed at creation, the fee for any pool
          is known before the first ticket is bought — the app shows it on every pool card.
        </Note>
      </Section>

      <Section>
        <P>
          Draw mechanics continue in{' '}
          <Link to="/docs/draw-process" className="text-azure-ice underline decoration-white/20">
            Draw Process
          </Link>
          .
        </P>
      </Section>
    </>
  ),
};

export const pages = [howItWorks, tickets, poolMechanics];
