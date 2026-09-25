import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Eyebrow, EnterApp, GhostButton, GradientText } from './primitives';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * "One Winner." catches a brief cyan illumination while the brand animation
 * converges to its single point (the field dispatches onedraw:one-start/end).
 * Position, size and typography are untouched — only a momentary light.
 */
function OneWinnerLine() {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const start = () => setLit(true);
    const end = () => setLit(false);
    window.addEventListener('onedraw:one-start', start);
    window.addEventListener('onedraw:one-end', end);
    return () => {
      window.removeEventListener('onedraw:one-start', start);
      window.removeEventListener('onedraw:one-end', end);
    };
  }, []);

  return (
    <span
      className="inline-block transition-[filter] duration-[1200ms] ease-out"
      style={{
        filter: lit
          ? 'drop-shadow(0 0 16px rgba(0,210,255,0.4)) drop-shadow(0 0 44px rgba(11,37,81,0.65)) brightness(1.25)'
          : 'brightness(1)',
      }}
    >
      <GradientText>One Winner.</GradientText>
    </span>
  );
}

export default function Hero() {
  const [filmOpen, setFilmOpen] = useState(false);

  return (
    <section id="top" className="relative z-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-shell flex-col justify-center px-6 pb-24 pt-16 lg:px-10 lg:pb-32 lg:pt-24">
        <motion.div {...rise(0.15)}>
          <Eyebrow>Prize Draws on Robinhood Chain</Eyebrow>
        </motion.div>

        <motion.h1
          {...rise(0.28)}
          className="mt-7 max-w-[16ch] text-[2.7rem] font-semibold leading-[0.94] tracking-[-0.045em] sm:text-[3.8rem] md:text-[4.8rem] lg:text-[6.2rem]"
        >
          One Pool.
          <br />
          One Draw.
          <br />
          <OneWinnerLine />
        </motion.h1>

        <motion.p
          {...rise(0.45)}
          className="mt-8 max-w-lg text-[14px] leading-[1.65] text-white/55 md:text-[15px]"
        >
          ONEDRAW is a transparent, time-based onchain prize draw protocol built for Robinhood
          Chain. Buy tickets with USDG, join fixed-size pools, and increase your odds by holding
          more tickets. If a pool fills before time expires, one ticket wins. If the pool does not
          fill, participants can claim their funds back.
        </motion.p>

        <motion.div {...rise(0.6)} className="mt-9 flex flex-wrap items-center gap-3">
          <EnterApp size="lg" />
          <GhostButton href="#how-it-works" size="lg">
            Learn How It Works
          </GhostButton>
          <button
            type="button"
            onClick={() => setFilmOpen(true)}
            className="group inline-flex min-h-14 items-center gap-2.5 rounded-full border border-white/10 bg-transparent px-5 text-left text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.025] hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-cyan"
            aria-label="Watch the ONEDRAW protocol film"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#86dfff]/70 transition-transform duration-300 group-hover:scale-105 group-hover:text-[#a8eaff]">
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            </span>
            <span className="text-[12px] font-medium tracking-[0.02em]">Watch Film</span>
          </button>
        </motion.div>
      </div>

      {filmOpen && <HeroFilmModal onClose={() => setFilmOpen(false)} />}
    </section>
  );
}

function HeroFilmModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    void videoRef.current?.play().catch(() => undefined);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="ONEDRAW protocol film"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[1280px] overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_35px_120px_rgba(0,0,0,0.8),0_0_60px_rgba(37,149,255,0.12)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close protocol film"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white/70 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-cyan sm:right-4 sm:top-4"
        >
          <X className="h-4 w-4" />
        </button>
        <video
          ref={videoRef}
          src="/videos/onedraw-intro-v2.mp4"
          poster="/images/onedraw-film-cover-v2.webp"
          controls
          autoPlay
          playsInline
          className="aspect-video w-full bg-black object-contain"
        />
      </motion.div>
    </motion.div>
  );
}
