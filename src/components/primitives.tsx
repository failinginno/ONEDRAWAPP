import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { APP_URL } from '../config';

/* ------------------------------------------------------------------
   Gradient emphasis — deep blue → cyan sweep, grained by the root filter
   ------------------------------------------------------------------ */
export function GradientText({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`animate-shiny ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(to right, #10254A 0%, #174879 13%, #A4F4FD 33%, #19D8FF 50%, #174879 68%, #10254A 88%, #10254A 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        filter: 'url(#od-noise)',
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------
   Eyebrow — tiny uppercase metadata
   ------------------------------------------------------------------ */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="w-1 h-1 rounded-full bg-azure-cyan" />
      <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/45">
        {children}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------
   Enter App — the primary conversion path into the real application
   ------------------------------------------------------------------ */
export function EnterApp({
  label = 'Enter App',
  href = APP_URL,
  size = 'md',
}: {
  label?: string;
  href?: string;
  size?: 'md' | 'lg';
}) {
  const pad = size === 'lg' ? 'px-7 py-3.5 text-[15px]' : 'px-5 py-3 text-sm';

  // internal destinations use client-side routing; the rendered <a> is identical
  const classes = `group inline-flex items-center justify-center gap-2 rounded-full bg-white font-medium text-black transition-all hover:bg-white/90 active:scale-[0.98] ${pad}`;
  const inner = (
    <>
      {label}
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-[3px]" />
    </>
  );

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {inner}
    </a>
  );
}

/* ------------------------------------------------------------------
   Ghost button
   ------------------------------------------------------------------ */
export function GhostButton({
  children,
  href = '#',
  size = 'md',
}: {
  children: ReactNode;
  href?: string;
  size?: 'md' | 'lg';
}) {
  const pad = size === 'lg' ? 'px-7 py-3.5 text-[15px]' : 'px-5 py-3 text-sm';

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/15 font-medium text-white/90 transition-colors hover:border-white/25 hover:bg-white/[0.04] ${pad}`}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------
   Section heading — shared editorial rhythm
   ------------------------------------------------------------------ */
export function SectionHeading({
  children,
  className = '',
  as = 'h2',
}: {
  children: ReactNode;
  className?: string;
  /** protocol / docs pages render their page title as h1 with identical styling */
  as?: 'h1' | 'h2';
}) {
  const Tag = as;

  return (
    <Tag
      className={`text-2xl md:text-4xl lg:text-[2.9rem] font-semibold leading-[1.05] tracking-[-0.03em] ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------
   Value / label cell used in the spec grids
   ------------------------------------------------------------------ */
export function StatCell({
  value,
  label,
  accent = false,
}: {
  value: ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="px-6 py-7 md:px-8 md:py-9">
      <div
        className={`tabular text-3xl md:text-[2.6rem] font-semibold leading-none tracking-[-0.03em] ${
          accent ? 'text-azure-ice' : 'text-white'
        }`}
      >
        {value}
      </div>
      <div className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Small pill
   ------------------------------------------------------------------ */
export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'cyan' | 'mint';
}) {
  const tones: Record<string, string> = {
    neutral: 'border-white/10 text-white/60',
    cyan: 'border-azure-cyan/30 text-azure-ice',
    mint: 'border-mint/35 text-mint-soft',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
