import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { projects, Project } from '../data/projects'
import ProjectModal from './ProjectModal'
import ProjectVisual from './ProductVisuals'

// ============================================================================
// SCALED MOCK UI SUBCOMPONENT
// Keeps fixed design dimensions and scales smoothly to fit the right column
// ============================================================================
const ScaledMockUI = memo(function ScaledMockUI({
  project,
  isMounted,
  isSectionInView,
  onOpenModal,
}: {
  project: Project
  isMounted: boolean
  isSectionInView: boolean
  onOpenModal: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const isPhone = project.id === 1 || project.id === 5

  // Fixed design dimensions
  const designWidth = isPhone ? 320 : 580
  const designHeight = isPhone ? 540 : 380

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0) {
          // Scale = columnWidth / designWidth, capped at 1
          const sW = width / designWidth
          const sH = height > 0 ? (height * 0.95) / designHeight : 1
          const computedScale = Math.min(1, sW, sH > 0.3 ? sH : 1)
          setScale(Math.max(0.42, Math.min(1, computedScale)))
        }
      }
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [designWidth, designHeight])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-w-0 overflow-hidden flex items-end justify-end pointer-events-none z-10"
    >
      <div
        onClick={onOpenModal}
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'bottom right',
          opacity: isMounted ? 1 : 0,
          transition: 'opacity 300ms ease-out',
        }}
        className="pointer-events-auto cursor-pointer shrink-0 select-none"
      >
        {isPhone ? (
          /* Phone Frame: fixed 320 x 540 */
          <div className="w-full h-full rounded-[42px] bg-[#16181B] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] p-1 flex flex-col justify-between overflow-hidden">
            <div className="relative flex-1 w-full h-full overflow-hidden rounded-[38px]">
              {isMounted && (
                <ProjectVisual
                  id={project.id}
                  image={project.image}
                  inView={isSectionInView}
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        ) : (
          /* Browser Frame for Web Projects: fixed 580 x 380 */
          <div className="w-full h-full rounded-xl bg-[#16181B] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
            {/* Browser Chrome Header */}
            <div className="h-8 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#121316]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>

              <div className="px-3 py-0.5 bg-[#0E0F11] border border-white/10 rounded-md text-[10px] mono text-[#86868B] flex items-center gap-2 max-w-[260px] w-full mx-3">
                <svg className="w-3 h-3 text-[#FF5B1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span className="text-[#F5F5F7] truncate">
                  {project.id === 2
                    ? 'smartfind.internal/catalog'
                    : project.id === 3
                    ? 'pos.pharmacy.local/fefo'
                    : 'schools.kerala.gov.in/portal'}
                </span>
              </div>

              <span className="text-[9px] mono text-[#FF5B1F] font-semibold">
                {project.id === 2 ? 'CLIP' : project.id === 3 ? 'FEFO' : 'WCAG'}
              </span>
            </div>

            {/* Screen Content Viewport */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              {isMounted && (
                <ProjectVisual
                  id={project.id}
                  image={project.image}
                  inView={isSectionInView}
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

// ============================================================================
// EXPANDING PANELS - WORK / PROJECTS SECTION
// ============================================================================

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [modal, setModal] = useState<Project | null>(null)
  const [isSectionInView, setIsSectionInView] = useState(true)
  const [mountedMockIndex, setMountedMockIndex] = useState<number | null>(0)

  const sectionRef = useRef<HTMLDivElement>(null)
  const hoverTimerRef = useRef<number | null>(null)
  const mountTimerRef = useRef<number | null>(null)
  const panelButtonRefs = useRef<(HTMLDivElement | null)[]>([])
  const isReducedMotion = useRef(false)

  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Mount active mock UI only after panel width transition ends (650ms), unmount immediately while collapsing
  useEffect(() => {
    setMountedMockIndex(null)
    if (mountTimerRef.current) {
      clearTimeout(mountTimerRef.current)
    }

    mountTimerRef.current = window.setTimeout(() => {
      setMountedMockIndex(activeIndex)
    }, 650)

    return () => {
      if (mountTimerRef.current) {
        clearTimeout(mountTimerRef.current)
      }
    }
  }, [activeIndex])

  // Section-level in-view observer for pausing animations when section is off-screen
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Hover intent (120ms delay to prevent flicker during fast mouse passes)
  const handlePanelMouseEnter = useCallback((index: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = window.setTimeout(() => {
      setActiveIndex(index)
    }, 120)
  }, [])

  const handlePanelMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }, [])

  const handlePanelClick = useCallback(
    (index: number) => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
        hoverTimerRef.current = null
      }
      if (index === activeIndex) {
        // Clicking active panel opens detail modal
        setModal(projects[index])
      } else {
        // Clicking collapsed panel expands it immediately
        setActiveIndex(index)
      }
    },
    [activeIndex]
  )

  // Keyboard navigation: Left/Right or Up/Down arrows move between panels, Enter opens modal
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (modal) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const next = (index + 1) % projects.length
        setActiveIndex(next)
        panelButtonRefs.current[next]?.focus()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = (index - 1 + projects.length) % projects.length
        setActiveIndex(prev)
        panelButtonRefs.current[prev]?.focus()
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setModal(projects[index])
      }
    },
    [modal]
  )

  // Dynamic grid template columns for desktop (active panel 5fr, other 4 collapsed 1fr each)
  const getGridTemplateColumns = () => {
    return projects
      .map((_, i) => (i === activeIndex ? '5fr' : '1fr'))
      .join(' ')
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-transparent border-t border-white/[0.08] py-[clamp(48px,7vh,80px)] scroll-mt-14"
    >
      <div className="max-w-7xl xl:max-w-[1380px] mx-auto px-6 sm:px-8 lg:px-10">
        {/* ========================================================= */}
        {/* HEADER ROW                                                */}
        {/* Sits ~40px below the fixed navbar                        */}
        {/* ========================================================= */}
        <div className="fade-block flex items-center justify-between border-b border-white/[0.08] pb-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5B1F] font-semibold">
              02 // SELECTED WORK
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F] shadow-[0_0_8px_#FF5B1F]" />
            <span className="font-mono text-xs text-[#86868B] hidden sm:inline">
              EXPANDING PANELS
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#86868B]">
            <span className="hidden sm:inline">Hover or click a project</span>
            <span className="text-[#F5F5F7] font-semibold">
              <span className="text-[#FF5B1F]">0{activeIndex + 1}</span> / 0{projects.length}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP EXPANDING PANELS (1024px and up, as ONE block)    */}
        {/* ========================================================= */}
        <div className="fade-block hidden lg:block">
          <div
            role="tablist"
            aria-label="Selected projects"
            style={{
              gridTemplateColumns: getGridTemplateColumns(),
              transition: isReducedMotion.current
                ? 'none'
                : 'grid-template-columns 600ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="grid gap-3 h-[70vh] min-h-[520px] max-h-[720px] w-full"
          >
          {projects.map((p, idx) => {
            const isActive = activeIndex === idx

            return (
              <div
                key={p.id}
                ref={(el) => {
                  panelButtonRefs.current[idx] = el
                }}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                aria-expanded={isActive}
                aria-label={`Project 0${idx + 1}: ${p.title}`}
                data-cursor={isActive ? 'View' : undefined}
                onMouseEnter={() => handlePanelMouseEnter(idx)}
                onMouseLeave={handlePanelMouseLeave}
                onClick={() => handlePanelClick(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                style={{
                  background: isActive
                    ? 'radial-gradient(circle at 75% 75%, rgba(255, 91, 31, 0.08) 0%, rgba(14, 15, 17, 1) 70%)'
                    : '#0E0F11',
                }}
                className={`project-panel-card relative rounded-[24px] overflow-hidden border transition-colors duration-400 select-none outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B1F] ${
                  isActive
                    ? 'border-[#FF5B1F]/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]'
                    : 'border-white/[0.08] hover:border-white/20 cursor-pointer'
                }`}
              >
                {/* --------------------------------------------------- */}
                {/* COLLAPSED VIEW (Shown ONLY when panel is collapsed) */}
                {/* --------------------------------------------------- */}
                <div
                  style={{
                    transition: 'opacity 250ms ease-out',
                    opacity: isActive ? 0 : 1,
                    visibility: isActive ? 'hidden' : 'visible',
                    pointerEvents: isActive ? 'none' : 'auto',
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-between py-8 px-2 z-10"
                >
                  {/* Top Big Number */}
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#86868B] group-hover:text-[#F5F5F7] transition-colors">
                    0{idx + 1}
                  </span>

                  {/* Rotated Project Title */}
                  <div
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    className="font-medium tracking-tight text-sm text-[#86868B] hover:text-[#F5F5F7] transition-colors whitespace-nowrap my-auto py-4 max-h-[340px] truncate"
                  >
                    {p.id === 3
                      ? 'Pharmacy Inventory & Billing...'
                      : p.id === 4
                      ? 'Govt School Official Website...'
                      : p.title}
                  </div>

                  {/* Bottom Small + */}
                  <span className="font-mono text-sm text-[#86868B] hover:text-[#FF5B1F] transition-colors">
                    +
                  </span>
                </div>

                {/* --------------------------------------------------- */}
                {/* ACTIVE VIEW (Two-Column CSS Grid: Text & Mock UI)   */}
                {/* --------------------------------------------------- */}
                <div
                  style={{
                    opacity: isActive ? 1 : 0,
                    visibility: isActive ? 'visible' : 'hidden',
                    transition: isReducedMotion.current
                      ? 'none'
                      : isActive
                      ? 'opacity 350ms ease-out 250ms'
                      : 'opacity 150ms ease-in',
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                  className="active-panel-grid absolute inset-0 z-20"
                >
                  {/* Left Column: Project Details in normal flow */}
                  <div className="min-w-0 flex flex-col justify-center space-y-4 z-20 pr-1">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B1F]" />
                      <span className="font-mono text-xs tracking-wider text-[#FF5B1F] font-bold">
                        PROJECT 0{idx + 1}
                      </span>
                      {p.status && (
                        <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#FF5B1F]/15 border border-[#FF5B1F]/30 text-[#FF5B1F]">
                          {p.status}
                        </span>
                      )}
                    </div>

                    <h3
                      style={{ fontSize: 'clamp(28px, 3vw, 48px)' }}
                      className="font-semibold tracking-tight text-[#F5F5F7] leading-tight break-words min-w-0"
                    >
                      {p.title}
                    </h3>

                    <p className="active-panel-desc text-sm text-[#86868B] leading-relaxed break-words min-w-0">
                      {p.description}
                    </p>

                    {/* Tech Chips with Responsive Limits */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.tech.map((t, tIdx) => (
                        <span
                          key={t}
                          className={`font-mono text-xs px-2.5 py-1 bg-[#16181B] border border-white/5 rounded text-[#86868B] ${
                            tIdx >= 4 ? 'panel-compact-hidden' : ''
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                      {p.tech.length > 4 && (
                        <span className="panel-compact-plus font-mono text-xs px-2 py-1 bg-[#16181B] border border-white/5 rounded text-[#FF5B1F]">
                          +{p.tech.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="pt-2 flex items-center gap-4 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setModal(p)
                        }}
                        data-cursor="View"
                        className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#FF5B1F] text-white text-xs font-semibold tracking-wide hover:bg-[#ff6c36] active:scale-95 transition-all shadow-lg shadow-[#FF5B1F]/20 cursor-pointer inline-flex items-center justify-center glow-accent"
                      >
                        View details
                      </button>

                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="min-h-[44px] px-3 py-2 text-xs font-medium text-[#F5F5F7] hover:text-[#FF5B1F] transition-colors inline-flex items-center gap-1.5 group"
                      >
                        <span>GitHub</span>
                        <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                          ↗
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Scaled Mock UI cropped by panel edge */}
                  <div className="min-w-0 w-full h-full overflow-hidden flex items-end justify-end">
                    {isActive && (
                      <ScaledMockUI
                        project={p}
                        isMounted={mountedMockIndex === idx}
                        isSectionInView={isSectionInView}
                        onOpenModal={() => setModal(p)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE VERTICAL ACCORDION (under 1024px)                  */}
        {/* ========================================================= */}
        <div className="fade-block block lg:hidden">
          <div className="space-y-3.5">
          {projects.map((p, idx) => {
            const isOpen = activeIndex === idx
            const cardIsPhone = p.id === 1 || p.id === 5

            return (
              <div
                key={p.id}
                className={`bg-[#0E0F11] border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen ? 'border-[#FF5B1F]/60' : 'border-white/[0.08]'
                }`}
              >
                {/* Row Header Trigger */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="font-mono text-xs font-bold text-[#FF5B1F]">
                      0{idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-[#F5F5F7] truncate">
                      {p.title}
                    </h3>
                    {p.status && (
                      <span className="font-mono text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#FF5B1F]/15 border border-[#FF5B1F]/30 text-[#FF5B1F] shrink-0">
                        {p.status}
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-base text-[#86868B] shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {/* Expanding Content Container via CSS grid-template-rows */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 400ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 pt-1 space-y-4 border-t border-white/[0.06]">
                      <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
                        {p.description}
                      </p>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[11px] px-2 py-0.5 bg-[#16181B] border border-white/5 rounded text-[#86868B]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Static Mock UI */}
                      <div
                        onClick={() => setModal(p)}
                        className="relative bg-[#0A0A0C] border border-white/[0.08] rounded-xl p-3 flex items-center justify-center cursor-pointer overflow-hidden min-h-[220px]"
                      >
                        <div
                          className={`relative overflow-hidden bg-[#16181B] border border-white/10 shadow-lg ${
                            cardIsPhone
                              ? 'w-[220px] h-[340px] rounded-[28px] p-1.5'
                              : 'w-full h-[220px] rounded-lg flex flex-col'
                          }`}
                        >
                          {!cardIsPhone && (
                            <div className="h-7 px-2.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#121316]">
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                              </div>
                              <span className="text-[9px] mono text-[#86868B] truncate max-w-[140px]">
                                {p.id === 2 ? 'smartfind.internal' : p.id === 3 ? 'pos.pharmacy' : 'schools.kerala.gov'}
                              </span>
                              <span className="text-[8px] mono text-[#FF5B1F] font-semibold">STAGE</span>
                            </div>
                          )}

                          <div className="flex-1 overflow-hidden relative">
                            {isOpen && (
                              <ProjectVisual
                                id={p.id}
                                image={p.image}
                                inView={isSectionInView}
                                className="w-full h-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="pt-2 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setModal(p)}
                          className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#FF5B1F] text-white text-xs font-semibold tracking-wide hover:bg-[#ff6c36] active:scale-95 transition-all shadow-md shadow-[#FF5B1F]/20 cursor-pointer inline-flex items-center justify-center glow-accent"
                        >
                          View details
                        </button>
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] px-3 py-2 text-xs font-medium text-[#F5F5F7] hover:text-[#FF5B1F] transition-colors inline-flex items-center gap-1.5 group"
                        >
                          <span>GitHub</span>
                          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                            ↗
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {modal && (
        <ProjectModal
          project={modal}
          onClose={() => setModal(null)}
        />
      )}
    </section>
  )
}
