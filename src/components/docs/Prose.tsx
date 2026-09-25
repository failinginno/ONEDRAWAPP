import type { ReactNode } from 'react';
import { useState } from 'react';
import { AlertTriangle, ChevronDown, FlaskConical, Info } from 'lucide-react';

/* ------------------------------------------------------------------
   Headings — every <h2> carries an id so the "On this page" rail can
   deep-link into it.
   ------------------------------------------------------------------ */
export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      data-toc
      className="scroll-mt-28 text-[1.45rem] font-semibold leading-tight tracking-[-0.025em] text-white md:text-[1.7rem]"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-white">{children}</h3>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 max-w-2xl text-[15px] leading-[1.75] text-white/50 md:text-[16px]">
      {children}
    </p>
  );
}

export function P({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[14px] leading-[1.8] text-white/55 md:text-[14.5px] ${className}`}>
      {children}
    </p>
  );
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[14px] leading-[1.75] text-white/55">
          <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-azure-cyan/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------
   Strong emphasis inside body copy
   ------------------------------------------------------------------ */
export function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-white/85">{children}</span>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-azure-ice">
      {children}
    </code>
  );
}

/* ------------------------------------------------------------------
   Callout — neutral / info / caution
   ------------------------------------------------------------------ */
export function Note({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'neutral' | 'caution';
  title?: string;
  children: ReactNode;
}) {
  const map = {
    neutral: {
      ring: 'border-white/10',
      text: 'text-white/70',
      Icon: Info,
      icon: 'text-white/45',
    },
    info: {
      ring: 'border-azure-cyan/20 bg-azure-deep/20',
      text: 'text-white/70',
      Icon: Info,
      icon: 'text-azure-ice',
    },
    caution: {
      ring: 'border-amber-400/20 bg-amber-500/[0.06]',
      text: 'text-white/70',
      Icon: AlertTriangle,
      icon: 'text-amber-300/80',
    },
  }[tone];

  return (
    <div className={`rounded-xl border px-5 py-4 ${map.ring}`}>
      <div className="flex items-start gap-3">
        <map.Icon className={`mt-[3px] h-3.5 w-3.5 shrink-0 ${map.icon}`} />
        <div className="min-w-0">
          {title && (
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
              {title}
            </div>
          )}
          <div className={`mt-2 space-y-2 text-[13.5px] leading-[1.75] ${map.text}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Demo / specification banner — we never present UI data as onchain truth
   ------------------------------------------------------------------ */
export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
      <FlaskConical className="mt-[3px] h-3.5 w-3.5 shrink-0 text-white/40" />
      <div className="text-[13px] leading-[1.75] text-white/45">
        <span className="mr-2 inline-flex items-center rounded-full border border-white/12 px-2 py-0.5 align-[1px] text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">
          Demo
        </span>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Definition rows — parameter / value / note
   ------------------------------------------------------------------ */
export function SpecRows({
  rows,
}: {
  rows: { k: string; v: ReactNode; note?: ReactNode }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08]">
      {rows.map((row, i) => (
        <div
          key={row.k}
          className={`grid gap-1.5 px-5 py-4 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)] sm:gap-6 ${
            i > 0 ? 'border-t border-white/[0.07]' : ''
          }`}
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            {row.k}
          </div>
          <div>
            <div className="tabular text-[14px] font-medium text-white/85">{row.v}</div>
            {row.note && (
              <div className="mt-1.5 text-[12.5px] leading-[1.7] text-white/40">{row.note}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Compact stat strip
   ------------------------------------------------------------------ */
export function StatStrip({
  items,
}: {
  items: { value: ReactNode; label: string; accent?: boolean }[];
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl bg-white/[0.07] sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-[#070809] px-5 py-5">
          <div
            className={`tabular text-[1.5rem] font-semibold leading-none tracking-[-0.03em] ${
              item.accent ? 'text-azure-ice' : 'text-white'
            }`}
          >
            {item.value}
          </div>
          <div className="mt-2.5 text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Code / data block — used for pool parameters and pseudo interfaces
   ------------------------------------------------------------------ */
export function CodeBlock({
  label,
  lines,
}: {
  label?: string;
  lines: { k?: string; v: ReactNode; muted?: boolean }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#070809]">
      {label && (
        <div className="border-b border-white/[0.07] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
          {label}
        </div>
      )}
      <div className="divide-y divide-white/[0.05] font-mono">
        {lines.map((line, i) => (
          <div key={i} className="flex items-baseline gap-4 px-5 py-2.5">
            {line.k && (
              <span className="w-32 shrink-0 text-[11.5px] uppercase tracking-[0.1em] text-white/30">
                {line.k}
              </span>
            )}
            <span
              className={`text-[12.5px] leading-relaxed ${line.muted ? 'text-white/35' : 'text-white/75'}`}
            >
              {line.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   FAQ accordion
   ------------------------------------------------------------------ */
export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={i > 0 ? 'border-t border-white/[0.07]' : ''}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-white/[0.02]"
            >
              <span className="text-[14.5px] font-medium tracking-[-0.01em] text-white/90">
                {item.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-white/35 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="space-y-3 px-5 pb-5">
                <div className="h-px w-full bg-white/[0.06]" />
                <div className="text-[13.5px] leading-[1.8] text-white/50">{item.a}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------
   Section spacing helper
   ------------------------------------------------------------------ */
export function Section({ children }: { children: ReactNode }) {
  return <section className="mt-14 md:mt-16">{children}</section>;
}

export function Stack({
  children,
  gap = 'md',
}: {
  children: ReactNode;
  gap?: 'sm' | 'md' | 'lg';
}) {
  const gaps = { sm: 'space-y-3', md: 'space-y-4', lg: 'space-y-6' }[gap];
  return <div className={gaps}>{children}</div>;
}
