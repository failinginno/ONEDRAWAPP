import { motion } from 'motion/react';
import type { PoolStatus } from '../../app/store';
import { fmtProgress } from '../../app/format';

export default function PoolProgress({
  sold,
  capacity,
  status,
  height = 'md',
  showLabel = false,
}: {
  sold: number;
  capacity: number;
  status?: PoolStatus;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  const pct = capacity > 0 ? Math.min(100, (sold / capacity) * 100) : 0;

  const done = status === 'COMPLETED';
  const isDraw = status === 'DRAWING' || status === 'SOLD_OUT';
  const gradient = done
    ? 'linear-gradient(to right, #2F9E75 0%, #6FD3A8 100%)'
    : 'linear-gradient(to right, #0B2551 0%, #3D81E3 55%, #00d2ff 100%)';

  const shadow = done
    ? '0 0 14px rgba(111,211,168,0.45)'
    : '0 0 14px rgba(0,210,255,0.42)';

  const track =
    height === 'sm' ? 'h-[3px]' : height === 'lg' ? 'h-2.5' : 'h-1.5';

  return (
    <div>
      <div className={`relative w-full overflow-hidden rounded-full bg-white/[0.06] ${track}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ backgroundImage: gradient, boxShadow: shadow }}
        />
        {isDraw && (
          <div className="pointer-events-none absolute inset-y-0 w-1/4 animate-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        )}
      </div>

      {showLabel && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-white/30">
          <span className="tabular">{fmtProgress(sold, capacity)} of the pool sold</span>
          <span className="tabular">{Math.max(0, capacity - sold)} tickets remaining</span>
        </div>
      )}
    </div>
  );
}
