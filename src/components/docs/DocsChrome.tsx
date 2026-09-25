import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

/** Thin top-of-page link row shared by documentation surfaces. */
export function TopLinks({ className = '' }: { className?: string }) {
  const items = [
    { label: 'Home', to: '/' },
    { label: 'App', to: '/app' },
    { label: 'Protocol', to: '/protocol' },
    { label: 'Security', to: '/security' },
    { label: 'Testnet Report', to: '/testnet' },
  ];

  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="rounded-lg px-3 py-2 text-[12.5px] font-medium text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SidebarLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
          isActive
            ? 'bg-white/[0.06] font-medium text-white'
            : 'text-white/45 hover:bg-white/[0.03] hover:text-white/80'
        }`
      }
    >
      <span>{children}</span>
    </NavLink>
  );
}

/** "On this page" — reflects whatever <h2 data-toc> the mounted article has. */
export function useToc(dep: string) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    // Wait a frame so the freshly mounted article has rendered its headings.
    const raf = requestAnimationFrame(() => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('article [data-toc]'));
      const next = nodes
        .filter((n) => Boolean(n.id))
        .map((n) => ({ id: n.id, text: n.textContent?.trim() ?? '' }));
      setItems(next);
      setActive(next[0]?.id ?? '');
    });
    return () => cancelAnimationFrame(raf);
  }, [dep]);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-90px 0px -70% 0px', threshold: [0, 1] },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return { items, active };
}
