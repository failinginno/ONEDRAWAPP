import { Link } from 'react-router-dom';
import {
  Code,
  CodeBlock,
  DemoNote,
  H2,
  Note,
  P,
  Section,
  SpecRows,
  Stack,
  StatStrip,
  Strong,
  UL,
} from '../../components/docs/Prose';

import type { DocPage } from './types';

export const introduction: DocPage = {
  slug: 'introduction',
  group: 'Overview',
  nav: 'Introduction',
  title: 'Introduction',
  reading: '3 min',
  lede: (
    <>
      ONEDRAW is an onchain prize draw protocol built for Robinhood Chain. It turns a pool of ticket
      holders into a single verifiable outcome — one pool, one draw, one winner — with every rule
      visible before anyone participates.
    </>
  ),
  body: () => (
    <>
      <Section>
        <StatStrip
          items={[
            { value: '1 USDG', label: 'Per ticket' },
            { value: '11', label: 'Tickets per pool' },
            { value: 'Onchain', label: 'Settlement', accent: true },
          ]}
        />
      </Section>

      <Section>
        <Stack>
          <P>
            Onchain prize draws have usually meant opaque numbers, offchain randomness and results
            nobody can check. ONEDRAW takes the opposite approach: every parameter of a draw is
            published before the first ticket is sold, and the outcome is settled entirely onchain.
          </P>
          <P>
            Users participate in transparent prize pools denominated in <Strong>USDG</Strong>. Each
            ticket represents exactly one chance in the pool. When a pool sells out before its
            deadline, one ticket is selected and the prize is settled to the winning wallet. When it
            does not, no draw happens and every participant can reclaim their contribution.
          </P>
          <P>
            There is no house edge hidden inside the odds, no operator discretion over who wins, and
            no custodian holding funds on behalf of participants between steps.
          </P>
        </Stack>
      </Section>

      <Section>
        <H2 id="core-rules">The four core rules</H2>
        <div className="mt-6">
          <Stack>
            <UL
              items={[
                <>
                  <Strong>Fixed size.</Strong> A pool has a maximum number of tickets. It cannot grow.
                </>,
                <>
                  <Strong>Time limited.</Strong> Every pool carries an expiration timer that starts
                  with its first ticket.
                </>,
                <>
                  <Strong>Full or refunded.</Strong> Either every ticket sells and a winner is drawn,
                  or nobody wins and refunds unlock.
                </>,
                <>
                  <Strong>Verifiable.</Strong> Participation, draw and settlement are readable by
                  anyone onchain.
                </>,
              ]}
            />
          </Stack>
        </div>
      </Section>

      <Section>
        <H2 id="what-it-is-not">What ONEDRAW is not</H2>
        <div className="mt-6">
          <Stack>
            <P>
              ONEDRAW is not a casino, a betting product or a gaming platform. There is no continuous
              play loop, no odds that shift against the participant, and no operator-controlled
              payout schedule. A pool is a bounded event with published rules and a binary outcome:
              it fills and draws, or it expires and refunds.
            </P>
          </Stack>
        </div>
      </Section>

      <Section>
        <H2 id="status">Current status</H2>
        <div className="mt-6">
          <Stack gap="lg">
            <DemoNote>
              The protocol described in this documentation is the specification ONEDRAW is being
              built against. The application at <Code>/app</Code> runs on local demo data: no
              contract calls are made, no tokens move, and no transaction shown anywhere in the
              product should be read as an onchain record. Deployment details will be published here
              when contracts go live.
            </DemoNote>
            <Note tone="neutral" title="Read next">
              The{' '}
              <Link to="/docs/overview" className="text-azure-ice underline decoration-white/20">
                next section
              </Link>{' '}
              defines the pool object itself — prize, ticket price, capacity and timer.
            </Note>
          </Stack>
        </div>
      </Section>
    </>
  ),
};

export const overview: DocPage = {
  slug: 'overview',
  group: 'Overview',
  nav: 'What is ONEDRAW',
  title: 'What is ONEDRAW?',
  reading: '4 min',
  lede: (
    <>
      ONEDRAW creates fixed-size, time-limited prize pools. A pool is a complete, self-contained
      object: once you know its four parameters you know everything about how it will behave.
    </>
  ),
  body: () => (
    <>
      <Section>
        <H2 id="pool-parameters">Pool parameters</H2>
        <div className="mt-6">
          <SpecRows
            rows={[
              {
                k: 'Prize amount',
                v: 'Published at creation',
                note: 'The amount settled to the winning wallet when the pool fills.',
              },
              {
                k: 'Ticket price',
                v: 'Fixed per pool',
                note:
                  'Every participant pays the same price. 1 USDG buys exactly 1 ticket; each ticket is 1 chance.',
              },
              {
                k: 'Maximum tickets',
                v: 'Hard capacity',
                note:
                  'Sales cannot exceed capacity. When the last ticket sells, sales stop and the draw begins.',
              },
              {
                k: 'Expiration timer',
                v: 'Starts with the first ticket',
                note:
                  'A pool with no tickets never starts its clock. If capacity is not reached before expiry, refunds unlock.',
              },
            ]}
          />
        </div>
      </Section>

      <Section>
        <H2 id="worked-example">Worked example</H2>
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <CodeBlock
            label="Pool parameters"
            lines={[
              { k: 'prize', v: '10 USDG' },
              { k: 'ticket price', v: '1 USDG' },
              { k: 'max tickets', v: '11' },
              { k: 'timer', v: '3 minutes' },
            ]}
          />
          <div className="rounded-xl border border-white/[0.08] bg-[#070809] p-5">
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
              Reading the example
            </div>
            <Stack gap="sm">
              <P>
                Eleven tickets exist. Each costs <Strong>1 USDG</Strong>. Whoever holds the selected
                ticket receives <Strong>10 USDG</Strong>.
              </P>
              <P>
                When the first ticket is bought the countdown starts. Three minutes later the pool
                either holds eleven sold tickets — and draws — or it does not, and refunds unlock
                instead.
              </P>
              <P className="text-white/35">
                The difference between what the pool collects and what it pays out is the protocol
                fee. See prize pool mechanics.
              </P>
            </Stack>
          </div>
        </div>
      </Section>

      <Section>
        <H2 id="lifecycle">Lifecycle states</H2>
        <div className="mt-6">
          <SpecRows
            rows={[
              { k: 'Waiting', v: 'Created, no tickets sold', note: 'The timer has not started.' },
              { k: 'Live', v: 'Taking tickets', note: 'Timer running, capacity not reached.' },
              { k: 'Sold out', v: 'Capacity reached', note: 'Sales stop; the draw is queued.' },
              { k: 'Drawing', v: 'Selecting a ticket', note: 'Randomness requested and verified.' },
              { k: 'Completed', v: 'Prize settled', note: 'Winner and winning ticket are public.' },
              { k: 'Expired', v: 'Timer elapsed unfilled', note: 'No winner is selected.' },
              {
                k: 'Refund available',
                v: 'Claims open',
                note: 'Participants reclaim their contribution.',
              },
            ]}
          />
        </div>
      </Section>

      <Section>
        <Note tone="neutral" title="Deterministic rules">
          Nothing about a pool changes after creation. The prize, ticket price, capacity and timer
          are immutable for the life of that pool — there is no admin that extends the clock or
          expands tickets once participants have committed funds.
        </Note>
      </Section>
    </>
  ),
};

export const pages = [introduction, overview];
