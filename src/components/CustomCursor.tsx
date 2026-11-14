import { useEffect, useRef } from 'react'

// ============================================================================
// MODULE-LEVEL CURSOR CONTROLLER
// Guarantees cursor is always running, survives StrictMode, tabs, resize, modals
// ============================================================================

interface CursorState {
  dotEl: HTMLElement | null
  ringEl: HTMLElement | null
  labelEl: HTMLElement | null
  containerEl: HTMLElement | null
  rafId: number | null
  lastLoopRun: number
  targetX: number
  targetY: number
  ringX: number
  ringY: number
  isInitialized: boolean
  isVisible: boolean
  isPressed: boolean
  mode: 'default' | 'hover' | 'view' | 'drag' | 'custom' | 'hidden'
  label: string
  watchdogId: number | null
  hasFinePointer: boolean
  hasReducedMotion: boolean
}

const state: CursorState = {
  dotEl: null,
  ringEl: null,
  labelEl: null,
  containerEl: null,
  rafId: null,
  lastLoopRun: 0,
  targetX: -100,
  targetY: -100,
  ringX: -100,
  ringY: -100,
  isInitialized: false,
  isVisible: false,
  isPressed: false,
  mode: 'default',
  label: '',
  watchdogId: null,
  hasFinePointer: true,
  hasReducedMotion: false,
}

function updateRingStyle() {
  if (!state.ringEl) return

  const isPill = state.mode === 'view' || state.mode === 'drag' || state.mode === 'custom'
  const isHover = state.mode === 'hover'

  const width = isPill ? 64 : isHover ? 44 : 32
  const height = isPill ? 28 : isHover ? 44 : 32
  const radius = isPill ? '14px' : '9999px'
  const border = isPill ? '0px' : '1.5px solid #FF5B1F'
  const bg = isPill ? '#FF5B1F' : isHover ? 'rgba(255, 91, 31, 0.08)' : 'transparent'
  const shadow = isPill ? '0 0 16px rgba(255, 91, 31, 0.4)' : 'none'
  const scale = state.isPressed ? 'scale(0.82)' : 'scale(1)'

  state.ringEl.style.width = `${width}px`
  state.ringEl.style.height = `${height}px`
  state.ringEl.style.marginLeft = `-${Math.round(width / 2)}px`
  state.ringEl.style.marginTop = `-${Math.round(height / 2)}px`
  state.ringEl.style.borderRadius = radius
  state.ringEl.style.border = border
  state.ringEl.style.backgroundColor = bg
  state.ringEl.style.boxShadow = shadow

  if (state.dotEl) {
    state.dotEl.style.opacity = isPill ? '0' : '1'
  }

  if (state.labelEl) {
    state.labelEl.style.transform = scale
    if (isPill) {
      state.labelEl.textContent = state.label
      state.labelEl.style.display = 'block'
    } else if (isHover) {
      state.labelEl.textContent = '↗'
      state.labelEl.style.display = 'block'
    } else {
      state.labelEl.textContent = ''
      state.labelEl.style.display = 'none'
    }
  }
}

function showCursor() {
  if (!state.hasFinePointer || state.hasReducedMotion) return
  state.isVisible = true
  if (state.containerEl) {
    state.containerEl.style.opacity = '1'
  }
  document.documentElement.classList.add('has-custom-cursor')
}

function hideCursor() {
  state.isVisible = false
  if (state.containerEl) {
    state.containerEl.style.opacity = '0'
  }
  document.documentElement.classList.remove('has-custom-cursor')
}

function cursorLoop() {
  state.lastLoopRun = performance.now()

  if (state.isVisible && state.dotEl && state.ringEl) {
    // Spring lag on ring
    const lerp = 0.22
    state.ringX += (state.targetX - state.ringX) * lerp
    state.ringY += (state.targetY - state.ringY) * lerp

    const dx = Math.round(state.targetX)
    const dy = Math.round(state.targetY)
    const rx = Math.round(state.ringX)
    const ry = Math.round(state.ringY)

    state.dotEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    state.ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
  }

  state.rafId = requestAnimationFrame(cursorLoop)
}

function ensureRunning() {
  if (typeof window === 'undefined') return

  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId)
    state.rafId = null
  }
  state.rafId = requestAnimationFrame(cursorLoop)
}

// CAPTURE-PHASE EVENT LISTENERS: Modals or stopPropagation can never block these
function onPointerMove(e: PointerEvent) {
  if (e.pointerType === 'touch') {
    hideCursor()
    return
  }

  // Set coordinates immediately on first move (no animation from 0,0)
  if (!state.isInitialized) {
    state.isInitialized = true
    state.targetX = e.clientX
    state.targetY = e.clientY
    state.ringX = e.clientX
    state.ringY = e.clientY
  } else {
    state.targetX = e.clientX
    state.targetY = e.clientY
  }

  showCursor()
}

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  state.isPressed = true
  updateRingStyle()
}

function onPointerUp(e: PointerEvent) {
  state.isPressed = false
  updateRingStyle()
}

function onPointerOver(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  const target = e.target as HTMLElement | null
  if (!target) return

  // Inputs, textarea, select, contenteditable: keep native cursor
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable ||
    target.closest('input, textarea, select, [contenteditable="true"]')
  ) {
    hideCursor()
    return
  }

  showCursor()

  // Check data-cursor attribute
  const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null
  if (cursorTarget) {
    const val = cursorTarget.getAttribute('data-cursor')?.trim()
    if (val === 'View' || val === 'view') {
      state.mode = 'view'
      state.label = 'View'
      updateRingStyle()
      return
    }
    if (val === 'Drag' || val === 'drag') {
      state.mode = 'drag'
      state.label = 'Drag'
      updateRingStyle()
      return
    }
    if (val && val !== 'hover') {
      state.mode = 'custom'
      state.label = val
      updateRingStyle()
      return
    }
    state.mode = 'hover'
    state.label = ''
    updateRingStyle()
    return
  }

  // Check interactive elements: a, button, [role="button"]
  if (
    target.tagName === 'A' ||
    target.tagName === 'BUTTON' ||
    target.closest('a, button, [role="button"]')
  ) {
    state.mode = 'hover'
    state.label = ''
    updateRingStyle()
    return
  }

  state.mode = 'default'
  state.label = ''
  updateRingStyle()
}

let isGlobalListenersAttached = false

function attachGlobalListeners() {
  if (isGlobalListenersAttached || typeof window === 'undefined') return
  isGlobalListenersAttached = true

  // Capture phase on window
  window.addEventListener('pointermove', onPointerMove, { capture: true, passive: true })
  window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true })
  window.addEventListener('pointerup', onPointerUp, { capture: true, passive: true })
  window.addEventListener('pointerover', onPointerOver, { capture: true, passive: true })

  // Visibility and window lifecycle
  document.addEventListener('mouseleave', hideCursor)
  window.addEventListener('blur', hideCursor)
  window.addEventListener('focus', showCursor)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') showCursor()
    else hideCursor()
  })
  window.addEventListener('pageshow', showCursor)
  window.addEventListener('resize', showCursor)

  // Media query listeners (never a one-time check)
  const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
  state.hasFinePointer = hoverMq.matches
  hoverMq.addEventListener('change', (e) => {
    state.hasFinePointer = e.matches
    if (!e.matches) hideCursor()
  })

  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
  state.hasReducedMotion = motionMq.matches
  motionMq.addEventListener('change', (e) => {
    state.hasReducedMotion = e.matches
    if (e.matches) hideCursor()
  })
}

export default function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    state.containerEl = containerRef.current
    state.dotEl = dotRef.current
    state.ringEl = ringRef.current
    state.labelEl = labelRef.current

    attachGlobalListeners()
    ensureRunning()
    updateRingStyle()

    // Watchdog every 1000ms: confirm loop ran in last 1500ms and elements are in DOM
    if (!state.watchdogId) {
      state.watchdogId = window.setInterval(() => {
        const now = performance.now()
        const isStalled = now - state.lastLoopRun > 1500
        const isDetached = state.containerEl && !document.body.contains(state.containerEl)

        if (isStalled || isDetached) {
          ensureRunning()
        }
      }, 1000)
    }

    return () => {
      // Do not destroy on normal React component re-mounts
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ opacity: 0, transition: 'opacity 0.15s ease' }}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none hidden lg:block"
    >
      {/* Center dot - moved only with translate3d in RAF */}
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#FF5B1F] pointer-events-none"
        style={{ willChange: 'transform' }}
      />

      {/* Trailing ring - moved only with translate3d in RAF */}
      <div
        ref={ringRef}
        id="custom-cursor-ring"
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center font-mono text-white text-[10px] font-bold tracking-wider"
        style={{
          width: '32px',
          height: '32px',
          marginLeft: '-16px',
          marginTop: '-16px',
          borderRadius: '9999px',
          border: '1.5px solid #FF5B1F',
          backgroundColor: 'transparent',
          transition:
            'width 0.2s cubic-bezier(0.22, 1, 0.36, 1), height 0.2s cubic-bezier(0.22, 1, 0.36, 1), margin 0.2s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.2s ease, background-color 0.2s ease',
          willChange: 'transform',
        }}
      >
        <div ref={labelRef} style={{ transition: 'transform 0.12s ease' }} className="flex items-center justify-center" />
      </div>
    </div>
  )
}
