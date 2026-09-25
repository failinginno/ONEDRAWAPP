import BackgroundField from '../components/BackgroundField';
import ProbabilityField from '../components/ProbabilityField';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import WhatIs from '../components/WhatIs';
import DrawExample from '../components/DrawExample';
import RefundScenario from '../components/RefundScenario';
import HowItWorks from '../components/HowItWorks';
import Transparency from '../components/Transparency';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

const Winners = lazy(() => import('../components/Winners'));

/**
 * ONEDRAW marketing homepage.
 *
 * Moved verbatim out of App.tsx when routing was introduced so the app could
 * live at /app. Layout, typography, hero animation, background field and
 * visual identity are unchanged.
 */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000000] text-white">
      {/* z-0 — looping field surface + cursor light */}
      <BackgroundField />

      {/* z-[1] — abstract probability field, continuous behind every section */}
      <ProbabilityField />

      {/* shared filters — document-scoped, defined exactly once */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="od-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
          />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>

        <filter id="od-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <WhatIs />
          <DrawExample />
          <RefundScenario />
          <HowItWorks />
          <Transparency />
          <Suspense fallback={<section id="winners" className="relative z-10 min-h-96 hairline-t" />}>
            <Winners />
          </Suspense>
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
import { lazy, Suspense } from 'react';
