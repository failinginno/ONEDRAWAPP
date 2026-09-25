/**
 * Shared, document-scoped SVG filters.
 *
 * These must be defined exactly once per document or the filter references
 * collide. The homepage defines them inline; every other surface mounts this
 * component instead.
 */
export default function Filters() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="od-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
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
  );
}
