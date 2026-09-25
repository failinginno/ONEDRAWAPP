import type { ReactNode } from 'react';

/** Consistent section surface used throughout the application. */
export default function Panel({
  title,
  right,
  children,
  className = '',
  bodyClassName = '',
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`od-panel rounded-2xl ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
          {title && (
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              {title}
            </h2>
          )}
          {right}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
