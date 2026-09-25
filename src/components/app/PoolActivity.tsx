import { motion } from 'motion/react';
import type { ActivityEvent } from '../../app/store';

const DOT: Record<ActivityEvent['tone'], string> = {
  default: 'bg-white/25',
  accent: 'bg-azure-cyan',
  mint: 'bg-mint-soft',
};

const TEXT: Record<ActivityEvent['tone'], string> = {
  default: 'text-white/65',
  accent: 'text-white/85',
  mint: 'text-mint-soft/85',
};

export default function PoolActivity({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-[13px] text-white/35">
        No activity recorded for this pool yet.
      </div>
    );
  }

  return (
    <ol className="px-5 py-2">
      {events.map((e, i) => (
        <motion.li
          key={e.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
          className="relative flex gap-4 border-b border-white/[0.04] py-3.5 last:border-b-0"
        >
          {/* rail */}
          <span className="relative mt-1.5 flex h-1.5 w-1.5 shrink-0">
            <span className={`h-1.5 w-1.5 rounded-full ${DOT[e.tone]}`} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-4">
              <span className={`text-[12.5px] leading-[1.5] ${TEXT[e.tone]}`}>{e.label}</span>
              <span className="shrink-0 font-mono text-[10.5px] text-white/25">{e.at}</span>
            </div>
            {e.detail && (
              <div className="mt-1 font-mono text-[10.5px] text-white/25">{e.detail}</div>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
