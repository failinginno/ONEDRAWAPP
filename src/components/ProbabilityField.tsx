import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * THE CREATION OF THE ONEDRAW SYMBOL.
 *
 * The logo never simply appears — it is generated, beat by beat, from the
 * idea the protocol is named after:
 *
 *   1. MANY POSSIBILITIES  thin light paths and data points drift through
 *                          a dark probability field
 *   2. CONVERGENCE         every path is slowly pulled toward one point
 *   3. ONE DRAW            that point ignites: THE RESULT. One beam extends
 *                          out of it
 *   4. SYMBOL FORMATION    the beam's line reveals the open ring — the "O" —
 *                          crossed by its own light path
 *   5. WORDMARK            ONEDRAW resolves through a light sweep
 *
 * ~14.5s loop. The fixed hero
 * layer still fades out on scroll, and the ignition moment still drives the
 * hero headline's cyan beat via onedraw:one-start / one-end.
 *
 * Deliberately not gambling imagery: no reels, no tickets, no numbers —
 * only light paths converging into one verified result.
 */

/* logical drawing frame — identical box to the previous SVG mark */
const LW = 1000;
const LH = 420;
const C = { x: 210, y: 210 }; // ring center / the selected point
const R = 150;
const CYCLE = 14.5;

/* phase boundaries inside one cycle (seconds) */
const P = {
  many: 0,
  converge: 5.1,
  convergeEnd: 8.3,
  one: 8.8, // THE RESULT ignites
  beam: 9.0,
  beamEnd: 9.9,
  ring: 9.7,
  ringEnd: 11.1,
  word: 11.1,
  wordEnd: 12.1,
  sub: 11.8,
  subEnd: 12.7,
  hold: 13.7, // dissolve begins after the brand hold
  end: CYCLE,
};

/* ring — official gap on the LEFT (155°..205°), beam crosses through it */
const RING_A0 = (-205 * Math.PI) / 180;
const RING_SWEEP = (310 * Math.PI) / 180; // the arc that is actually drawn
const RING_LEN = R * RING_SWEEP;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Pt = [number, number];
const quad = (p0: Pt, pc: Pt, p1: Pt, t: number): Pt => {
  const m = 1 - t;
  return [
    m * m * p0[0] + 2 * m * t * pc[0] + t * t * p1[0],
    m * m * p0[1] + 2 * m * t * pc[1] + t * t * p1[1],
  ];
};

/** deterministic PRNG so the field looks identical on every visit */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

interface Strand {
  p0: Pt;
  pc: Pt;
  p1: Pt;
  period: number;
  off: number;
  delay: number;
  width: number;
  depth: number; // 0 = front (crisp, cyan) · 1 = back (soft, deep blue)
  start: Pt; // frozen position when convergence begins
  cpc: Pt; // control point bending the path into the core
}

function buildStrands(): Strand[] {
  const rnd = mulberry32(0x1d47b3);
  const out: Strand[] = [];

  for (let i = 0; i < 36; i++) {
    const depth = i % 3 === 0 ? 1 : 0;
    const fromLeft = rnd() < 0.72;
    let p0: Pt;
    let p1: Pt;
    if (fromLeft) {
      p0 = [-90 - rnd() * 60, 20 + rnd() * 380];
      p1 = [LW + 90 + rnd() * 60, 20 + rnd() * 380];
    } else {
      const x0 = 60 + rnd() * 880;
      p0 = [x0, -70 - rnd() * 40];
      p1 = [x0 + (rnd() - 0.5) * 260, LH + 70 + rnd() * 40];
    }
    const pc: Pt = [
      (p0[0] + p1[0]) / 2 + (rnd() - 0.5) * 320,
      (p0[1] + p1[1]) / 2 + (rnd() - 0.5) * 340,
    ];
    const period = 9 + rnd() * 8;
    const off = rnd();
    const strand: Strand = {
      p0,
      pc,
      p1,
      period,
      off,
      delay: rnd() * 0.45,
      width: depth ? 2.1 : 1.15,
      depth,
      start: [0, 0],
      cpc: [0, 0],
    };
    // where the strand is at the moment convergence takes over
    const u = ((P.converge / period + off) % 1 + 1) % 1;
    strand.start = quad(p0, pc, p1, u);
    // bend the frozen point into the core with a gentle arc
    const mx = (strand.start[0] + C.x) / 2;
    const my = (strand.start[1] + C.y) / 2;
    const dx = C.x - strand.start[0];
    const dy = C.y - strand.start[1];
    const len = Math.hypot(dx, dy) || 1;
    const bend = (rnd() - 0.5) * 110;
    strand.cpc = [mx + (-dy / len) * bend, my + (dx / len) * bend];
    out.push(strand);
  }
  return out;
}

interface Dust {
  x: number;
  y: number;
  r: number;
  ph: number;
  sp: number;
}

function buildDust(): Dust[] {
  const rnd = mulberry32(0x5eed01); // valid hex
  const out: Dust[] = [];
  for (let i = 0; i < 16; i++) {
    out.push({
      x: 40 + rnd() * 940,
      y: 30 + rnd() * 370,
      r: 0.9 + rnd() * 1.5,
      ph: rnd() * Math.PI * 2,
      sp: 0.18 + rnd() * 0.3,
    });
  }
  return out;
}

const STRANDS = buildStrands();
const DUST = buildDust();

/** ctx with the (newer) letter-spacing knob typed optionally */
type Ctx = CanvasRenderingContext2D & { letterSpacing?: string };

function drawMark(ctx: Ctx, t: number, font: string) {
  ctx.clearRect(0, 0, LW, LH);

  const intro = smooth(0, 0.6, t);
  const outro = 1 - smooth(P.hold, P.end, t);
  const fieldFade = 1 - smooth(P.converge + 0.6, P.one, t);

  ctx.globalAlpha = outro;
  ctx.lineCap = 'round';

  /* ---------- 1. MANY POSSIBILITIES ---------- */
  if (fieldFade > 0.001 && t < P.convergeEnd) {
    // floating data points
    for (const d of DUST) {
      const a = (0.35 + 0.35 * Math.sin(t * d.sp * 2 + d.ph)) * intro * fieldFade;
      if (a <= 0) continue;
      ctx.fillStyle = `rgba(150,215,255,${a * 0.55})`;
      ctx.beginPath();
      ctx.arc(d.x + Math.sin(t * d.sp + d.ph) * 6, d.y + Math.cos(t * d.sp * 0.8 + d.ph) * 5, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // light paths
    for (const st of STRANDS) {
      let headU: number;
      let pts: Pt[];
      const converging = t > P.converge;
      const TRAIL = converging ? 0.2 : 0.3;

      if (!converging) {
        headU = ((t / st.period + st.off) % 1 + 1) % 1;
        const from = Math.max(0, headU - TRAIL);
        pts = [];
        for (let k = 0; k <= 10; k++) {
          pts.push(quad(st.p0, st.pc, st.p1, lerp(from, headU, k / 10)));
        }
      } else {
        const s = clamp01((t - P.converge) / (P.convergeEnd - P.converge));
        const e = easeInOut(clamp01((s - st.delay) / (1 - st.delay)));
        const from = Math.max(0, e - TRAIL);
        pts = [];
        for (let k = 0; k <= 10; k++) {
          pts.push(quad(st.start, st.cpc, [C.x, C.y], lerp(from, e, k / 10)));
        }
        headU = e;
      }

      const envelope = converging
        ? 1 - smooth(0.88, 1, headU)
        : smooth(0, 0.14, headU) * (1 - smooth(0.86, 1, headU));
      const base = st.depth ? 0.45 : 0.85;
      const alpha = base * envelope * intro * (converging ? 1 : fieldFade);
      if (alpha <= 0.004) continue;

      const tail = pts[0];
      const head = pts[pts.length - 1];
      const g = ctx.createLinearGradient(tail[0], tail[1], head[0], head[1]);
      const tint = st.depth ? '90,150,255' : '140,215,255';
      g.addColorStop(0, `rgba(${tint},0)`);
      g.addColorStop(1, `rgba(${tint},${alpha})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = st.width;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
      ctx.stroke();

      // travelling head — the moving data point
      ctx.fillStyle = `rgba(215,240,255,${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(head[0], head[1], st.depth ? 1.3 : 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ---------- 2/3. THE SELECTED RESULT + ONE DRAW ---------- */
  const ignite = smooth(P.one, P.one + 0.35, t);
  if (ignite > 0.001) {
    // selection pulse — one outcome, chosen
    const pulse = 1 - clamp01((t - P.one) / 0.95);
    if (pulse > 0) {
      ctx.strokeStyle = `rgba(160,225,255,${0.35 * pulse})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(C.x, C.y, lerp(12, 74, easeOut(1 - pulse)), 0, Math.PI * 2);
      ctx.stroke();
    }

    // restrained halo — no excessive glow
    const halo = ctx.createRadialGradient(C.x, C.y, 0, C.x, C.y, 34);
    halo.addColorStop(0, `rgba(210,240,255,${0.5 * ignite})`);
    halo.addColorStop(0.4, `rgba(120,200,255,${0.22 * ignite})`);
    halo.addColorStop(1, 'rgba(90,180,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(C.x, C.y, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255,255,255,${ignite})`;
    ctx.beginPath();
    ctx.arc(C.x, C.y, 5.4, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------- 3. ONE DRAW — the single beam ---------- */
  const beamE = easeOut(clamp01((t - P.beam) / (P.beamEnd - P.beam)));
  if (beamE > 0.001 && t > P.beam) {
    const x2 = C.x - 250 * beamE;
    const bg = ctx.createLinearGradient(x2, C.y, C.x, C.y);
    bg.addColorStop(0, 'rgba(125,212,255,0)');
    bg.addColorStop(0.6, `rgba(159,226,255,${0.75 * beamE})`);
    bg.addColorStop(1, `rgba(240,250,255,${0.95 * beamE})`);
    // soft underlay
    ctx.strokeStyle = bg;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x2, C.y);
    ctx.lineTo(C.x - 4, C.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // precise line
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x2, C.y);
    ctx.lineTo(C.x - 4, C.y);
    ctx.stroke();
  }

  /* ---------- 4. SYMBOL FORMATION ---------- */
  const ringE = easeInOut(clamp01((t - P.ring) / (P.ringEnd - P.ring)));
  if (ringE > 0.001 && t > P.ring) {
    ctx.save();
    ctx.setLineDash([RING_LEN, RING_LEN]);
    ctx.lineDashOffset = RING_LEN * (1 - ringE);

    // gradient stroke — white top-left to protocol blue bottom-right
    const rg = ctx.createLinearGradient(70, 70, 352, 352);
    rg.addColorStop(0, '#ffffff');
    rg.addColorStop(0.45, '#9ddcf5');
    rg.addColorStop(1, '#2b7bf0');

    // restrained bloom
    ctx.strokeStyle = 'rgba(88,184,255,0.30)';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(C.x, C.y, R, RING_A0, RING_A0 - RING_SWEEP, true);
    ctx.stroke();

    ctx.strokeStyle = rg;
    ctx.lineWidth = 7.2;
    ctx.beginPath();
    ctx.arc(C.x, C.y, R, RING_A0, RING_A0 - RING_SWEEP, true);
    ctx.stroke();
    ctx.restore();
  }

  /* ---------- 5. WORDMARK ---------- */
  const wordE = easeOut(clamp01((t - P.word) / (P.wordEnd - P.word)));
  if (wordE > 0.001 && t > P.word) {
    const x0 = 378;
    const xEnd = x0 + 545;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0 - 6, 130, (xEnd - x0 + 12) * wordE, 165);
    ctx.clip();

    const wg = ctx.createLinearGradient(x0, 0, xEnd, 0);
    wg.addColorStop(0, '#ffffff');
    wg.addColorStop(0.28, '#f0f7ff');
    wg.addColorStop(0.52, '#9ddcf5');
    wg.addColorStop(0.74, '#4aa3ee');
    wg.addColorStop(1, '#2b7bf0');

    ctx.font = `700 97px ${font}`;
    ctx.letterSpacing = '13px';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = wg;
    ctx.fillText('NEDRAW', x0, C.y);
    ctx.restore();

    // the light sweep that carries the word in
    if (wordE < 1) {
      const sx = x0 + (xEnd - x0) * wordE;
      const sg = ctx.createLinearGradient(sx - 70, 0, sx + 10, 0);
      sg.addColorStop(0, 'rgba(190,235,255,0)');
      sg.addColorStop(1, `rgba(225,245,255,${0.55 * (1 - wordE * 0.2)})`);
      ctx.fillStyle = sg;
      ctx.fillRect(sx - 70, 148, 80, 124);
    }
  }

  /* ---------- brand message ---------- */
  const subE = smooth(P.sub, P.subEnd, t);
  if (subE > 0.001 && t > P.sub) {
    ctx.font = `500 17px ${font}`;
    ctx.letterSpacing = '5px';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255,255,255,${0.2 * subE})`;
    ctx.fillText('MANY POSSIBILITIES', 380, 312);
    ctx.fillStyle = `rgba(170,220,255,${0.3 * subE})`;
    ctx.fillText('ONE RESULT', 380, 338);
    ctx.letterSpacing = '0px';
  }

  ctx.globalAlpha = 1;
  return outro;
}

export default function ProbabilityField() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollFade, setScrollFade] = useState(1);

  // fade the living mark out as the hero scrolls away (gone past 3/4 screen)
  useEffect(() => {
    const onScroll = () => {
      const fade = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.75));
      setScrollFade(fade);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as Ctx | null;
    if (!ctx) return;

    const font =
      getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';

    let raf = 0;
    let disposed = false;
    let lastT = -1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 1;
      const cssH = (cssW * LH) / LW;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      const s = (cssW / LW) * dpr;
      ctx.setTransform(s, 0, 0, s, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      // settled symbol — the brand mark, no motion
      drawMark(ctx, 13.1, font);
      window.dispatchEvent(new Event('onedraw:one-start'));
      return () => {
        disposed = true;
        window.removeEventListener('resize', resize);
        window.dispatchEvent(new Event('onedraw:one-end'));
      };
    }

    const frame = () => {
      if (disposed) return;
      const fade = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.75));
      if (fade <= 0.01 || document.hidden) {
        ctx.clearRect(0, 0, LW, LH);
        raf = requestAnimationFrame(frame);
        return;
      }

      const t = (performance.now() / 1000) % CYCLE;

      // ignition / release beats for the hero headline
      if (lastT >= 0) {
        if (lastT < P.one && t >= P.one) {
          window.dispatchEvent(new Event('onedraw:one-start'));
        }
        if ((lastT < P.hold && t >= P.hold) || t < lastT) {
          window.dispatchEvent(new Event('onedraw:one-end'));
        }
      }
      lastT = t;

      // the tail of the cycle dissolves back into the field; the scroll
      // fade is applied by React on the wrapper
      drawMark(ctx, t, font);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.dispatchEvent(new Event('onedraw:one-end'));
    };
  }, [reduced]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* deep blue bloom — unchanged visual DNA */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(820px circle at 66% 47%, rgba(11,37,81,0.48), transparent 64%), radial-gradient(620px circle at 24% 22%, rgba(0,210,255,0.07), transparent 66%)',
        }}
      />

      {/* the creation of the ONEDRAW symbol */}
      <div
        className="absolute -right-[24%] top-[63%] w-[94vw] -translate-y-1/2 sm:-right-[14%] sm:top-[60%] sm:w-[78vw] md:right-[8%] md:top-[47%] md:w-[min(34vw,570px)] xl:right-[10%]"
        style={{ opacity: scrollFade }}
      >
        <canvas
          ref={canvasRef}
          className="w-full opacity-30 sm:opacity-45 md:opacity-100"
          style={{ aspectRatio: `${LW} / ${LH}` }}
        />
      </div>
    </div>
  );
}
