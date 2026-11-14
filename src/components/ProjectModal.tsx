import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '../data/projects'
import ProjectVisual from './ProductVisuals'

interface Props {
  project: Project
  onClose: () => void
}

// Subcomponent to scale Mock UI inside modal using ResizeObserver
function ModalScaledMock({ id, image }: { id: number; image?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const isPhone = id === 1 || id === 5
  const designWidth = isPhone ? 320 : 580
  const designHeight = isPhone ? 540 : 380

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      if (width > 0) {
        // Fill about 90% of column width, cap scale at 1.4
        const computed = (width * 0.90) / designWidth
        setScale(Math.max(0.45, Math.min(1.4, computed)))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [designWidth])

  return (
    <div
      ref={containerRef}
      style={{
        alignSelf: 'center',
        minHeight: Math.round(designHeight * scale),
      }}
      className="relative w-full flex items-center justify-center p-2 self-center my-auto"
    >
      <div
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="shrink-0 select-none"
      >
        <ProjectVisual id={id} image={image} inView={true} />
      </div>
    </div>
  )
}

export default function ProjectModal({ project, onClose }: Props) {
  const modalPanelRef = useRef<HTMLDivElement>(null)
  const scrollBodyRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)
  const isReducedMotion = useRef(false)

  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    previouslyFocusedElement.current = document.activeElement as HTMLElement

    // Stop Lenis & Lock <html> scroll (restore on close)
    const lenis = (window as any).lenis
    lenis?.stop()
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    // Focus scrollable body container on open so Arrow/Page keys scroll it immediately
    setTimeout(() => {
      scrollBodyRef.current?.focus()
    }, 50)

    // Native wheel listener on scrollable body calling stopPropagation()
    const bodyEl = scrollBodyRef.current
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation()
    }
    if (bodyEl) {
      bodyEl.addEventListener('wheel', handleWheel, { passive: true })
    }

    // Keyboard trapping & Esc handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableEls = modalPanelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableEls || focusableEls.length === 0) return
        const firstEl = focusableEls[0]
        const lastEl = focusableEls[focusableEls.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstEl || document.activeElement === scrollBodyRef.current) {
            e.preventDefault()
            lastEl.focus()
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault()
            firstEl.focus()
          } else if (document.activeElement === scrollBodyRef.current) {
            e.preventDefault()
            firstEl.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (bodyEl) {
        bodyEl.removeEventListener('wheel', handleWheel)
      }
      document.documentElement.style.overflow = prevHtmlOverflow
      lenis?.start()
      previouslyFocusedElement.current?.focus()
    }
  }, [onClose])

  const hasLiveDemo = Boolean(
    project.liveUrl &&
      project.liveUrl !== '#' &&
      !project.liveUrl.includes('github.com')
  )

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#050506]/[0.92] select-none"
      onClick={onClose}
    >
      <motion.div
        ref={modalPanelRef}
        onClick={(e) => e.stopPropagation()}
        initial={isReducedMotion.current ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={isReducedMotion.current ? undefined : { opacity: 0, y: 8 }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          width: 'min(1200px, calc(100vw - 32px))',
          height: 'min(700px, calc(100dvh - 32px))',
          maxHeight: 'calc(100dvh - 32px)',
        }}
        className="m-4 bg-[#0E0F11] border border-white/[0.12] rounded-[24px] shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* ========================================================= */}
        {/* HEADER ROW (Always visible at the top, flex: none)        */}
        {/* ========================================================= */}
        <div className="h-14 px-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 flex-none bg-[#121316] z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] shadow-[0_0_8px_#FF5B1F]" />
            <span className="mono text-xs font-semibold tracking-wider text-[#FF5B1F]">
              PROJECT // 0{project.id}
            </span>
            {project.status && (
              <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#FF5B1F]/15 border border-[#FF5B1F]/30 text-[#FF5B1F]">
                {project.status}
              </span>
            )}
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 rounded-full text-xs font-mono text-[#F5F5F7] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF5B1F]"
          >
            Close (Esc)
          </button>
        </div>

        {/* ========================================================= */}
        {/* SCROLLABLE BODY (flex: 1 1 auto, min-height: 0)           */}
        {/* Desktop: Mock UI 45%, Details 55%. Under 900px: 1 column.  */}
        {/* ========================================================= */}
        <div
          ref={scrollBodyRef}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          tabIndex={-1}
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
          }}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain focus:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full items-stretch">
            {/* Mock UI Column (45% on desktop -> 5 cols out of 12) */}
            <div className="lg:col-span-5 bg-[#0A0A0C] border-b lg:border-b-0 lg:border-r border-white/[0.08] p-4 sm:p-6 flex items-center justify-center self-center lg:self-stretch">
              <ModalScaledMock id={project.id} image={project.image} />
            </div>

            {/* Details Column (55% on desktop -> 7 cols out of 12) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-start space-y-6">
              <div className="space-y-6">
                <div>
                  <h3
                    id="modal-title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F5F5F7] tracking-tight"
                  >
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#86868B] mt-2.5 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Numbered Feature List */}
                <div className="space-y-3">
                  <span className="mono text-xs uppercase tracking-wider text-[#86868B] font-semibold block">
                    Key Capabilities
                  </span>
                  <ol className="space-y-2.5 text-xs sm:text-sm text-[#F5F5F7]">
                    {project.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mono text-[#FF5B1F] font-bold text-xs pt-0.5">
                          0{idx + 1}.
                        </span>
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tech Chips */}
                <div>
                  <span className="mono text-xs uppercase tracking-wider text-[#86868B] font-semibold block mb-2.5">
                    Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="mono text-xs px-2.5 py-1 bg-[#16181B] border border-white/5 rounded text-[#86868B]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Verified Highlights */}
                {project.stats && project.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
                    {project.stats.map((s) => (
                      <div key={s.label} className="p-3 bg-[#16181B]/50 border border-white/5 rounded-xl">
                        <div className="text-[10px] mono uppercase text-[#86868B]">{s.label}</div>
                        <div className="text-sm font-semibold text-[#F5F5F7] mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STICKY BOTTOM ACTION BAR (Always visible at bottom, flex: none) */}
        {/* ========================================================= */}
        <div className="h-16 px-6 border-t border-white/[0.08] flex items-center justify-between shrink-0 flex-none bg-[#121316] z-10">
          <div className="flex items-center gap-4">
            {hasLiveDemo && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full bg-[#FF5B1F] text-white text-xs font-semibold hover:bg-[#ff6c36] transition-colors inline-flex items-center gap-1.5 glow-accent"
              >
                <span>Live demo</span>
                <span>→</span>
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-medium text-[#F5F5F7] hover:text-[#FF5B1F] transition-colors inline-flex items-center gap-1.5"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#86868B] hover:text-[#F5F5F7] transition-colors font-mono cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(modalNode, document.body)
}
