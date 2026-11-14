import { useEffect } from 'react'

// ============================================================================
// TASK 4: SINGLE SCROLL-DRIVEN FADE SYSTEM (StrictMode-safe module controller)
// One shared IntersectionObserver across the entire portfolio
// ============================================================================

let activeObserver: IntersectionObserver | null = null
let hasLoggedConsoleInfo = false

export function initFadeObserver() {
  if (typeof window === 'undefined') return

  // Disconnect any existing observer from prior mounts (StrictMode safety)
  if (activeObserver) {
    activeObserver.disconnect()
    activeObserver = null
  }

  // Reduced motion: keep everything visible with no transitions
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-block').forEach((el) => {
      el.classList.add('is-in')
      el.classList.remove('fade-wait', 'is-out')
    })
    return
  }

  // Activate CSS fade rules
  document.documentElement.classList.add('fade-ready')

  const blocks = Array.from(document.querySelectorAll<HTMLElement>('.fade-block'))

  // One-time console.info on load
  if (!hasLoggedConsoleInfo) {
    hasLoggedConsoleInfo = true
    console.info(
      `[FadeObserver] Initialized: ${blocks.length} .fade-block elements found. Observer running: true.`
    )
  }

  const checkBlockVisibility = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    const isNoOut = el.classList.contains('fade-block--no-out')
    const isTall = rect.height > vh

    // Check if in view (-12% rootMargin means boundary is vh * 0.88)
    const isIntersecting = rect.top < vh * 0.88 && rect.bottom > 0
    const ratio = rect.height > 0 ? (Math.min(vh, rect.bottom) - Math.max(0, rect.top)) / rect.height : 0

    if (isIntersecting && (isTall || ratio >= 0.1 || (rect.top >= 0 && rect.top < vh * 0.82))) {
      el.classList.add('is-in')
      el.classList.remove('fade-wait', 'is-out')
    } else if (rect.bottom < 0) {
      // Exited through TOP of viewport
      if (!isNoOut) {
        el.classList.add('is-out')
        el.classList.remove('is-in', 'fade-wait')
      }
    } else if (rect.top >= vh * 0.88) {
      // Below viewport / not yet seen
      el.classList.add('fade-wait')
      el.classList.remove('is-in', 'is-out')
    }
  }

  // Initial check: mark blocks already in view on load as .is-in immediately
  blocks.forEach(checkBlockVisibility)

  // Shared IntersectionObserver: thresholds [0, 0.1, 0.9, 1], rootMargin "0px 0px -12% 0px"
  activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement
        const isNoOut = el.classList.contains('fade-block--no-out')
        const vh = window.innerHeight || document.documentElement.clientHeight
        const isTall = entry.boundingClientRect.height > vh

        if (entry.isIntersecting) {
          if (isTall || entry.intersectionRatio >= 0.1) {
            el.classList.add('is-in')
            el.classList.remove('fade-wait', 'is-out')
          }
        } else {
          // Not intersecting
          if (entry.boundingClientRect.bottom < 0 || (entry.boundingClientRect.top < 0 && !isNoOut)) {
            // Left through TOP
            if (!isNoOut) {
              el.classList.add('is-out')
              el.classList.remove('is-in', 'fade-wait')
            }
          } else if (entry.boundingClientRect.top > 0) {
            // Below bottom
            el.classList.add('fade-wait')
            el.classList.remove('is-in', 'is-out')
          }
        }
      })
    },
    {
      threshold: [0, 0.1, 0.9, 1],
      rootMargin: '0px 0px -12% 0px',
    }
  )

  blocks.forEach((el) => activeObserver?.observe(el))

  // Safety re-check function
  const refreshVisibility = () => {
    blocks.forEach(checkBlockVisibility)
  }

  // Nav-jump safety: 1500ms safety timer that ensures blocks at destination are fully visible
  const handleNavJump = () => {
    refreshVisibility()
    setTimeout(refreshVisibility, 200)
    setTimeout(refreshVisibility, 600)
    setTimeout(refreshVisibility, 1500)
  }

  window.addEventListener('resize', refreshVisibility, { passive: true })
  window.addEventListener('orientationchange', refreshVisibility, { passive: true })
  window.addEventListener('pageshow', refreshVisibility, { passive: true })
  window.addEventListener('load', refreshVisibility, { passive: true })
  window.addEventListener('hashchange', handleNavJump)

  // Check when Lenis scroll updates or finishes
  const lenis = (window as any).lenis
  if (lenis) {
    lenis.on('scroll', refreshVisibility)
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      refreshVisibility()
    })
  }

  return () => {
    window.removeEventListener('resize', refreshVisibility)
    window.removeEventListener('orientationchange', refreshVisibility)
    window.removeEventListener('pageshow', refreshVisibility)
    window.removeEventListener('load', refreshVisibility)
    window.removeEventListener('hashchange', handleNavJump)
    if (lenis) {
      lenis.off?.('scroll', refreshVisibility)
    }
    if (activeObserver) {
      activeObserver.disconnect()
      activeObserver = null
    }
  }
}

export function useFadeObserver() {
  useEffect(() => {
    const cleanup = initFadeObserver()
    return () => {
      cleanup?.()
    }
  }, [])
}
