import type { PoolStatus } from '../../app/store';

/**
 * Consistent status vocabulary across the app.
 * Deliberately no aggressive red — expired pools are a neutral outcome.
 */
const TONES: Record<PoolStatus, { label: string; cls: string; dot: string }> = {
  WAITING: {
    label: 'Waiting',
    cls: 'border-white/12 text-white/50',
    dot: 'bg-white/35',
  },
  LIVE: {
    label: 'Live',
    cls: 'border-mint/35 text-mint-soft',
    dot: 'bg-mint-soft animate-pulse-dot',
  },
  FILLING_FAST: {
    label: 'Filling Fast',
    cls: 'border-amber-400/30 text-amber-200/85',
    dot: 'bg-amber-300',
  },
  SOLD_OUT: {
    label: 'Sold Out',
    cls: 'border-white/15 text-white/60',
    dot: 'bg-white/50',
  },
  DRAWING: {
    label: 'Drawing',
    cls: 'border-azure-cyan/35 text-azure-ice',
    dot: 'bg-azure-cyan animate-pulse-dot',
  },
  COMPLETED: {
    label: 'Completed',
    cls: 'border-mint/25 text-mint-soft/80',
    dot: 'bg-mint-soft/70',
  },
  EXPIRED: {
    label: 'Expired',
    cls: 'border-white/10 text-white/40',
    dot: 'bg-white/25',
  },
  REFUNDABLE: {
    label: 'Refundable',
    cls: 'border-brand/45 text-azure-ice',
    dot: 'bg-azure-cyan',
  },
};

export default function StatusBadge({
  status,
  size = 'md',
}: {
  status: PoolStatus;
  size?: 'sm' | 'md';
}) {
  const tone = TONES[status];
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[9.5px]';

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-medium uppercase tracking-[0.14em] ${tone.cls} ${pad}`}
    >
      <span className={`h-1 w-1 rounded-full ${tone.dot}`} />
      {tone.label}
    </span>
  );
}
