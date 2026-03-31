'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'

const BTN_W = 64

export interface SwipeAction {
  key: string
  icon: ReactNode
  label: string
  onClick: () => void
  color: 'blue' | 'neutral' | 'red'
}

interface Props {
  id: string
  openId: string | null
  onOpen: (id: string | null) => void
  actions: SwipeAction[]
  onTap: () => void
  children: ReactNode
}

const BTN_COLORS: Record<string, string> = {
  blue:    'bg-[#1E3A5F] text-white',
  neutral: 'bg-neutral-500 text-white',
  red:     'bg-red-600 text-white',
}

export default function SwipeableItem({ id, openId, onOpen, actions, onTap, children }: Props) {
  const totalW = actions.length * BTN_W
  const isOpen = openId === id

  const [offset, setOffset]     = useState(0)
  const [settling, setSettling] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos]   = useState({ top: 0, right: 0 })

  const slideRef    = useRef<HTMLDivElement>(null)
  const dotRef      = useRef<HTMLButtonElement>(null)
  const mounted     = useRef(false)
  const snapTimer   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const startX      = useRef(0)
  const startY      = useRef(0)
  const startOffset = useRef(0)
  const lastX       = useRef(0)
  const vel         = useRef(0)
  const moved       = useRef(false)
  const swiping     = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(snapTimer.current)
    }
  }, [])

  // Close when another item opens
  useEffect(() => {
    if (openId !== id) snap(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId])

  // Close menu on scroll
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [menuOpen])

  function snap(target: number) {
    setSettling(true)
    setOffset(target)
    clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      if (mounted.current) setSettling(false)
    }, 320)
  }

  function onDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest('[data-no-swipe]')) return
    startX.current = e.clientX
    startY.current = e.clientY
    startOffset.current = isOpen ? -totalW : 0
    lastX.current = e.clientX
    vel.current = 0
    moved.current = false
    swiping.current = false
    slideRef.current?.setPointerCapture(e.pointerId)
  }

  function onMove(e: React.PointerEvent) {
    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    if (!moved.current) {
      if (Math.abs(dx) < 5) return
      if (Math.abs(dy) > Math.abs(dx)) return // let vertical scroll through
      moved.current = true
      swiping.current = true
    }
    if (!swiping.current) return

    vel.current = e.clientX - lastX.current
    lastX.current = e.clientX

    let raw = startOffset.current + dx
    // Rubber-band resistance at limits
    if (raw > 0) raw = raw * 0.08
    else if (raw < -totalW) raw = -totalW + (raw + totalW) * 0.08

    setSettling(false)
    setOffset(raw)
  }

  function onUp() {
    if (!swiping.current) {
      if (isOpen) {
        snap(0)
        onOpen(null)
      } else {
        onTap()
      }
      return
    }
    swiping.current = false
    const shouldOpen = offset < -totalW * 0.35 || vel.current < -1.5
    if (shouldOpen) {
      snap(-totalW)
      onOpen(id)
    } else {
      snap(0)
      onOpen(null)
    }
  }

  function onCancel() {
    swiping.current = false
    snap(isOpen ? -totalW : 0)
  }

  function openMenu() {
    if (!dotRef.current) return
    const rect = dotRef.current.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    setMenuOpen(true)
  }

  function doAction(a: SwipeAction) {
    snap(0)
    onOpen(null)
    a.onClick()
  }

  useEffect(() => {
    if (!menuOpen) return
    function close(e: PointerEvent) {
      if (dotRef.current?.contains(e.target as Node)) return
      setMenuOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [menuOpen])

  return (
    <div className="relative overflow-hidden">
      {/* Action panel — revealed as card slides left */}
      <div className="absolute inset-y-0 right-0 flex" style={{ width: totalW }}>
        {actions.map(a => (
          <button
            key={a.key}
            data-no-swipe
            onClick={() => doAction(a)}
            className={`flex flex-col items-center justify-center w-16 gap-1 ${BTN_COLORS[a.color]}`}
          >
            {a.icon}
          </button>
        ))}
      </div>

      {/* Sliding card */}
      <div
        ref={slideRef}
        style={{
          transform: `translateX(${offset}px)`,
          transition: settling ? 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
          touchAction: 'pan-y',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        className="relative bg-white z-10"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
      >
        {/* pr-10 leaves room for the 3-dot button */}
        <div className="pr-10">{children}</div>

        {/* 3-dot fallback button */}
        <button
          ref={dotRef}
          data-no-swipe
          onClick={openMenu}
          aria-label="Mais opções"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="4"  cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Dropdown via portal — escapes overflow:hidden */}
      {menuOpen && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-neutral-100 py-1.5 min-w-[160px] overflow-hidden"
          style={{ top: menuPos.top, right: menuPos.right }}
        >
          {actions.map(a => (
            <button
              key={a.key}
              onClick={() => { setMenuOpen(false); doAction(a) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-neutral-50 transition-colors
                ${a.color === 'red' ? 'text-red-600' : 'text-neutral-700'}`}
            >
              <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}
