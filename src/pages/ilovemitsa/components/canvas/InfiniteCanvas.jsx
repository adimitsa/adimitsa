/**
 * InfiniteCanvas  [ilovemitsa/components/canvas]
 *
 * Full-viewport pan/zoom surface.
 *   - Renders the dot-grid background
 *   - Applies a CSS transform to the content layer
 *   - Shows zoom-% and reset HUD
 *
 * Children placed inside live in canvas-space automatically.
 * Accepts a render-prop form: children({ pan, scale, reset }) for
 * children that need to read the current transform.
 */
import { useCallback } from 'react'
import { useCanvasControls } from '../../hooks/useCanvasControls'
import CanvasGrid from './CanvasGrid'

export default function InfiniteCanvas({ children }) {
  const {
    pan,
    scale,
    reset,
    containerRef,
    pointerHandlers,
    touchHandlers,
  } = useCanvasControls()

  // Merge the non-passive wheel ref with the element ref
  const setRef = useCallback((node) => { containerRef(node) }, [containerRef])

  const transform = `translate(${pan.x}px, ${pan.y}px) scale(${scale})`

  return (
    <div
      ref={setRef}
      className="relative w-full h-full overflow-hidden bg-[var(--color-canvas-bg)] cursor-grab active:cursor-grabbing select-none outline-none"
      tabIndex={0}
      {...pointerHandlers}
      {...touchHandlers}
    >
      {/* Dot-grid background — stays fixed in screen space */}
      <CanvasGrid pan={pan} scale={scale} />

      {/* Canvas-space content — transform applied here */}
      <div
        className="absolute top-0 left-0 origin-top-left will-change-transform"
        style={{ transform }}
      >
        {typeof children === 'function'
          ? children({ pan, scale, reset })
          : children}
      </div>

      {/* HUD — zoom level */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
        <span className="text-[11px] font-mono text-[var(--color-ui-muted)] bg-white/80 px-2 py-0.5 rounded border border-[var(--color-ui-border)]">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* HUD — reset button */}
      <button
        onClick={reset}
        className="absolute bottom-4 right-16 text-[11px] font-medium text-[var(--color-ui-muted)] bg-white/80 hover:bg-white px-2 py-0.5 rounded border border-[var(--color-ui-border)] transition-colors cursor-pointer"
        title="Reset view"
      >
        Reset
      </button>
    </div>
  )
}
