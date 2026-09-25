import { useEffect, useState } from 'react';
import { fmtCountdown } from '../../app/format';
import type { PoolStatus } from '../../domain/models';

/**
 * Presentational countdown.
 *
 * The authoritative value lives in the demo store, which decrements it once a
 * second. This component only formats it — adding its own interval on top would
 * double-tick and make the display jitter.
 */
export default function CountdownTimer({
  seconds,
  started,
  deadline,
  duration = 180,
  status,
  size = 'md',
  className = '',
}: {
  seconds: number;
  started: boolean;
  deadline?: number | null;
  duration?: number;
  status?: PoolStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizes = {
    sm: 'text-[12px]',
    md: 'text-sm',
    lg: 'text-2xl',
    xl: 'text-[2.4rem] md:text-[3rem]',
  } as const;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!started || !deadline || status === 'DRAWING' || status === 'COMPLETED') return;
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [deadline, started, status]);

  const remaining = !started
    ? duration
    : status === 'DRAWING' || status === 'SOLD_OUT' || status === 'COMPLETED'
      ? 0
      : deadline
        ? Math.max(0, Math.ceil((deadline - now) / 1000))
        : seconds;
  const expired = remaining <= 0;
  const urgent = !expired && remaining <= 15;

  return (
    <span
      className={`tabular font-semibold leading-none tracking-[-0.02em] ${
        !started ? 'text-white/35' : expired ? 'text-white/40' : urgent ? 'text-azure-ice' : 'text-white'
      } ${sizes[size]} ${className}`}
    >
      {fmtCountdown(remaining)}
    </span>
  );
}
