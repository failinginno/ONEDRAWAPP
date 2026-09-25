import { useEffect, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

/**
 * The continuous cinematic field that runs behind the entire page.
 *
 * The old looping "wave" video surface is gone. The field is now built
 * directly from the brand mark: a giant, faint logo ring in the upper
 * right — the open ring, the beam sweeping in from the left, the core
 * point igniting — plus a cursor-reactive light and soft scrims that
 * keep long-form copy legible on top of it.
 */

export function usePointerField() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.42);

  const spring = { stiffness: 45, damping: 24, mass: 0.9 } as const;
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    if (reduced) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth);
      y.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, x, y]);

  return { sx, sy };
}

/*
 * Ring geometry (viewBox 0 0 1200 1200, center 600/600, r 380):
 * an open arc — the gap sits on the LEFT (155°..205°), exactly like the
 * official mark, so the beam crosses horizontally through the opening.
 */
const RING_PATH = 'M 255.6 439.4 A 380 380 0 1 1 255.6 760.6';

function LogoRingSVG() {
  return (
    <svg viewBox="0 0 1200 1200" className="h-full w-full">
      <defs>
        <linearGradient id="od-ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#9ddcf5" />
          <stop offset="1" stopColor="#2b7bf0" />
        </linearGradient>
        {/* userSpaceOnUse — the beam lines have zero-height bounding boxes,
            which makes objectBoundingBox gradients silently render nothing */}
        <linearGradient
          id="od-beam-grad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="600"
          x2="588"
          y2="600"
        >
          <stop offset="0" stopColor="#7dd4ff" stopOpacity="0" />
          <stop offset="0.55" stopColor="#9fe2ff" stopOpacity="0.9" />
          <stop offset="0.9" stopColor="#e8f8ff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <radialGradient id="od-core-grad">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.3" stopColor="#9fe2ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2b9dff" stopOpacity="0" />
        </radialGradient>
        <filter id="od-ring-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id="od-ring-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="52" />
        </filter>
        <filter
          id="od-beam-blur"
          x="-60%"
          y="-600%"
          width="220%"
          height="1300%"
        >
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* wide cyan bloom — separate class, kept dim and soft */}
      <path
        d={RING_PATH}
        className="od-ring-bloom"
        fill="none"
        stroke="#58b8ff"
        strokeWidth="72"
        strokeLinecap="round"
        filter="url(#od-ring-bloom)"
      />

      {/* breathing glow underlay — opacity keyframed, cheap to composite */}
      <path
        d={RING_PATH}
        className="od-ring-halo"
        fill="none"
        stroke="#7fd2ff"
        strokeWidth="38"
        strokeLinecap="round"
        filter="url(#od-ring-blur)"
      />

      {/* crisp ring */}
      <path
        d={RING_PATH}
        fill="none"
        stroke="url(#od-ring-grad)"
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.58"
      />

      {/* the beam — periodically sweeps in from the left toward the core */}
      <line
        x1="-40"
        y1="600"
        x2="588"
        y2="600"
        className="od-beam"
        stroke="url(#od-beam-grad)"
        strokeWidth="9"
        strokeLinecap="round"
        filter="url(#od-beam-blur)"
        opacity="0"
      />
      <line
        x1="-40"
        y1="600"
        x2="588"
        y2="600"
        className="od-beam"
        stroke="url(#od-beam-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0"
      />

      {/* the core point — where the draw happens */}
      <circle
        cx="600"
        cy="600"
        r="85"
        fill="url(#od-core-grad)"
        className="od-core-halo"
      />
      <circle cx="600" cy="600" r="18" fill="#ffffff" className="od-core" />
      <circle cx="600" cy="600" r="34" fill="#bfeaff" className="od-core-halo" opacity="0.55" />
    </svg>
  );
}

export default function BackgroundField() {
  const { sx, sy } = usePointerField();
  const [fade, setFade] = useState(1);

  // the ring field belongs to the hero — fade it out once the page scrolls
  useEffect(() => {
    const onScroll = () => {
      setFade(1 - Math.min(1, window.scrollY / (window.innerHeight * 0.75)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Gentle parallax on the brand field — kept deliberately small (max ~±17px).
  const fieldX = useTransform(sx, (v) => (v - 0.5) * -34);
  const fieldY = useTransform(sy, (v) => (v - 0.5) * -26);
  const farX = useTransform(sx, (v) => (v - 0.5) * 14);
  const farY = useTransform(sy, (v) => (v - 0.5) * 10);

  // Cursor-reactive light.
  const gx = useTransform(sx, (v) => v * 100);
  const gy = useTransform(sy, (v) => v * 100);
  const glow = useMotionTemplate`radial-gradient(760px circle at ${gx}% ${gy}%, rgba(0,210,255,0.10), transparent 66%)`;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* main brand ring — concentric with the hero living mark's core.
          The calc keeps the ring center locked onto the mark core
          (mark box: right 10%, width min(36vw,570px), core at 21% x)
          across viewport sizes. */}
      <div
        className="absolute right-[calc(10vw+0.79*min(36vw,570px)-37vmin)] top-[47%] w-[74vmin] min-w-[480px] -translate-y-1/2"
        style={{ opacity: 0.3 * fade }}
      >
        <motion.div style={{ x: fieldX, y: fieldY }} className="h-full w-full">
          <LogoRingSVG />
        </motion.div>
      </div>

      {/* faint counterweight ring, lower left — depth, not decoration */}
      <motion.div
        style={{ x: farX, y: farY, opacity: 0.16 * fade }}
        className="absolute -bottom-[24%] -left-[14%] w-[46vmin] min-w-[300px]"
      >
        <LogoRingSVG />
      </motion.div>

      {/* legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

      {/* cursor light */}
      <motion.div className="absolute inset-0" style={{ background: glow }} />
    </div>
  );
}
