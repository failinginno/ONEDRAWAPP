import { RotateCcw, TimerOff, Users } from 'lucide-react';
import type { Pool } from '../../app/store';
import { useDemo } from '../../app/store';

/**
 * Demo-only affordances so the whole journey can be reviewed without waiting
 * on a real countdown. Visually subdued and clearly labelled — this is not
 * part of the product surface.
 */
export default function DemoControls({ pool }: { pool: Pool }) {
  const { fillPool, expirePool, reset } = useDemo();

  const finished = pool.status === 'COMPLETED' || pool.status === 'EXPIRED';
  const drawing = pool.status === 'DRAWING' || pool.status === 'SOLD_OUT';

  const cls =
    'inline-flex items-center gap-2 rounded-lg border border-white/[0.09] px-3 py-2 text-[11.5px] font-medium text-white/55 transition-colors hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30';

  return (
    <div className="rounded-xl border border-dashed border-white/[0.1] px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/30">
          Demo controls
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={finished || drawing}
            onClick={() => fillPool(pool.id)}
            className={cls}
          >
            <Users className="h-3.5 w-3.5" />
            Fill pool
          </button>
          <button
            type="button"
            disabled={finished || drawing}
            onClick={() => expirePool(pool.id)}
            className={cls}
          >
            <TimerOff className="h-3.5 w-3.5" />
            Expire pool
          </button>
          <button type="button" onClick={reset} className={cls}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}
