import type { ReactNode } from 'react';
import { Inbox, RotateCcw, Search } from 'lucide-react';

const ICONS = {
  tickets: Inbox,
  refunds: RotateCcw,
  results: Search,
} as const;

/** Minimal, icon-led empty state. No cartoon illustration. */
export default function EmptyState({
  icon = 'tickets',
  title,
  body,
  action,
}: {
  icon?: keyof typeof ICONS;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  const Icon = ICONS[icon];

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.02]">
        <Icon className="h-4 w-4 text-white/35" />
      </div>
      <h3 className="mt-6 text-[15px] font-medium text-white/85">{title}</h3>
      <p className="mt-2.5 max-w-sm text-[13px] leading-[1.65] text-white/40">{body}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
