/**
 * useCanvasControls  [ilovemitsa/hooks]
 *
 * Pan + zoom state and all input handling for the infinite canvas.
 *
 * Transform model:
 *   screen position = canvas position * scale + pan
 *
 * Inputs handled:
 *   - Mouse / pen drag → pan
 *   - Scroll wheel     → zoom toward cursor
 *   - Touch pinch      → zoom toward midpoint
 *   - Arrow keys       → pan
 */
import { useState, useRef, useCallback, useEffect } from 'react'

const ZOOM_MIN  = 0.1
const ZOOM_MAX  = 10
const ZOOM_STEP = 0.001   // multiplier per wheel-delta pixel
const PAN_STEP  = 40      // px per arrow-key press

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

export function useCanvasControls() {
  const [pan,   setPan]   = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)

  // Always-current refs so event handlers don't go stale
  const panRef   = useRef(pan)
  const scaleRef = useRef(scale)
  panRef.current   = pan
  scaleRef.current = scale

  // Drag state
  const drag = useRef({ active: false, startX: 0, startY: 0, originPan: { x: 0, y: 0 } })

  // Pinch state
  const pinch = useRef({ active: false, prevDist: 0 })

  // ── Mouse / pen drag ────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originPan: { ...panRef.current },
    }
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return
    setPan({
      x: drag.current.originPan.x + (e.clientX - drag.current.startX),
      y: drag.current.originPan.y + (e.clientY - drag.current.startY),
    })
  }, [])

  const onPointerUp = useCallback(() => {
    drag.current.active = false
  }, [])

  // ── Scroll-to-zoom (zoom toward cursor) ─────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const rect     = e.currentTarget.getBoundingClientRect()
    const cx       = e.clientX - rect.left
    const cy       = e.clientY - rect.top
    const oldScale = scaleRef.current
    const newScale = clamp(oldScale * (1 + -e.deltaY * ZOOM_STEP), ZOOM_MIN, ZOOM_MAX)
    const sf       = newScale / oldScale
    setPan((p) => ({ x: cx - sf * (cx - p.x), y: cy - sf * (cy - p.y) }))
    setScale(newScale)
  }, [])

  // Non-passive wheel listener so preventDefault works
  const containerRef = useCallback((node) => {
    if (!node) return
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // ── Touch pinch ─────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    if (e.touches.length !== 2) return
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    pinch.current = { active: true, prevDist: Math.hypot(dx, dy) }
    drag.current.active = false
  }, [])

  const onTouchMove = useCallback((e) => {
    if (!pinch.current.active || e.touches.length < 2) return
    e.preventDefault()
    const dx    = e.touches[0].clientX - e.touches[1].clientX
    const dy    = e.touches[0].clientY - e.touches[1].clientY
    const dist  = Math.hypot(dx, dy)
    const factor = dist / pinch.current.prevDist
    pinch.current.prevDist = dist
    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = midX - rect.left
    const cy = midY - rect.top
    setScale((prev) => {
      const next = clamp(prev * factor, ZOOM_MIN, ZOOM_MAX)
      const sf   = next / prev
      setPan((p) => ({ x: cx - sf * (cx - p.x), y: cy - sf * (cy - p.y) }))
      return next
    })
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) pinch.current.active = false
  }, [])

  // ── Arrow-key pan ───────────────────────────────────────────────
  useEffect(() => {
    const DIRS = {
      ArrowLeft:  { x:  PAN_STEP, y: 0 },
      ArrowRight: { x: -PAN_STEP, y: 0 },
      ArrowUp:    { x: 0, y:  PAN_STEP },
      ArrowDown:  { x: 0, y: -PAN_STEP },
    }
    const handler = (e) => {
      if (!DIRS[e.key]) return
      e.preventDefault()
      setPan((p) => ({ x: p.x + DIRS[e.key].x, y: p.y + DIRS[e.key].y }))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── Reset to origin ─────────────────────────────────────────────
  const reset = useCallback(() => {
    setPan({ x: 0, y: 0 })
    setScale(1)
  }, [])

  return {
    pan,
    scale,
    reset,
    containerRef,
    pointerHandlers: { onPointerDown, onPointerMove, onPointerUp },
    touchHandlers:   { onTouchStart, onTouchMove, onTouchEnd },
  }
}
