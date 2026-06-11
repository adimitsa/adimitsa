/**
 * CanvasGrid  [ilovemitsa/components/canvas]
 *
 * SVG dot-grid that tiles infinitely with the canvas transform.
 * Uses SVG <pattern> — zero JS per frame, GPU-composited.
 *
 * Props:
 *   pan   { x, y }  — current pan offset in px
 *   scale {number}  — current zoom level
 */
const MINOR_GAP   = 24    // px between dots at scale=1
const MAJOR_EVERY = 5     // every Nth dot is larger
const DOT_R       = 1     // minor dot radius
const DOT_R_MAJOR = 1.5   // major dot radius

export default function CanvasGrid({ pan, scale }) {
  const gap      = MINOR_GAP * scale
  const majorGap = gap * MAJOR_EVERY

  // Align pattern origin to pan so the grid feels anchored to canvas-space
  const ox = ((pan.x % majorGap) + majorGap) % majorGap
  const oy = ((pan.y % majorGap) + majorGap) % majorGap

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="ilovemitsa-minor-dots"
          x={ox % gap} y={oy % gap}
          width={gap} height={gap}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={gap / 2} cy={gap / 2} r={DOT_R} fill="var(--color-canvas-dot)" />
        </pattern>

        <pattern
          id="ilovemitsa-major-dots"
          x={ox} y={oy}
          width={majorGap} height={majorGap}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={majorGap / 2} cy={majorGap / 2} r={DOT_R_MAJOR} fill="var(--color-canvas-dot-major)" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#ilovemitsa-minor-dots)" />
      <rect width="100%" height="100%" fill="url(#ilovemitsa-major-dots)" />
    </svg>
  )
}
