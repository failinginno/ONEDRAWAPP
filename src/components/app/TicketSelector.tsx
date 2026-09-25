import { Minus, Plus } from 'lucide-react';

const QUICK = [1, 3, 5] as const;

export default function TicketSelector({
  qty,
  onChange,
  max,
  disabled = false,
}: {
  qty: number;
  onChange: (qty: number) => void;
  max: number;
  disabled?: boolean;
}) {
  const clamp = (v: number) => Math.max(1, Math.min(max, v));

  return (
    <div>
      <div
        className={`flex items-center justify-between rounded-xl border border-white/[0.09] bg-white/[0.02] px-2 py-2 ${
          disabled ? 'opacity-40' : ''
        }`}
      >
        <button
          type="button"
          aria-label="Decrease tickets"
          disabled={disabled || qty <= 1}
          onClick={() => onChange(clamp(qty - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span className="tabular text-lg font-semibold text-white">{qty}</span>

        <button
          type="button"
          aria-label="Increase tickets"
          disabled={disabled || qty >= max}
          onClick={() => onChange(clamp(qty + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white disabled:pointer-events-none disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-2.5 grid grid-cols-4 gap-2">
        {QUICK.map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled || n > max}
            onClick={() => onChange(clamp(n))}
            className={`rounded-lg border py-2 text-[11.5px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-30 ${
              qty === n
                ? 'border-white/25 bg-white/[0.08] text-white'
                : 'border-white/[0.09] text-white/55 hover:border-white/20 hover:text-white'
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          disabled={disabled || max < 1}
          onClick={() => onChange(clamp(max))}
          className={`rounded-lg border py-2 text-[11.5px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-30 ${
            qty === max
              ? 'border-white/25 bg-white/[0.08] text-white'
              : 'border-white/[0.09] text-white/55 hover:border-white/20 hover:text-white'
          }`}
        >
          MAX
        </button>
      </div>
    </div>
  );
}
