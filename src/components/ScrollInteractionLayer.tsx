import { useEffect } from 'react'
import { useNavigation } from '../context/NavigationContext'
import { useLiteMode } from '../hooks/useLiteMode'

export default function ScrollInteractionLayer() {
  const { activeSectionNumber } = useNavigation()
  const isLite = useLiteMode()

  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isMobile || isReduced || isLite) return

    // Zero-RAF Event-driven Magnetic Pull on interactive elements
    const magneticItems = document.querySelectorAll<HTMLElement>('button, a, .magnetic-item')
    const cleanupMagnetic: (() => void)[] = []

    magneticItems.forEach((el) => {
      let cachedRect: DOMRect | null = null

      const onMouseEnter = () => {
        cachedRect = el.getBoundingClientRect()
      }

      const onMouseMove = (e: MouseEvent) => {
        if (!cachedRect) cachedRect = el.getBoundingClientRect()
        const centerX = cachedRect.left + cachedRect.width / 2
        const centerY = cachedRect.top + cachedRect.height / 2
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)

        if (dist < 60) {
          const pullX = Math.round((e.clientX - centerX) * 0.2)
          const pullY = Math.round((e.clientY - centerY) * 0.2)
          el.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`
          el.style.transition = 'transform 0.08s ease-out'
        }
      }

      const onMouseLeave = () => {
        cachedRect = null
        el.style.transform = 'translate3d(0px, 0px, 0px)'
        el.style.transition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
      }

      el.addEventListener('mouseenter', onMouseEnter, { passive: true })
      el.addEventListener('mousemove', onMouseMove, { passive: true })
      el.addEventListener('mouseleave', onMouseLeave)

      cleanupMagnetic.push(() => {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mousemove', onMouseMove)
        el.removeEventListener('mouseleave', onMouseLeave)
        el.style.transform = ''
        el.style.transition = ''
      })
    })

    return () => {
      cleanupMagnetic.forEach((fn) => fn())
    }
  }, [isLite])

  return (
    <>
      {/* 1. Thin Accent Scroll Progress Bar at the Top */}
      <div
        id="scroll-progress-bar"
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#FF5B1F] z-[999] origin-left pointer-events-none transition-transform duration-75 shadow-[0_0_8px_#FF5B1F]"
        style={{ transform: 'scaleX(0)' }}
      />

      {/* 2. Side Section Counter "NN / 06" in Mono (Desktop only) */}
      <div
        id="side-section-counter"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 pointer-events-none select-none"
      >
        <div className="w-[1px] h-7 bg-white/10" />
        <div className="font-mono text-[11px] font-semibold tracking-wider text-[#86868B] flex flex-col items-center gap-0.5 bg-[#0E0F11]/92 px-2 py-2 rounded-full border border-white/10">
          <span className="text-[#FF5B1F]">{activeSectionNumber}</span>
          <span className="text-white/20 text-[9px] -my-0.5">/</span>
          <span className="text-[#86868B]">06</span>
        </div>
        <div className="w-[1px] h-7 bg-white/10" />
      </div>
    </>
  )
}
