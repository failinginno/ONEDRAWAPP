import { motion } from 'motion/react';
import { EnterApp } from './primitives';

export default function FinalCTA() {
  return (
    <section className="relative z-10 hairline-t">
      <div className="relative mx-auto max-w-shell overflow-hidden px-6 py-28 lg:px-10 lg:py-44">
        {/* the flowing field, restated locally so the close feels cinematic */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(760px circle at 50% 62%, rgba(0,210,255,0.13), transparent 68%), radial-gradient(1100px circle at 50% 90%, rgba(11,37,81,0.5), transparent 72%)',
            }}
          />
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="od-cta-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00d2ff" stopOpacity="0" />
                <stop offset="35%" stopColor="#3D81E3" stopOpacity="0.75" />
                <stop offset="65%" stopColor="#A4F4FD" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g filter="url(#od-glow)">
              <path
                d="M -100 420 C 280 300 520 520 900 400 S 1340 240 1560 340"
                fill="none"
                stroke="url(#od-cta-line)"
                strokeWidth="1"
                opacity="0.55"
              />
              <path
                d="M -100 500 C 300 380 560 600 940 470 S 1360 320 1560 430"
                fill="none"
                stroke="url(#od-cta-line)"
                strokeWidth="0.7"
                opacity="0.3"
              />
            </g>
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center text-center"
        >
          <h2 className="max-w-[20ch] text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[3.6rem] md:text-[5rem] lg:text-[5.6rem]">
            Ready for
            <br />
            the next draw?
          </h2>

          <p className="mt-8 max-w-md text-[15px] leading-[1.7] text-white/50">
            Enter ONEDRAW and explore live prize pools on Robinhood Chain.
          </p>

          <div className="mt-11">
            <EnterApp size="lg" />
          </div>

          <p className="mt-14 text-[10px] font-medium uppercase tracking-[0.34em] text-white/35">
            One Pool. One Draw. One Winner.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
