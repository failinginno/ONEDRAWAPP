/**
 * ONEDRAW brand marks.
 *
 * The symbol is the official logo asset (`public/logo-mark.png`): an open
 * ring — the letter "O" — with a light beam crossing in from the left and
 * igniting one bright point at its center. The wordmark renders the symbol
 * followed by "NEDRAW" with the official white → cyan → blue gradient.
 * The source asset is glow-on-black, alpha-keyed at build time; it sits on
 * dark surfaces everywhere it is used.
 */

const MARK_SRC = '/logo-mark.png';

export function Mark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <img
      src={MARK_SRC}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`select-none object-contain ${className}`}
    />
  );
}

/**
 * Official wordmark gradient — near-white core easing through pale cyan
 * into protocol blue, matching N(white) E(white) D(cyan) R/A/W(blue).
 */
const WORD_GRADIENT =
  'linear-gradient(90deg, #ffffff 0%, #f0f7ff 28%, #9ddcf5 52%, #4aa3ee 74%, #2b7bf0 100%)';

export function Wordmark({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      {/* the ring IS the "O" — beam overflows to the left, letters continue as NEDRAW */}
      <Mark className="h-[1.9em] w-auto shrink-0 -ml-[1.05em] translate-y-[0.02em]" />
      <span className="flex flex-col">
        <span
          className="text-[15px] font-bold leading-none tracking-[0.14em]"
          style={{
            backgroundImage: WORD_GRADIENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}
        >
          NEDRAW
        </span>
        {!compact && (
          <span className="mt-[5px] text-[7.5px] font-medium leading-none tracking-[0.2em] text-white/35">
            PRIZE DRAWS ON ROBINHOOD CHAIN
          </span>
        )}
      </span>
    </span>
  );
}
