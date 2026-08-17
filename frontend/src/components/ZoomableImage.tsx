import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SanctumRing from './SanctumRing'

interface ZoomableImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /**
   * Full-resolution file for the lightbox. Lets the page ship a small thumbnail
   * while pinch-zoom still gets every pixel. Defaults to `src`.
   */
  fullSrc?: string
  /** Rendered dimensions — set both to stop the page reflowing as it loads. */
  width?: number
  height?: number
}

/**
 * Wraps an <img> so clicking it opens a fullscreen lightbox that supports
 * pinch-to-zoom (touch), scroll-to-zoom + drag-to-pan (desktop), and opens/
 * closes with a "portal pinching shut" animation anchored to the thumbnail.
 */
export default function ZoomableImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  fullSrc,
  width,
  height
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const thumbRef = useRef<HTMLImageElement | null>(null)
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' })

  function handleOpen() {
    const rect = thumbRef.current?.getBoundingClientRect()
    if (rect) {
      setOrigin({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
    }
    setOpen(true)
  }

  return (
    <div className={className}>
      <img
        ref={thumbRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleOpen()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${alt} — open fullscreen`}
        data-cursor="active"
        decoding="async"
        className={`cursor-zoom-in ${imgClassName}`}
      />
      {open &&
        createPortal(
          <LightboxModal src={fullSrc || src} alt={alt} origin={origin} onClose={() => setOpen(false)} />,
          document.body
        )}
    </div>
  )
}

interface LightboxModalProps {
  src: string
  alt: string
  origin: { x: string; y: string }
  onClose: () => void
}

function LightboxModal({ src, alt, origin, onClose }: LightboxModalProps) {
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [interacting, setInteracting] = useState(false)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null)
  const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [onClose])

  useEffect(() => {
    if (scale <= 1.01) setPan({ x: 0, y: 0 })
  }, [scale])

  function clampScale(s: number) {
    return Math.min(4, Math.max(1, s))
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setInteracting(true)
    setScale((s) => clampScale(s - e.deltaY * 0.0016))
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    setInteracting(true)
    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      pinchStart.current = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), scale }
    } else if (pointers.current.size === 1 && scale > 1) {
      panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      setScale(clampScale(pinchStart.current.scale * (dist / pinchStart.current.dist)))
    } else if (pointers.current.size === 1 && panStart.current) {
      setPan({
        x: panStart.current.px + (e.clientX - panStart.current.x),
        y: panStart.current.py + (e.clientY - panStart.current.y)
      })
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
    if (pointers.current.size === 0) {
      panStart.current = null
      setTimeout(() => setInteracting(false), 50)
    }
  }

  function handleDoubleClick() {
    setInteracting(true)
    if (scale > 1.05) {
      setScale(1)
    } else {
      setScale(2.4)
    }
    setTimeout(() => setInteracting(false), 250)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/88 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        {/* Pinching portal rings anchored to the thumbnail's screen position */}
        <motion.div
          className="pointer-events-none absolute"
          style={{ left: origin.x, top: origin.y, x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 0.15, rotate: -25 }}
          animate={{ opacity: 0.55, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.15, rotate: 25 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <SanctumRing size={640} color="#22e0ff" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute"
          style={{ left: origin.x, top: origin.y, x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 0.1, rotate: 15 }}
          animate={{ opacity: 0.4, scale: 0.7, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.1, rotate: -15 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <SanctumRing size={420} color="#ff6a3d" />
        </motion.div>

        <motion.div
          className="relative max-h-[85vh] max-w-[92vw] touch-none select-none overflow-hidden rounded-2xl border border-white/15 shadow-glow"
          initial={{ opacity: 0, scale: 0.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.12 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={handleDoubleClick}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transition: interacting ? 'none' : 'transform 0.2s ease-out',
              cursor: scale > 1 ? 'grab' : 'zoom-in'
            }}
            className="block max-h-[85vh] max-w-[92vw] object-contain"
          />
        </motion.div>

        <button
          onClick={onClose}
          data-cursor="active"
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-colors hover:border-ember hover:text-ember-soft"
          aria-label="Close"
        >
          ✕
        </button>

        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-white/40 sm:text-[11px]">
          Scroll/pinch to zoom &middot; drag to pan &middot; double-tap to reset
        </p>
      </motion.div>
    </AnimatePresence>
  )
}
