import { fmtTicket } from '../../app/format';

type Variant = 'default' | 'own' | 'winner' | 'muted';

const VARIANTS: Record<Variant, string> = {
  default: 'border-white/10 bg-white/[0.03] text-white/60',
  own: 'border-azure-cyan/30 bg-azure-cyan/[0.07] text-azure-ice',
  winner: 'border-azure-cyan/60 bg-azure-cyan/[0.14] text-white shadow-[0_0_18px_rgba(0,210,255,0.35)]',
  muted: 'border-white/[0.06] bg-transparent text-white/25',
};

export default function TicketChip({
  number,
  variant = 'default',
  size = 'md',
}: {
  number: number;
  variant?: Variant;
  size?: 'sm' | 'md';
}) {
  const pad = size === 'sm' ? 'px-2 py-1 text-[10.5px]' : 'px-2.5 py-1.5 text-[12px]';

  return (
    <span
      className={`tabular inline-flex items-center rounded-md border font-mono ${VARIANTS[variant]} ${pad}`}
    >
      {fmtTicket(number)}
    </span>
  );
}
