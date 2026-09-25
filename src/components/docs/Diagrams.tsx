import type { ReactNode } from 'react';
import { ArrowDown, MoveRight } from 'lucide-react';

/* ------------------------------------------------------------------
   Vertical participants flow — the canonical "how it works" spine.
   ------------------------------------------------------------------ */
function FlowNode({
  index,
  title,
  body,
  tone = 'neutral',
}: {
  index: string;
  title: string;
  body?: ReactNode;
  tone?: 'neutral' | 'accent' | 'mint';
}) {
  const dot = {
    neutral: 'bg-white/20',
    accent: 'bg-azure-cyan',
    mint: 'bg-mint-soft',
  }[tone];

  return (
    <div className="rounded-xl border border-white/[0.09] bg-[#070809] px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
        <span className="tabular text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/30">
          {index}
        </span>
      </div>
      <div className="mt-2.5 text-[15px] font-medium tracking-[-0.01em] text-white">{title}</div>
      {body && <div className="mt-2 text-[13px] leading-[1.7] text-white/45">{body}</div>}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-2.5">
      <ArrowDown className="h-3.5 w-3.5 text-white/20" />
    </div>
  );
}

export function FlowDiagram({
  steps,
  branch,
}: {
  steps: { index: string; title: string; body?: ReactNode; tone?: 'neutral' | 'accent' | 'mint' }[];
  branch?: {
    title: string;
    body?: ReactNode;
    left: { label: string; title: string; body?: ReactNode; tone?: 'accent' | 'mint' };
    right: { label: string; title: string; body?: ReactNode; tone?: 'accent' | 'mint' };
  };
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0A0C11] to-[#05060A] p-5 md:p-7">
      {steps.map((step, i) => (
        <div key={step.index}>
          <FlowNode {...step} />
          {i < steps.length - 1 && <Connector />}
        </div>
      ))}

      {branch && (
        <>
          <Connector />
          {/* decision node */}
          <div className="rounded-xl border border-dashed border-white/[0.14] px-5 py-4 text-center">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
              {branch.title}
            </div>
            <div className="mt-2 text-[14.5px] font-medium text-white/85">
              Capacity reached before the deadline?
            </div>
            {branch.body && (
              <div className="mt-2 text-[12.5px] leading-[1.7] text-white/40">{branch.body}</div>
            )}
          </div>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {[branch.left, branch.right].map((side) => (
              <div
                key={side.label}
                className={`rounded-xl border px-5 py-4 ${
                  side.tone === 'accent'
                    ? 'border-azure-cyan/20 bg-azure-deep/25'
                    : 'border-mint/25 bg-mint/[0.07]'
                }`}
              >
                <div
                  className={`text-[9.5px] font-semibold uppercase tracking-[0.2em] ${
                    side.tone === 'accent' ? 'text-azure-ice' : 'text-mint-soft'
                  }`}
                >
                  {side.label}
                </div>
                <div className="mt-2 text-[14.5px] font-medium text-white">{side.title}</div>
                {side.body && (
                  <div className="mt-2 text-[12.5px] leading-[1.7] text-white/45">{side.body}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Layered architecture stack — contract topology.
   ------------------------------------------------------------------ */
export function StackDiagram({
  layers,
}: {
  layers: { name: string; kind: string; body: ReactNode; tone?: 'accent' | 'mint' }[];
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0A0C11] to-[#05060A] p-5 md:p-7">
      {layers.map((layer, i) => (
        <div key={layer.name}>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-8">
            <div className="flex items-center gap-4">
              <span
                className={`tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[11px] font-semibold ${
                  layer.tone === 'accent'
                    ? 'border-azure-cyan/25 bg-azure-cyan/10 text-azure-ice'
                    : layer.tone === 'mint'
                      ? 'border-mint/30 bg-mint/10 text-mint-soft'
                      : 'border-white/10 bg-white/[0.04] text-white/60'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="text-[15px] font-medium tracking-[-0.01em] text-white">
                  {layer.name}
                </div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/30">
                  {layer.kind}
                </div>
              </div>
            </div>
            <div className="text-[13px] leading-[1.7] text-white/45 md:pl-4 md:border-l md:border-white/[0.07]">
              {layer.body}
            </div>
          </div>
          {i < layers.length - 1 && (
            <div className="my-4 flex items-center gap-3 pl-4 md:pl-[3.25rem]">
              <span className="h-6 w-px bg-gradient-to-b from-white/15 to-white/[0.06]" />
              <MoveRight className="hidden h-3.5 w-3.5 -rotate-90 text-white/15 md:block" />
              <span className="h-px flex-1 bg-white/[0.06]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Distribution bar — how a filled pool is split.
   ------------------------------------------------------------------ */
export function SplitBar({
  total,
  unit,
  segments,
}: {
  total: number;
  unit: string;
  segments: { label: string; value: number; tone: 'accent' | 'mint' | 'neutral' }[];
}) {
  const colors = {
    accent: 'bg-gradient-to-r from-azure-cyan/70 to-brand/80',
    mint: 'bg-gradient-to-r from-mint-soft/70 to-mint/80',
    neutral: 'bg-white/15',
  } as const;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#070809] p-5 md:p-6">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
          Collected
        </span>
        <span className="tabular text-[15px] font-semibold text-white">
          {total} {unit}
        </span>
      </div>

      <div className="mt-4 flex h-9 gap-px overflow-hidden rounded-lg">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${colors[seg.tone]} flex items-center justify-center`}
            style={{ flexGrow: seg.value }}
          >
            <span className="tabular text-[11px] font-semibold text-black/70">
              {seg.value} {unit}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${colors[seg.tone]}`} />
            <span className="text-[12.5px] text-white/55">{seg.label}</span>
            <span className="tabular ml-auto text-[12.5px] font-medium text-white/80">
              {seg.value} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Odds ladder — tickets held against a fixed capacity.
   ------------------------------------------------------------------ */
export function OddsLadder({
  capacity,
  rows,
}: {
  capacity: number;
  rows: { tickets: number; note?: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08]">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-white/[0.07] bg-white/[0.02] px-5 py-3">
        <span className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35">
          Tickets held
        </span>
        <span className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35">
          Chance
        </span>
      </div>
      {rows.map((row) => (
        <div
          key={row.tickets}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 px-5 py-4"
        >
          <div>
            <div className="tabular text-[14px] font-medium text-white">
              {row.tickets} {row.tickets === 1 ? 'ticket' : 'tickets'}
            </div>
            {row.note && <div className="mt-1 text-[11.5px] text-white/35">{row.note}</div>}
          </div>
          <div>
            <div className="tabular text-[14px] font-semibold text-azure-ice">
              {row.tickets} / {capacity}
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-azure-cyan/60 to-brand/80"
                style={{ width: `${(row.tickets / capacity) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
