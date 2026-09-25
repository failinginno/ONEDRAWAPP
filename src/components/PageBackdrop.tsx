/**
 * Ambient backdrop for every surface that is not the homepage.
 *
 * Deliberately restrained — deep navy/black with two soft radial lights and a
 * faint grid. No video, no particle field: documentation and app surfaces
 * should read as calm infrastructure, never decoration.
 */
export default function PageBackdrop({ dense = false }: { dense?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* base */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* top-right electric blue wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1100px circle at 82% -12%, rgba(11,37,81,0.5), transparent 60%), radial-gradient(900px circle at 8% 4%, rgba(0,210,255,0.05), transparent 62%)',
        }}
      />

      {/* faint engineering grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: dense ? '64px 64px' : '112px 112px',
          maskImage: 'radial-gradient(1200px circle at 60% 0%, black, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(1200px circle at 60% 0%, black, transparent 78%)',
        }}
      />
    </div>
  );
}
