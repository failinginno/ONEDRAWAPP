import { motion } from 'motion/react';
import { fmtOdds, oddsValue } from '../../app/format';

/**
 * Odds readout that animates as the ticket quantity changes.
 * `current` and `next` are ticket counts, not percentages.
 */
export default function OddsDisplay({
  current,
  next,
  capacity,
  layout = 'stacked',
}: {
  current: number;
  next: number;
  capacity: number;
  layout?: 'stacked' | 'inline';
}) {
  const currentPct = oddsValue(current, capacity);
  const nextPct = oddsValue(next, capacity);
  const changed = next !== current && next > 0;

  if (layout === 'inline') {
    return (
      <div className="flex items-center gap-2.5">
        <span className="tabular text-[13px] text-white/45">
          {current}/{capacity}
        </span>
        <span className="text-white/20">→</span>
        <motion.span
          key={next}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="tabular text-[13px] font-semibold text-azure-ice"
        >
          {fmtOdds(next, capacity)}
        </motion.span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35">
            Current odds
          </div>
          <div className="tabular mt-2 text-[15px] font-medium text-white/60">
            {fmtOdds(current, capacity)}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35">
            New odds
          </div>
          <motion.div
            key={next}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`tabular mt-2 text-xl font-semibold tracking-[-0.02em] ${
              changed ? 'text-azure-ice' : 'text-white/60'
            }`}
          >
            {fmtOdds(next, capacity)}
          </motion.div>
        </div>
      </div>

      {/* probability track */}
      <div className="relative mt-5 h-[5px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white/20"
          style={{ width: `${currentPct}%` }}
        />
        <motion.div
          animate={{ width: `${nextPct}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            backgroundImage: 'linear-gradient(to right, #0B2551 0%, #3D81E3 55%, #00d2ff 100%)',
            boxShadow: '0 0 14px rgba(0,210,255,0.5)',
          }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/30">
        <span className="tabular">
          {current} of {capacity} tickets
        </span>
        {changed && (
          <motion.span
            key={next}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="tabular text-azure-ice/70"
          >
            +{(nextPct - currentPct).toFixed(2)} pts
          </motion.span>
        )}
      </div>
    </div>
  );
}
